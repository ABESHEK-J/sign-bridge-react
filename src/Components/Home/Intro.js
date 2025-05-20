import React from "react";

function Intro() {
  return (
    <section id="intro" className="py-5 bg-white">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="display-5 fw-bold mb-4">Comprehensive Sign Language Solutions</h2>
            <div className="divider my-4 mx-auto"></div>
            <p className="lead text-muted mb-5">
              At Sign Aspirants, we build bridges across communication barriers with technology that transforms how people learn and use sign language. Our comprehensive platform serves everyone from beginners to advanced signers.
            </p>
          </div>
        </div>
        
        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="feature-box text-center p-4">
              <div className="feature-icon mb-4">
                <i className="fa fa-universal-access fa-3x text-primary"></i>
              </div>
              <h4 className="mb-3">Accessibility First</h4>
              <p className="text-muted">
                Designed with inclusivity at its core, ensuring everyone can learn and communicate effectively.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-box text-center p-4">
              <div className="feature-icon mb-4">
                <i className="fa fa-graduation-cap fa-3x text-primary"></i>
              </div>
              <h4 className="mb-3">Interactive Learning</h4>
              <p className="text-muted">
                Engage with our 3D avatar technology for a dynamic, real-time learning experience.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-box text-center p-4">
              <div className="feature-icon mb-4">
                <i className="fa fa-comments fa-3x text-primary"></i>
              </div>
              <h4 className="mb-3">Community Focused</h4>
              <p className="text-muted">
                Join a supportive network of learners and experts sharing resources and knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
