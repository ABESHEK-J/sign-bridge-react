import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import VideoCard from "../Components/Videos/VideoCard";
import { baseURL } from "../Config/config";

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const navigate = useNavigate();

    const retrieveVideos = () => {
        setLoading(true);
        axios
            .get(`${baseURL}/videos/all-videos`)
            .then((res) => {
                setVideos(res.data);
                console.log(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(retrieveVideos, []);

    const handleClick = (videoId) => {
        navigate(`/sign-bridge/video/${videoId}`, { replace: false });
    };

    // For demo purposes - sample categories
    const categories = [
        { id: "all", name: "All Videos" },
        { id: "alphabet", name: "Alphabet Signs" },
        { id: "common", name: "Common Phrases" },
        { id: "greetings", name: "Greetings" },
        { id: "recent", name: "Recently Added" }
    ];

    // Filter videos based on selected category (would need proper category data in real implementation)
    const filteredVideos = selectedCategory === "all" 
        ? videos 
        : videos.filter(video => video.category === selectedCategory);

    const videoList = filteredVideos.map((video, index) => (
        <VideoCard key={index} video={video} handleClick={handleClick} />
    ));

    return (
        <div className="videos-page">
            {/* Hero section with gradient background */}
            <div className="page-header bg-gradient-primary text-white py-5 mb-0">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <h1 className="display-4 fw-bold mb-3">Sign Language Videos</h1>
                            <div className="divider divider-light mb-4"></div>
                            <p className="lead mb-4">
                                Explore our collection of sign language videos created by our community. 
                                Learn new signs or create your own animations to help others.
                            </p>
                            <Link to='/sign-bridge/create-video' className="btn btn-light btn-lg px-4 me-2">
                                <i className="fa fa-plus-circle me-2"></i>
                                Create Your Sign
                            </Link>
                            <a href="#video-feed" className="btn btn-outline-light btn-lg px-4">
                                <i className="fa fa-play-circle me-2"></i>
                                Browse Videos
                            </a>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block">
                            <div className="image-placeholder bg-white bg-opacity-25 rounded p-4 text-center">
                                <i className="fa fa-sign-language display-1 text-white mb-3"></i>
                                <p className="mb-0">Communicate without barriers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create video section */}
            <section id="create-video" className="bg-light py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-5">
                                    <h2 className="card-title mb-3">Create Your Own Sign Animation</h2>
                                    <p className="card-text text-muted mb-4">
                                        In just a few simple steps, you can contribute to our growing library of sign language animations:
                                    </p>
                                    <div className="steps mb-4">
                                        <div className="step d-flex mb-3">
                                            <div className="step-icon me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "36px", height: "36px"}}>
                                                <i className="fa fa-video-camera" style={{marginRight:20}}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Upload your video</h6>
                                                <p className="text-muted small mb-0">Record a clear demonstration of the sign</p>
                                            </div>
                                        </div>
                                        <div className="step d-flex mb-3">
                                            <div className="step-icon me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "36px", height: "36px"}}>
                                                <i className="fa fa-pencil" style={{marginRight:20}}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Name your sign</h6>
                                                <p className="text-muted small mb-0">Add details about what the sign represents</p>
                                            </div>
                                        </div>
                                        <div className="step d-flex">
                                            <div className="step-icon me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "36px", height: "36px"}}>
                                                <i className="fa fa-magic" style={{marginRight:20}}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Let our system convert it</h6>
                                                <p className="text-muted small mb-0">We'll create a 3D animation from your video</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to='/sign-bridge/create-video' className="btn btn-primary btn-lg px-4">
                                        Start Creating Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="bg-white rounded shadow-sm p-4">
                                <h3 className="mb-3">Why Create Custom Signs?</h3>
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="feature-icon me-3 bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                                            <i className="fa fa-users" style={{marginRight:20}}></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Help the community</h5>
                                            <p className="mb-0 text-muted small">Expand our library for everyone's benefit</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="feature-icon me-3 bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                                            <i className="fa fa-graduation-cap" style={{marginRight:20}}></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Learn by teaching</h5>
                                            <p className="mb-0 text-muted small">Reinforce your learning by creating signs</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="feature-icon me-3 bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                                            <i className="fa fa-comments" style={{marginRight:20}}></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Share specialized signs</h5>
                                            <p className="mb-0 text-muted small">Add domain-specific or regional variations</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video feed section */}
            <section id="video-feed" className="py-5">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-lg-6">
                            <h2 className="mb-0">Browse Sign Videos</h2>
                            <div className="divider my-3" style={{width: "80px", height: "3px", background: "#3a7bd5"}}></div>
                            <p className="text-muted">
                                Explore our growing collection of sign language videos. Click on any video to view details and learn the sign.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex justify-content-lg-end">
                                <div className="input-group" style={{maxWidth: "400px"}}>
                                    <input type="text" className="form-control" placeholder="Search for signs..." />
                                    <button className="btn btn-primary" type="button">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category filter tabs */}
                    <div className="category-tabs mb-4">
                        <ul className="nav nav-pills">
                            {categories.map(category => (
                                <li className="nav-item me-2 mb-2" key={category.id}>
                                    <button 
                                        className={`nav-link ${selectedCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Video grid */}
                    <div className="row g-4">
                        {loading ? (
                            <div className="col-12 text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3">Loading videos...</p>
                            </div>
                        ) : videoList.length > 0 ? (
                            videoList
                        ) : (
                            <div className="col-12 text-center py-5">
                                <div className="empty-state">
                                    <i className="fa fa-video-camera display-1 text-muted mb-3"></i>
                                    <h4>No videos found</h4>
                                    <p className="text-muted">
                                        {selectedCategory !== "all" 
                                            ? "Try selecting a different category or create your own sign video."
                                            : "Be the first to add a sign language video!"}
                                    </p>
                                    <Link to='/sign-bridge/create-video' className="btn btn-primary mt-2">
                                        Create a Sign Video
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination if needed */}
                    {videoList.length > 12 && (
                        <div className="d-flex justify-content-center mt-5">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className="page-item disabled">
                                        <a className="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item">
                                        <a className="page-link" href="#" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to action section */}
            <section className="bg-gradient-primary text-white py-5">
                <div className="container text-center">
                    <h2 className="display-6 mb-3">Ready to contribute?</h2>
                    <p className="lead mb-4">
                        Join our community of sign language enthusiasts and help make communication more accessible.
                    </p>
                    <Link to='/sign-bridge/create-video' className="btn btn-light btn-lg px-4">
                        <i className="fa fa-plus-circle me-2"></i>
                        Create a Sign Video
                    </Link>
                </div>
            </section>

            {/* Additional CSS */}
            <style jsx="true">{`
                .videos-page {
                    background-color: #f8f9fa;
                }
                
                .bg-gradient-primary {
                    background: linear-gradient(120deg, #3a7bd5, #00d2ff);
                }
                
                .divider {
                    height: 3px;
                    width: 80px;
                    background-color: #fff;
                }
                
                .divider-light {
                    background-color: white;
                }
                
                .image-placeholder {
                    border-radius: 10px;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                
                .step-icon {
                    flex-shrink: 0;
                }
                
                .feature-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .empty-state {
                    padding: 3rem;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                }
                
                .nav-pills .nav-link {
                    color: #495057;
                    background-color: white;
                    border-radius: 30px;
                    padding: 0.5rem 1.2rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .nav-pills .nav-link.active {
                    background-color: #3a7bd5;
                    color: white;
                }

                @media (max-width: 768px) {
                    .feature-icon {
                        width: 30px;
                        height: 30px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Videos;
