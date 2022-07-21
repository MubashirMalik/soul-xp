import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';

export default function Navbar({address, setAddress}) {
  useEffect(() => {
    if (window.ethereum) {
      displayToast("MetaMask detected!", "info");
    }
  }, [])

  function displayToast(message, type) {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  async function requestAccount() {
    if (address !== "" && window.ethereum) {
      displayToast("You are already connected to MetaMask!", "info");
    } else if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          setAddress(accounts[0]);
          displayToast("Connected to MetaMask!", "success");
        } catch(error) {
          displayToast("Error connecting to MetaMask..", "error");
        }
    } else {
      displayToast("Could not detect MetaMask!", "warning");
    }
  }

	return (
		<div className="Navbar">
      <header>
        <div className="logo"><Link to="/">Soul-XP</Link></div>
				<ul>
					<li><button onClick={requestAccount}>Connect Wallet</button></li>
				</ul> 
      </header>
			<ToastContainer />
		</div>
	)
}