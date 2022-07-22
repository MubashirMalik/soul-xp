import { Link, useNavigate } from "react-router-dom";
import { addressShortner } from "../Util";
import './Navbar.css';

export default function Navbar({address}) {
  const navigate = useNavigate();

	return (
		<div className="Navbar">
      <header>
        <div className="logo"><Link to="/">Soul-XP</Link></div>
        <ul>
          { address !== "" ? 
            <li>Connected to: { addressShortner(address) }</li> :
            <li>Not Connected!</li>
          }
          <li><button onClick={() => navigate('/candidate-page')}>Candidate Page</button></li>
          <li><button onClick={() => navigate('/company-page')}>Company Page</button></li>
        </ul>
      </header>
		</div>
	)
}