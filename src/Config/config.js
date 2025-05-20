// src/Config/config.js
export const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://sign-bridge-api.herokuapp.com/sign-bridge'
  : 'http://localhost:5000';

export const mongoDBConnection = 'mongodb+srv://FinalYearProject:IamMonkeyDLuffy@cluster0.5wahh.mongodb.net/SignBridgeDB';