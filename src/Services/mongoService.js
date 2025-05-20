// src/Services/mongoService.js - Improved Version
import axios from 'axios';
import { baseURL } from '../Config/config';

// Service for handling MongoDB operations
const mongoService = {
  // Save a sign animation to MongoDB
  saveSign: async (signData) => {
    try {
      // Validate required fields
      if (!signData.name || !signData.id) {
        console.error('Sign data missing required fields:', signData);
        return null;
      }
      
      // Ensure name is uppercase
      signData.name = signData.name.toUpperCase();
      
      // Format the motionData correctly if it exists
      if (signData.motionData) {
        // Ensure animations array exists
        if (!signData.motionData.animations) {
          signData.motionData.animations = [];
        }
        
        // Validate each animation frame
        signData.motionData.animations = signData.motionData.animations.filter(frame => {
          return Array.isArray(frame) && frame.length > 0;
        });
      }
      
      console.log(`Sending sign ${signData.name} to MongoDB API...`);
      const response = await axios.post(`${baseURL}/api/signs`, signData);
      
      // Dispatch event to notify components that we've added a sign
      window.dispatchEvent(new Event('storage-changed'));
      
      return response.data;
    } catch (error) {
      console.error('Error saving sign to MongoDB:', error);
      return null;
    }
  },
  
  // Get all signs from MongoDB with retry logic
  getAllSigns: async (retries = 3, delayMs = 1000) => {
    let attempt = 0;
    
    while (attempt < retries) {
      try {
        console.log(`Fetching all signs from MongoDB, attempt ${attempt + 1}...`);
        const response = await axios.get(`${baseURL}/api/signs`);
        return response.data;
      } catch (error) {
        console.error(`Error getting signs from MongoDB (attempt ${attempt + 1}):`, error);
        attempt++;
        
        if (attempt < retries) {
          // Wait before next retry
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } else {
          // Final attempt failed
          console.error('Failed to fetch signs after maximum retries');
          return [];
        }
      }
    }
  },
  
  // Get sign by name
  getSignByName: async (name) => {
    try {
      // Ensure name is uppercase
      name = name.toUpperCase();
      
      console.log(`Fetching sign ${name} from MongoDB...`);
      const response = await axios.get(`${baseURL}/api/signs/${name}`);
      return response.data;
    } catch (error) {
      // If 404, just return null without error
      if (error.response && error.response.status === 404) {
        console.log(`Sign ${name} not found in MongoDB`);
        return null;
      }
      
      console.error(`Error getting sign ${name} from MongoDB:`, error);
      return null;
    }
  },
  
  // Delete sign
  deleteSign: async (id) => {
    try {
      console.log(`Deleting sign with ID ${id} from MongoDB...`);
      await axios.delete(`${baseURL}/api/signs/${id}`);
      
      // Notify components of the change
      window.dispatchEvent(new Event('storage-changed'));
      
      return true;
    } catch (error) {
      console.error(`Error deleting sign ${id} from MongoDB:`, error);
      return false;
    }
  },
  
  // Search for signs matching a pattern
  searchSigns: async (searchTerm) => {
    try {
      // For now, we'll implement this client-side by getting all signs
      // In a production environment, you'd add a server-side search endpoint
      const allSigns = await mongoService.getAllSigns();
      
      if (!searchTerm || searchTerm.trim() === '') {
        return allSigns;
      }
      
      const normalizedSearch = searchTerm.toUpperCase().trim();
      
      return allSigns.filter(sign => {
        // Search in name
        if (sign.name && sign.name.includes(normalizedSearch)) {
          return true;
        }
        
        // Search in description
        if (sign.description && 
            sign.description.toUpperCase().includes(normalizedSearch)) {
          return true;
        }
        
        // Search in creator
        if (sign.createdBy && 
            sign.createdBy.toUpperCase().includes(normalizedSearch)) {
          return true;
        }
        
        return false;
      });
    } catch (error) {
      console.error('Error searching signs:', error);
      return [];
    }
  }
};

export default mongoService;