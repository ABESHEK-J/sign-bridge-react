import './App.css'
import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Convert from './Pages/Convert';
import Home from './Pages/Home';
import LearnSign from './Pages/LearnSign';
import Video from './Pages/Video';
import Navbar from './Components/Navbar';
import CreateVideo from './Pages/CreateVideo';
import Footer from './Components/Footer';
import Videos from './Pages/Videos';
import About from './Pages/About';


function App() {
  return(
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path='/sign-bridge/home' element={<Home />} />
          <Route exact path='/sign-bridge/convert' element={<Convert />} />
          <Route exact path='/sign-bridge/learn-sign' element={<LearnSign />} />
          <Route exact path='/sign-bridge/all-videos' element={<Videos />} />
          <Route exact path='/sign-bridge/video/:videoId' element={<Video />} />
          <Route exact path='/sign-bridge/create-video' element={<CreateVideo />} />
          <Route exact path='/sign-bridge/about' element={<About />} />
          <Route path='*' element={<Home/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
