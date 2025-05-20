import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="page-footer font-small unique-color-dark mt-5">
            

            <div className='container-fluid text-white pt-3' style={{backgroundColor:'rgba(33,37,41,1)'}}>
                <div className="container text-md-left mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase font-weight-bold">SIGN BRIDGE</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}}/>
                            <p className='footer-text'>Sign Bridge translates text and speech into 3D sign language animations, making communication accessible through interactive technology. Our mission is to bridge gaps between hearing and deaf communities through intuitive, visual learning tools.</p>
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase font-weight-bold">Services</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}} />
                            <p><Link to='/sign-bridge/convert' className='footer-link'>Convert</Link></p>
                            <p><Link to='/sign-bridge/learn-sign' className='footer-link'>Learn Sign</Link></p>
                            <p><Link to='/sign-bridge/all-videos' className='footer-link'>Videos</Link></p>
                        </div>

                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase font-weight-bold">Useful links</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}} />
                            <p><Link to='/sign-bridge/home' className='footer-link'>Home</Link></p>
                            <p><Link to='/sign-bridge/about' className='footer-link'>About</Link></p>
                        </div>

                        
                    </div>
                </div>

                <div className="footer-copyright text-center py-3">© 2025 Copyright</div>
            </div>
        </footer>
    );
}

export default Footer;
