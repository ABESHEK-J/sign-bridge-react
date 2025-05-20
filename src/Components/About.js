import React from 'react';

const About = () => {
    return (
        <>
            <div className="about-content">
                <h2>About Sign Bridge</h2>
                <p>Sign Bridge is an innovative AI-enabled system that translates spoken language into sign language in real-time using animated avatars. Our mission is to break down communication barriers and promote inclusivity for people with hearing and speech impairments.</p>
            </div>

            <h2>Our Team: Sign Aspirants</h2>
            <div className="team-container">
                {/* Team Member 1 */}
                <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop" className="member-photo" alt="Abeshek J" />
                    <div className="member-info">
                        <h3>Abeshek J</h3>
                        <p className="designation">AI & Data Science</p>
                        <p>Reg No: 711621243001</p>
                        <p>Email: jayapalabishek@gmail.com</p>
                        <p>Mobile: 9345892089</p>
                        <div className="social-links">
                            <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" title="GitHub"><i className="fab fa-github"></i></a>
                            <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>

                {/* Team Member 2 */}
                <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop" className="member-photo" alt="Elakiya S" />
                    <div className="member-info">
                        <h3>Elakiya S</h3>
                        <p className="designation">AI & Data Science</p>
                        <p>Reg No: 711621243014</p>
                        <p>Email: elakiya214@gmail.com</p>
                        <p>Mobile: 7339254297</p>
                        <div className="social-links">
                            <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" title="GitHub"><i className="fab fa-github"></i></a>
                            <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>

                {/* Team Member 3 */}
                <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374&auto=format&fit=crop" className="member-photo" alt="Harivignesh A" />
                    <div className="member-info">
                        <h3>Harivignesh A</h3>
                        <p className="designation">AI & Data Science</p>
                        <p>Reg No: 711621243017</p>
                        <p>Email: Harivignesh2k3@gmail.com</p>
                        <p>Mobile: 6383432687</p>
                        <div className="social-links">
                            <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" title="GitHub"><i className="fab fa-github"></i></a>
                            <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>

                {/* Team Member 4 */}
                <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1261&auto=format&fit=crop" className="member-photo" alt="Lakshana R" />
                    <div className="member-info">
                        <h3>Lakshana R</h3>
                        <p className="designation">AI & Data Science</p>
                        <p>Reg No: 711621243025</p>
                        <p>Email: shana.lax007@gmail.com</p>
                        <p>Mobile: 9940771551</p>
                        <div className="social-links">
                            <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" title="GitHub"><i className="fab fa-github"></i></a>
                            <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>

                {/* Mentor */}
                <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1476&auto=format&fit=crop" className="member-photo" alt="Mentor" />
                    <div className="member-info">
                        <h3>Mentor</h3>
                        <p className="designation">Guide</p>
                        <p>Department: AI & Data Science</p>
                        <p>Email: mentor@example.com</p>
                        <p>Mobile: Contact Number</p>
                        <div className="social-links">
                            <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" title="Academic Profile"><i className="fas fa-graduation-cap"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="project-details">
                <h2>Project Details</h2>
                <p>Sign Bridge is developed as part of a project at Kathir College of Engineering (College Code: 7116). The project aims to address the challenges faced by persons with hearing and speech impairments in accessing and participating in real-time communication during government functions and public events.</p>
                <p>By leveraging AI and animation technologies, Sign Bridge provides an innovative solution that eliminates dependency on human interpreters while ensuring accurate and contextually appropriate sign language interpretations.</p>
            </div>

            <div className="approach">
                <h2>Our Approach</h2>
                <p>Our solution combines several cutting-edge technologies:</p>
                <ul>
                    <li><i className="fas fa-microphone"></i> <strong>Speech Recognition:</strong> Advanced algorithms to convert spoken language into text</li>
                    <li><i className="fas fa-brain"></i> <strong>Natural Language Processing:</strong> Contextual understanding of the transcribed text</li>
                    <li><i className="fas fa-sign-language"></i> <strong>Sign Language Translation:</strong> Converting text to sign language gestures</li>
                    <li><i className="fas fa-cube"></i> <strong>3D Animation:</strong> Realistic avatar movements to represent sign language</li>
                </ul>
            </div>

            <div className="mission">
                <h2>Our Mission</h2>
                <p>At Sign Aspirants, we believe in creating technology that truly serves humanity. Our mission is to break down communication barriers and create a more inclusive world where everyone has equal access to information and communication, regardless of physical abilities.</p>
            </div>
        </>
    );
};

export default About;
