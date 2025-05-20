import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg fixed-top py-3" id="mainNav">
            <div className="container px-4 px-lg-5">
                <Link to='/sign-bridge/home' className="navbar-brand mb-0 h1">
                    <svg width="30" height="30" viewBox="0 0 200 200" className="d-inline-block align-top me-3">
                        <defs>
                            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3498db" />
                                <stop offset="100%" stopColor="#2ecc71" />
                            </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="90" fill="white" />
                        <path d="M50,100 C50,70 70,50 100,50 C130,50 150,70 150,100 C150,130 130,150 100,150 C70,150 50,130 50,100 Z" fill="none" stroke="url(#logo-gradient)" strokeWidth="10" />
                        <path d="M70,80 C70,70 80,60 100,60 C120,60 130,70 130,80 C130,90 120,100 100,100" fill="none" stroke="url(#logo-gradient)" strokeWidth="8" strokeLinecap="round" />
                        <path d="M70,120 C70,130 80,140 100,140 C120,140 130,130 130,120 C130,110 120,100 100,100" fill="none" stroke="url(#logo-gradient)" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="10" fill="url(#logo-gradient)" />
                    </svg>
                    Sign Bridge
                </Link>
                <button className="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto my-2 my-lg-0">
                        <li className="nav-item"><Link to='/sign-bridge/home' className="nav-link">Home</Link></li>
                        <li className="nav-item"><Link to='/sign-bridge/convert' className="nav-link">Convert</Link></li>
                        <li className="nav-item"><Link to='/sign-bridge/learn-sign' className="nav-link">Learn Sign</Link></li>
                        <li className="nav-item"><Link to='/sign-bridge/all-videos' className="nav-link">Videos</Link></li>
                        <li className="nav-item"><Link to='/sign-bridge/about' className="nav-link">About</Link></li> {/* Changed to About */}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
