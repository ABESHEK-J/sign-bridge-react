import React from "react";
import { Link } from "react-router-dom";
import imgConvert from "../../Assets/convert.png";
import imgLearnSign from "../../Assets/learn-sign.png";
import imgVideos from "../../Assets/videos.png";

function Services() {
  return (
    <section id="services" className="py-5 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 fw-bold mb-3">Our Services</h2>
            <div className="divider my-4 mx-auto"></div>
            <p className="lead text-muted">
              Discover our innovative tools designed to make sign language accessible to everyone, combining cutting-edge technology with intuitive user experiences.
            </p>
          </div>
        </div>
        
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="card service-card h-100 border-0 shadow-sm hover-rise">
              <div className="service-image-container">
                <img src={imgConvert} className="card-img-top service-image" alt="Text to Sign Conversion" />
              </div>
              <div className="card-body p-4">
                <h3 className="card-title h4 mb-3">Sign Conversion</h3>
                <p className="card-text">
                  Transform text and speech into fluid sign language animations with our 3D avatar. Customize speed and watch your words come to life with realistic movements.
                </p>
                <ul className="feature-list my-4">
                  <li><i className="fa fa-check text-primary me-2"></i> Text-to-sign translation</li>
                  <li><i className="fa fa-check text-primary me-2"></i> Speech recognition</li>
                  <li><i className="fa fa-check text-primary me-2"></i> Adjustable animation speed</li>
                </ul>
              </div>
              <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <Link to="/sign-bridge/convert" className="btn btn-outline-primary w-100 py-3">
                  Start Converting <i className="fa fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card service-card h-100 border-0 shadow-sm hover-rise">
              <div className="service-image-container">
                <img src={imgLearnSign} className="card-img-top service-image" alt="Learn Sign Language" />
              </div>
              <div className="card-body p-4">
                <h3 className="card-title h4 mb-3">Learn Sign Language</h3>
                <p className="card-text">
                  Master sign language through structured lessons, interactive exercises, and visual demonstrations. Track your progress as you build vocabulary and confidence.
                </p>
                <ul className="feature-list my-4">
                  <li><i className="fa fa-check text-primary me-2"></i> Structured learning path</li>
                  <li><i className="fa fa-check text-primary me-2"></i> Interactive 3D demonstrations</li>
                  <li><i className="fa fa-check text-primary me-2"></i> Progress tracking</li>
                </ul>
              </div>
              <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <Link to="/sign-bridge/learn-sign" className="btn btn-outline-primary w-100 py-3">
                  Start Learning <i className="fa fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card service-card h-100 border-0 shadow-sm hover-rise">
              <div className="service-image-container">
                <img src={imgVideos} className="card-img-top service-image" alt="Learn Sign Language" />
              </div>
              <div className="card-body p-4">
                <h3 className="card-title h4 mb-3">Sign Videos</h3>
                <p className="card-text">
                  Create and share sign language videos from your content. Upload text, type directly, or use speech recognition to generate professional sign language videos.
                </p>
                <ul className="feature-list my-4">
                  <li><i className="fa fa-check text-primary me-2"></i> Video generation</li>
                  <li><i className="fa fa-check text-primary me-2"></i> Community sharing</li>
                  <li><i className="fa fa-check text-primary me-2"></i> Multiple input methods</li>
                </ul>
              </div>
              <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <Link to="/sign-bridge/all-videos" className="btn btn-outline-primary w-100 py-3">
                  Explore Videos <i className="fa fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
}

export default Services;
