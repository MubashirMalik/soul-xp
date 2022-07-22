import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import CandidatePage from './components/CandidatePage';

import { addressShortner, displayToast } from './Util';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import {
	Route,
	Routes
 } from "react-router-dom";
import CompanyPage from './components/CompanyPage';

export default function App() {
  const [address, setAddress] = useState("");

  

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        setAddress(accounts[0]);
        displayToast(`Selected account: ${addressShortner(accounts[0])}`, "info");
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  
      window.ethereum.on('accountsChanged', function (accounts) {
        setAddress(accounts[0]);
        displayToast(`Selected account: ${addressShortner(accounts[0])}`, "info");
      });
    } else {
      displayToast("Could not detect MetaMask!", "warning");
    }
  }, [])

  return (
    <div className="App">
      <Navbar address={address} />
      <div className="App-body">
        <Routes>
          <Route exact path="/" element={<LandingPage /> } />
          <Route exact path="/candidate-page" element={<CandidatePage address={address}/>} />
          <Route exact path="/company-page" element={<CompanyPage address={address}/>} />
          <Route path="*" element={ <PageNotFound />}/>
        </Routes>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
}

function PageNotFound() {
	return(
		<div className="PageNotFound">
			<h1>Uh Oh!</h1>
			<div className="emoji">¯\_(ツ)_/¯</div>
			<div>We can't seem to find the page you're looking for.
			</div>
		</div>
	)
}