import React from 'react';

const Header = ({ activePage, setActivePage }) => {
    return (
        <header>
            <div className="logo-container">
                <svg width="60" height="60" viewBox="0 0 200 200">
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
                <h1>Sign Bridge</h1>
            </div>
            <nav>
                <ul>
                    <li>
                        <a 
                            className={activePage === 'communication' ? 'active' : ''} 
                            onClick={() => setActivePage('communication')}
                        >
                            Communication
                        </a>
                    </li>
                    <li>
                        <a 
                            className={activePage === 'add-sign' ? 'active' : ''} 
                            onClick={() => setActivePage('add-sign')}
                        >
                            Add New Sign
                        </a>
                    </li>
                    <li>
                        <a 
                            className={activePage === 'about' ? 'active' : ''} 
                            onClick={() => setActivePage('about')}
                        >
                            About
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
