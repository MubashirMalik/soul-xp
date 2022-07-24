import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { web3, SBT } from '../Web3Client';
import { displayToast, addressShortner } from '../Util';
import './CompanyPage.css';
import { handleError } from '../ErrorHandler';

export default function CompanyPage({address, isRegistered, setIsRegistered}) {
  const [error, setError] = useState()
  const [pendingSBTCompany, setPendingSBTCompany] = useState({
    addresses: [],
    credentialIds: []
  })

  useEffect(() => {
    async function getCountIssued() {
      try {
        let result = await SBT.methods.getCountIssued().call({from: address, gas: 30000});
        if (parseInt(result) !== 0) {
          setIsRegistered(true)
        }
        result = await SBT.methods.getPendingSBTCompany().call({from: address, gasLimit: 300000});
        setPendingSBTCompany({
          addresses: result[1],
          credentialIds: result[0]
        });      
      } catch(err) {
        setError(handleError(err.message))
      }
    }
    getCountIssued()
  }, [address, setIsRegistered]) 

  function handleSubmit(event) {
    event.preventDefault()
    setError("")
  }

  async function registerCompany(event) {
    event.preventDefault()
    try {
      SBT.methods.registerCompany().send({from: address, gas: 300000}).then(
        async (tx) => {
          let result = await SBT.methods.getCountIssued().call({from: address, gas: 30000});
          if (parseInt(result) === 1) {
            setIsRegistered(true);
            displayToast("Company registered!", "success");
          }
        }
      );
    } catch(err) {
      setError(handleError(err.message))
    }
  }

  const displayPendingSBTCompany = pendingSBTCompany.addresses.map((addr, index) => {
    return (
      <div className="row" style={{backgroundColor: "#f5e6db"}}>
        <div>
          <div>Candidate Address</div>
          <div>{addressShortner(addr)}</div>
        </div>
        <div>
          <div>Credential Id [Token]</div>
          <div>{web3.utils.hexToUtf8(pendingSBTCompany.credentialIds[index])}</div>
        </div>
        <div className="buttons">
          <button>Accept Request</button>
          <button>Reject Request</button>
        </div>
      </div>
    ) 
  })

  return(
    <div className="Container">
      <div className="Container-view">
        {!isRegistered ? 
          <div className="row">
            You are not registerd!
          </div>
          :
          <>
            <div className="row"><h2>Pending Token Requests</h2></div>
            { 
            pendingSBTCompany.addresses.length === 0 ? 
            <div className="row" style={{backgroundColor: "#f5e6db"}}>You have no requests to respond to.</div>
            :
            displayPendingSBTCompany
            } 
          </>
        }
      </div>
      <div className="Container-form">
        {isRegistered ?
          <div className="Form-container">  
            <h2>Verify SBT</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-error">{error}</div>
              <input 
                type="text"
                placeholder="Placeholder"
              />
              <input 
                type="text"
                placeholder="Placeholder"
              />
              <button>Verify</button>
            </form>
          </div> :
          <div className="Form-container">
            <h2>Register Company</h2>
            <form onSubmit={registerCompany}>
              <div className="form-error">{error}</div>
              <button>Register</button>
            </form>
          </div>
        }
      </div>
      <ToastContainer />
    </div>
  )
}