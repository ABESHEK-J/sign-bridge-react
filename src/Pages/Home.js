import React from "react";
import "../App.css";
import "font-awesome/css/font-awesome.min.css";
import Services from "../Components/Home/Services";
import Intro from "../Components/Home/Intro";
import Masthead from "../Components/Home/Masthead";

function Home() {
  return (
    <div className="home-wrapper">
      <Masthead />
      <Intro />
      <Services />
      <div className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="mb-4">Ready to experience Sign Bridge?</h3>
          <a href="/sign-up" className="btn btn-primary btn-lg px-5 py-3">
            Get Started Today <i className="fa fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
