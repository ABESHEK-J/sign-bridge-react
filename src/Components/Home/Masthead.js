import React from "react";
import { Link } from "react-router-dom";

function Masthead() {
    return (
        <div className="masthead position-relative">
            {/* Background overlay with gradient */}
            <div className="masthead-overlay"></div>
            
            {/* Floating shapes for modern design */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            
            <div className="container position-relative z-index-1">
                <div className="row min-vh-80 align-items-center">
                    <div className="col-lg-6">
                        <div className="masthead-content pe-lg-5">
                            <h1 className="text-white display-4 fw-bold mb-4 animate__animated animate__fadeInUp">
                                Bridging Communication Gaps Through Sign Language
                            </h1>
                            <p className="text-white-75 lead mb-5 animate__animated animate__fadeInUp animate__delay-1s">
                                Empowering connections between hearing and deaf communities with innovative, accessible technology solutions.
                            </p>
                            <div className="d-flex gap-3 animate__animated animate__fadeInUp animate__delay-2s">
                                <Link to="/sign-bridge/convert" className="btn btn-primary btn-lg px-4 py-3">
                                    Start Translating <i className="fa fa-arrow-right ms-2"></i>
                                </Link>
                                <a href="#intro" className="btn btn-outline-light btn-lg px-4 py-3">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 d-none d-lg-block">
    <div className="masthead-image text-center">
        <img 
            src={require("../../Assets/favicon.png")} 
            alt="Hero image" 
            className="hero-image animated-hero"
        />
    </div>
</div>

                </div>
            </div>
            
            {/* Wave divider */}
            <div className="wave-divider">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 150">
                    <path fill="#ffffff" fillOpacity="1" d="M0,96L60,90.7C120,85,240,75,360,80C480,85,600,107,720,112C840,117,960,107,1080,90.7C1200,75,1320,53,1380,42.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
            </div>
        </div>
    );
}

export default Masthead;
