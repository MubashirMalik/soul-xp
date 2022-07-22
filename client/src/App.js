import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import CandidatePage from './components/CandidatePage';
import './App.css';

import {
	Route,
	Routes
 } from "react-router-dom";

export default function App() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    
  }, [])

  return (
    <div className="App">
      <Navbar address={address} setAddress={setAddress} />
      <div className="App-body">
        <Routes>
          <Route exact path="/" element={<LandingPage /> } />
          <Route exact path="/candidate-page" element={<CandidatePage address={address}/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}