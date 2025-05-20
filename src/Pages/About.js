// src/Pages/About.js
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../App.css';

function About() {
    return (
        <div className="about-page">
            {/* Hero Section with Gradient Background */}
            <div className="page-header bg-gradient-primary text-white py-5 mb-0 position-relative">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <h1 className="display-4 fw-bold mb-3">About Sign Bridge</h1>
                            <div className="divider divider-light mb-4"></div>
                            <p className="lead mb-4">
                                Bridging communication gaps through AI-powered sign language translation, 
                                making the world more accessible one conversation at a time.
                            </p>
                            <a href="#mission" className="btn btn-light btn-lg px-4">
                                Our Mission
                            </a>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block">
                            <div className="masthead-image text-center">
                                <img 
                                    src={require("../Assets/favicon.png")} 
                                    alt="Sign Bridge Logo" 
                                    className="hero-image animated-hero"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="wave-bottom">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#ffffff" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Mission Section */}
            <section id="mission" className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="mission-image">
                                <img 
                                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Sign Language Communication" 
                                    className="img-fluid rounded shadow-lg"
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h2 className="section-title mb-3">Our Mission</h2>
                            <div className="divider divider-primary mb-4"></div>
                            <p className="lead mb-4">
                                Sign Bridge is an innovative AI-enabled system designed to break communication barriers 
                                between the hearing and deaf communities.
                            </p>
                            <p className="mb-4">
                                Our platform translates spoken language into sign language in real-time using advanced 3D 
                                animated avatars, providing a seamless bridge for inclusive communication. We believe that 
                                technology should serve everyone, regardless of ability.
                            </p>
                            <p>
                                By combining artificial intelligence, computer animation, and linguistic expertise, 
                                we're making communication more accessible and fostering greater understanding between communities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section with Stats */}
            <section className="vision-section bg-light py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Our Vision & Impact</h2>
                        <div className="divider divider-primary mx-auto mb-4"></div>
                        <p className="lead col-lg-8 mx-auto">
                            We envision a world where communication has no barriers, and technology serves as the bridge to connect all people.
                        </p>
                    </div>
                    
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="stats-card bg-white p-4 rounded shadow-sm">
                                <div className="stats-icon mb-3">
                                    <i className="fa fa-users text-primary"></i>
                                </div>
                                <h3 className="stats-number">70+ Million</h3>
                                <p className="stats-text">Deaf people worldwide who use sign language as their primary means of communication</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stats-card bg-white p-4 rounded shadow-sm">
                                <div className="stats-icon mb-3">
                                    <i className="fa fa-sign-language text-primary"></i>
                                </div>
                                <h3 className="stats-number">300+</h3>
                                <p className="stats-text">Different sign languages and dialects used globally that need technological support</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="stats-card bg-white p-4 rounded shadow-sm">
                                <div className="stats-icon mb-3">
                                    <i className="fa fa-handshake-o text-primary"></i>
                                </div>
                                <h3 className="stats-number">90%</h3>
                                <p className="stats-text">Of deaf children are born to hearing parents who don't know sign language</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Our Mentor Section - Updated with Dr. Kavitha's information */}
            <section className="mentor-section py-5">
                <div className="container">
                    <h2 className="section-title text-center mb-3">Meet Our Mentor</h2>
                    <div className="divider divider-primary mx-auto mb-5"></div>
                    
                    <div className="row align-items-center">
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <div className="mentor-image-container">
                                <div className="mentor-image-wrapper">
                                    <img 
                                        src={require("../Assets/staff.jpg")} 
                                        alt="Dr. Kavitha Manikandan" 
                                        className="mentor-image"
                                    />
                                </div>
                                <div className="mentor-accent-circle"></div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="mentor-content">
                                <h3 className="mentor-name">Dr. Kavitha Manikandan</h3>
                                <p className="mentor-designation mb-3">Assistant Professor, Department of AI & Data Science</p>
                                <p className="mentor-description mb-4">
                                    With over 15 years of experience in academia, Dr. Kavitha brings exceptional expertise in 
                                    Artificial Intelligence, Machine Learning, and Data Science to the Sign Bridge project. 
                                    She has been with Kathir College of Engineering since October 2019, guiding students in 
                                    cutting-edge technologies and innovative applications.
                                </p>
                                <p className="mentor-description mb-4">
                                    Dr. Kavitha has guided numerous student projects, including funded research by the 
                                    Tamil Nadu State Council for Science and Technology. Her research on "Adaptive Grasping Strategy 
                                    Using Reinforcement Learning for Dynamic Object Manipulation" provided valuable insights for our 
                                    Sign Bridge animation systems.
                                </p>
                                <div className="mentor-achievements">
                                    <div className="achievement">
                                        <i className="fa fa-book text-primary"></i>
                                        <span>Author of "Optimization of Recycling bandwidth in WiMax Technology" (Lambert Academic Publishing, 2022)</span>
                                    </div>
                                    <div className="achievement">
                                        <i className="fa fa-certificate text-primary"></i>
                                        <span>Patent holder: "AI-Based Infant Emotion Prediction Using Wall-Mounted Stickers" (2022)</span>
                                    </div>
                                    <div className="achievement">
                                        <i className="fa fa-graduation-cap text-primary"></i>
                                        <span>M.E. in Computer Science and Engineering with distinction (2011)</span>
                                    </div>
                                    <div className="achievement">
                                        <i className="fa fa-flask text-primary"></i>
                                        <span>Published researcher in AI and Machine Learning applications</span>
                                    </div>
                                </div>
                                <div className="mentor-connect mt-4">
                                    <a href="mailto:kavithamcs@gmail.com" className="btn btn-outline-primary me-3">
                                        <i className="fa fa-envelope me-2"></i>Contact via Email
                                    </a>
                                    <a href="tel:+918939944709" className="btn btn-outline-secondary">
                                        <i className="fa fa-phone me-2"></i>Connect
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Expertise Section - New section highlighting Dr. Kavitha's expertise */}
            <section className="expertise-section bg-light py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 mb-4 mb-lg-0">
                            <h2 className="section-title mb-3">Academic Expertise</h2>
                            <div className="divider divider-primary mb-4"></div>
                            <p className="lead mb-4">
                                Our mentor brings specialized knowledge in key technologies that power the Sign Bridge platform:
                            </p>
                            <img 
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop" 
                                alt="Academic Excellence" 
                                className="img-fluid rounded shadow-lg"
                            />
                        </div>
                        <div className="col-lg-7">
                            <div className="expertise-grid">
                                <div className="expertise-card">
                                    <div className="expertise-icon">
                                        <i className="fa fa-laptop"></i>
                                    </div>
                                    <div className="expertise-content">
                                        <h4>Artificial Intelligence</h4>
                                        <p>Expert in AI theory and applications that power Sign Bridge's translation capabilities, with years of teaching experience in AI fundamentals.</p>
                                    </div>
                                </div>
                                
                                <div className="expertise-card">
                                    <div className="expertise-icon">
                                        <i className="fa fa-code-fork"></i>
                                    </div>
                                    <div className="expertise-content">
                                        <h4>Machine Learning</h4>
                                        <p>Specializes in ML algorithms used for pattern recognition and has published research on reinforcement learning techniques.</p>
                                    </div>
                                </div>
                                
                                <div className="expertise-card">
                                    <div className="expertise-icon">
                                        <i className="fa fa-bar-chart"></i>
                                    </div>
                                    <div className="expertise-content">
                                        <h4>Data Analytics</h4>
                                        <p>Proficient in big data processing and analytics methodologies that enhance Sign Bridge's ability to interpret and translate language.</p>
                                    </div>
                                </div>
                                
                                <div className="expertise-card">
                                    <div className="expertise-icon">
                                        <i className="fa fa-cloud"></i>
                                    </div>
                                    <div className="expertise-content">
                                        <h4>Cloud Computing</h4>
                                        <p>Knowledge of cloud infrastructure that ensures Sign Bridge is scalable, reliable, and accessible from any device.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section py-5">
                <div className="container">
                    <h2 className="section-title text-center mb-3">Meet Our Team</h2>
                    <div className="divider divider-primary mx-auto mb-4"></div>
                    <p className="lead text-center mb-5 col-lg-8 mx-auto">
                        We are Sign Aspirants, a team of AI & Data Science students from Kathir College of Engineering 
                        committed to making sign language accessible through technology.
                    </p>
                    
                    <div className="row g-4">
                        {/* Team Member 1 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <img 
                                        src={require("../Assets/abeshek.jpg")}  
                                        alt="Abeshek J" 
                                        className="team-img"
                                    />
                                    <div className="team-social">
                                        <a href="https://www.linkedin.com/in/abeshek-j-005482248?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_blank" rel="noopener noreferrer">
                                            <i className="fa fa-linkedin"></i>
                                        </a>
                                        <a href="mailto:jayapalabishek@gmail.com">
                                            <i className="fa fa-envelope"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <h3 className="team-name">Abeshek J</h3>
                                    <p className="team-role"> AI Specialist</p>
                                    <p className="team-desc">
                                        Specializes in natural language processing and sign language recognition algorithms.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Member 2 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <img 
                                        src={require("../Assets/elakiya.jpg")} 
                                        alt="Elakiya S" 
                                        className="team-img"
                                    />
                                    <div className="team-social">
                                        <a href="https://www.linkedin.com/in/elakiya-suresh-7552a6288/" target="_blank" rel="noopener noreferrer">
                                            <i className="fa fa-linkedin"></i>
                                        </a>
                                        <a href="mailto:elakiya214@gmail.com">
                                            <i className="fa fa-envelope"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <h3 className="team-name">Elakiya S</h3>
                                    <p className="team-role">UX Designer & Frontend Developer</p>
                                    <p className="team-desc">
                                        Expert in accessibility-focused UX/UI design and frontend development.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Member 3 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <img 
                                        src={require("../Assets/hari.jpg")}
                                        alt="Harivignesh A" 
                                        className="team-img"
                                    />
                                    <div className="team-social">
                                        <a href="https://www.linkedin.com/in/hari-vignesh-225b37255/" target="_blank" rel="noopener noreferrer">
                                            <i className="fa fa-linkedin"></i>
                                        </a>
                                        <a href="mailto:harivignesh2k3@gmail.com">
                                            <i className="fa fa-envelope"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <h3 className="team-name">Harivignesh A</h3>
                                    <p className="team-role">Team Lead & 3D Animation Specialist</p>
                                    <p className="team-desc">
                                        Creates realistic avatar movements and sign language animations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Member 4 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="team-card">
                                <div className="team-img-container">
                                    <img 
                                        src={require("../Assets/lakshana.jpg")} 
                                        alt="Lakshana R" 
                                        className="team-img"
                                    />
                                    <div className="team-social">
                                        <a href="https://www.linkedin.com/in/lakshanaraja11/" target="_blank" rel="noopener noreferrer">
                                            <i className="fa fa-linkedin"></i>
                                        </a>
                                        <a href="mailto:shana.lax007@gmail.com">
                                            <i className="fa fa-envelope"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <h3 className="team-name">Lakshana R</h3>
                                    <p className="team-role">Linguistic Expert</p>
                                    <p className="team-desc">
                                        Ensures accuracy and cultural sensitivity in sign language translations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Details Section with Timeline */}
            <section className="project-section py-5 bg-light">
                <div className="container">
                    <h2 className="section-title text-center mb-3">Project Journey</h2>
                    <div className="divider divider-primary mx-auto mb-5"></div>
                    
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-date">December 2024</div>
                                <h3 className="timeline-title">Project Conception</h3>
                                <p className="timeline-text">
                                    Sign Bridge was conceived as a capstone project idea in the Department of AI & Data Science 
                                    at Kathir College of Engineering with a mission to improve accessibility.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content right">
                                <div className="timeline-date">January 2025</div>
                                <h3 className="timeline-title">Research & Prototype</h3>
                                <p className="timeline-text">
                                    Extensive research into sign language linguistics and development of initial 
                                    AI algorithms for translation. First prototype with basic sign recognition.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-date">February 2025</div>
                                <h3 className="timeline-title">3D Avatar Integration</h3>
                                <p className="timeline-text">
                                    Development of 3D animated avatars capable of fluid sign language motions. 
                                    Integration of motion capture data with natural language processing systems.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content right">
                                <div className="timeline-date">April 2025</div>
                                <h3 className="timeline-title">Launch & Recognition</h3>
                                <p className="timeline-text">
                                    Official launch of Sign Bridge web application with support for Indian Sign Language. 
                                    Project received recognition at regional engineering innovation showcase.
                                </p>
                            </div>
                        </div>
                        
                        <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-date">Ongoing & Future</div>
                                <h3 className="timeline-title">Expansion & Improvement</h3>
                                <p className="timeline-text">
                                    Continuing work to expand language support, improve translation accuracy, 
                                    and develop mobile applications for wider accessibility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="tech-section py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="section-title mb-3">Technology Stack</h2>
                            <div className="divider divider-primary mb-4"></div>
                            <p className="mb-4">
                                Sign Bridge leverages cutting-edge technologies to deliver accurate and responsive 
                                sign language translations:
                            </p>
                            
                            <div className="tech-features">
                                <div className="tech-feature">
                                    <i className="fa fa-react text-primary"></i>
                                    <div>
                                        <h4>React.js & Three.js</h4>
                                        <p>For interactive front-end interfaces and 3D avatar rendering</p>
                                    </div>
                                </div>
                                
                                <div className="tech-feature">
                                    <i className="fa fa-python text-primary"></i>
                                    <div>
                                        <h4>Python & TensorFlow</h4>
                                        <p>Powering our AI translation and natural language processing backend</p>
                                    </div>
                                </div>
                                
                                <div className="tech-feature">
                                    <i className="fa fa-language text-primary"></i>
                                    <div>
                                        <h4>NLP Algorithms</h4>
                                        <p>Custom-trained models for accurate speech-to-sign translation</p>
                                    </div>
                                </div>
                                
                                <div className="tech-feature">
                                    <i className="fa fa-cubes text-primary"></i>
                                    <div>
                                        <h4>3D Animation Systems</h4>
                                        <p>Advanced rigging and animation for fluid sign language movements</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="tech-image-container">
                                <img 
                                    src="https://images.unsplash.com/photo-1581472723648-909f4851d4ae?q=80&w=1740&auto=format&fit=crop" 
                                    alt="Sign Bridge Technology" 
                                    className="img-fluid rounded shadow-lg"
                                />
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section py-5 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="section-title mb-3">Get In Touch</h2>
                            <div className="divider divider-primary mb-4"></div>
                            <p className="lead mb-4">
                                Interested in learning more about Sign Bridge or have suggestions for improvement? 
                                We'd love to hear from you!
                            </p>
                            
                            <div className="contact-card">
                                <div className="contact-item">
                                    <i className="fa fa-envelope-o contact-icon"></i>
                                    <div>
                                        <h4>Email Us</h4>
                                        <p>signbridge@kathir.edu</p>
                                    </div>
                                </div>
                                
                                <div className="contact-item">
                                    <i className="fa fa-map-marker contact-icon"></i>
                                    <div>
                                        <h4>Visit Us</h4>
                                        <p>Department of AI & Data Science<br />Kathir College of Engineering<br />Coimbatore, Tamil Nadu, India</p>
                                    </div>
                                </div>
                                
                                <div className="contact-item">
                                    <i className="fa fa-phone contact-icon"></i>
                                    <div>
                                        <h4>Call Us</h4>
                                        <p>+91 63834 32687</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="contact-form-card">
                                <h3 className="mb-4">Send us a message</h3>
                                <form>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Your Name" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" className="form-control" placeholder="Your Email" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Subject" />
                                    </div>
                                    <div className="mb-3">
                                        <textarea className="form-control" rows="4" placeholder="Your Message"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section bg-gradient-primary text-white py-5">
                <div className="container text-center">
                    <h2 className="display-5 mb-3">Ready to experience Sign Bridge?</h2>
                    <p className="lead mb-4">
                        Try our application today and help us bridge the communication gap
                    </p>
                    <a href="/sign-bridge/convert" className="btn btn-light btn-lg px-4 me-3">
                        <i className="fa fa-play-circle me-2"></i>Try it Now
                    </a>
                    <a href="/sign-bridge/learn" className="btn btn-outline-light btn-lg px-4">
                        <i className="fa fa-graduation-cap me-2"></i>Learn Sign Language
                    </a>
                </div>
            </section>

            {/* CSS Styles */}
            <style jsx="true">{`
                .about-page {
                    font-family: 'Poppins', sans-serif;
                    color: #333;
                }
                
                .bg-gradient-primary {
                    background: linear-gradient(120deg, #3a7bd5, #00d2ff);
                }

                .section-title {
                    font-weight: 700;
                    color: #2d3748;
                }
                
                .lead {
                    font-weight: 400;
                    line-height: 1.6;
                }
                
                .divider {
                    height: 3px;
                    width: 80px;
                    margin-bottom: 1.5rem;
                }
                
                .divider-primary {
                    background-color: #3a7bd5;
                }
                
                .divider-light {
                    background-color: white;
                }
                
                /* Hero section */
                .hero-image {
                    width: 280px;
                    height: auto;
                    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2));
                    transform-origin: center center;
                    animation: float 6s ease-in-out infinite;
                }
                
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(2deg); }
                    50% { transform: translateY(0px) rotate(0deg); }
                    75% { transform: translateY(15px) rotate(-2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                
                .masthead-image {
                    position: relative;
                    padding: 20px;
                }
                
                .masthead-image:before {
                    content: '';
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                    animation: pulse 4s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
                }
                
                /* Mission section */
                .mission-image {
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                }
                
                .mission-badge {
                    position: absolute;
                    top: 20px;
                    right: -30px;
                    background: #3a7bd5;
                    color: white;
                    padding: 8px 30px;
                    transform: rotate(45deg);
                    font-weight: 500;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                
                /* Stats cards */
                .stats-card {
                    height: 100%;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .stats-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .stats-icon {
                    font-size: 2.5rem;
                    color: #3a7bd5;
                }
                
                .stats-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }
                
                /* Mentor section */
                .mentor-image-container {
                    position: relative;
                    padding: 20px;
                }
                
                .mentor-image-wrapper {
                    border-radius: 12px;
                    overflow: hidden;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                }
                
                .mentor-image {
                    width: 100%;
                    display: block;
                    transition: transform 0.3s ease;
                }
                
                .mentor-image:hover {
                    transform: scale(1.03);
                }
                
                .mentor-accent-circle {
                    position: absolute;
                    width: 180px;
                    height: 180px;
                    background: linear-gradient(45deg, #3a7bd5, #00d2ff);
                    border-radius: 50%;
                    bottom: 0;
                    left: 0;
                    z-index: 1;
                }
                
                .mentor-name {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 0.25rem;
                }
                
                .mentor-designation {
                    font-size: 1.1rem;
                    color: #3a7bd5;
                    font-weight: 500;
                }
                
                .achievement {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                
                .achievement i {
                    font-size: 1.25rem;
                    margin-right: 0.75rem;
                }
                
                /* Expertise section */
                .expertise-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 25px;
                }
                
                .expertise-card {
                    background: white;
                    border-radius: 10px;
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .expertise-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .expertise-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(120deg, #3a7bd5, #00d2ff);
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-size: 22px;
                    flex-shrink: 0;
                }

                .expertise-icon i {
                    margin-right:15px;
                }
                
                .expertise-content h4 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .expertise-content p {
                    margin-bottom: 0;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                /* Team section */
                .team-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                }
                
                .team-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 25px rgba(0,0,0,0.12);
                }
                
                .team-img-container {
                    position: relative;
                    overflow: hidden;
                }
                
                .team-img {
                    width: 100%;
                    height: 260px;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }
                
                .team-card:hover .team-img {
                    transform: scale(1.05);
                }
                
                .team-social {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(58, 123, 213, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .team-card:hover .team-social {
                    opacity: 1;
                }

                .team-social i {
                    margin-right: 18px;
                }
                
                .team-social a {
                    text-decoration: none;
                    width: 40px;
                    height: 40px;
                    margin-top: 180px;
                    border-radius: 50%;
                    background: white;
                    color: #3a7bd5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .team-social a:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                }
                
                .team-info {
                    padding: 20px;
                    text-align: center;
                }
                
                .team-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .team-role {
                    color: #3a7bd5;
                    font-weight: 500;
                    font-size: 0.95rem;
                    margin-bottom: 12px;
                }
                
                .team-desc {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 0;
                }
                
                /* Timeline section */
                .timeline {
                    position: relative;
                    padding: 20px 0;
                }
                
                .timeline:before {
                    content: '';
                    position: absolute;
                    width: 3px;
                    background-color: #e9ecef;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .timeline-item {
                    position: relative;
                    margin-bottom: 50px;
                    width: 100%;
                }
                
                .timeline-dot {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: #3a7bd5;
                    border-radius: 50%;
                    top: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 2;
                    box-shadow: 0 0 0 6px rgba(58, 123, 213, 0.2);
                }
                
                .timeline-content {
                    position: relative;
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    width: 45%;
                    left: 0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                
                .timeline-content:before {
                    content: '';
                    position: absolute;
                    top: 15px;
                    right: -10px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    transform: rotate(45deg);
                    box-shadow: 4px -4px 8px rgba(0,0,0,0.05);
                }
                
                .timeline-content.right {
                    left: 55%;
                }
                
                .timeline-content.right:before {
                    left: -10px;
                    right: auto;
                    box-shadow: -4px 4px 8px rgba(0,0,0,0.05);
                }
                
                .timeline-date {
                    display: inline-block;
                    padding: 5px 12px;
                    background: #3a7bd5;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 500;
                    border-radius: 20px;
                    margin-bottom: 10px;
                }
                
                .timeline-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                
                .timeline-text {
                    margin-bottom: 0;
                    color: #666;
                }
                
                /* Technology section */
                .tech-features {
                    display: grid;
                    gap: 20px;
                }
                
                .tech-feature {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                }
                
                .tech-feature i {
                    font-size: 2rem;
                }
                
                .tech-feature h4 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .tech-feature p {
                    margin-bottom: 0;
                    color: #666;
                }
                
                .tech-image-container {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .tech-badge {
                    position: absolute;
                    bottom: 15px;
                    right: 15px;
                    background: #3a7bd5;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 25px;
                    font-weight: 500;
                    font-size: 0.85rem;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                
                /* Contact section */
                .contact-card {
                    background: white;
                    border-radius: 8px;
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }
                
                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                
                .contact-item:last-child {
                    margin-bottom: 0;
                }
                
                .contact-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(58, 123, 213, 0.1);
                    color: #3a7bd5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    margin-right: 15px;
                    flex-shrink: 0;
                }
                
                .contact-item h4 {
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                    font-weight: 600;
                    text-align: left;
                }
                
                .contact-item p {
                    margin-bottom: 0;
                    color: #666;
                    text-align: left;
                }
                
                .contact-form-card {
                    background: white;
                    border-radius: 8px;
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }
                
                .form-control {
                    padding: 12px 15px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    transition: all 0.2s ease;
                }
                
                .form-control:focus {
                    border-color: #3a7bd5;
                    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
                }
                
                /* Media Queries */
                @media (max-width: 991.98px) {
                    .timeline:before {
                        left: 30px;
                    }
                    
                    .timeline-dot {
                        left: 30px;
                    }
                    
                    .timeline-content {
                        width: calc(100% - 60px);
                        left: 60px;
                    }
                    
                    .timeline-content.right {
                        left: 60px;
                    }
                    
                    .timeline-content:before,
                    .timeline-content.right:before {
                        left: -10px;
                        right: auto;
                        box-shadow: -4px 4px 8px rgba(0,0,0,0.05);
                    }
                    
                    .expertise-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                @media (max-width: 767.98px) {
                    .hero-image {
                        width: 220px;
                    }
                    
                    .mentor-accent-circle {
                        width: 150px;
                        height: 150px;
                    }
                    
                    .mentor-name {
                        font-size: 1.75rem;
                    }
                    
                    .timeline-content {
                        padding: 15px;
                    }
                    
                    .stats-icon {
                        font-size: 2rem;
                    }
                    
                    .stats-number {
                        font-size: 1.75rem;
                    }
                }
                
                @media (max-width: 575.98px) {
                    .section-title {
                        font-size: 1.75rem;
                    }
                    
                    .timeline:before {
                        left: 20px;
                    }
                    
                    .timeline-dot {
                        left: 20px;
                    }
                    
                    .timeline-content {
                        width: calc(100% - 40px);
                        left: 40px;
                        padding: 12px;
                    }
                    
                    .timeline-content.right {
                        left: 40px;
                    }
                    
                    .timeline-title {
                        font-size: 1.1rem;
                    }
                    
                    .timeline-date {
                        font-size: 0.75rem;
                        padding: 4px 10px;
                    }
                }
            `}</style>
        </div>
    );
}

export default About;