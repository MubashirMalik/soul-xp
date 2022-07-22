import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { SBT } from '../Web3Client';
import { displayToast } from '../Util';
import './CompanyPage.css';
import { handleError } from '../ErrorHandler';

export default function CompanyPage({address, isRegistered, setIsRegistered}) {
  const [error, setError] = useState()
  useEffect(() => {
    async function getCountIssued() {
      try {
        let result = await SBT.methods.getCountIssued().call({from: address, gas: 30000});
        if (parseInt(result) !== 0) {
          setIsRegistered(true)
        }
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

  return(
    <div className="Container">
      <div className="Container-view">
        {!isRegistered ? 
          <div className="row">
            You are not registerd!
          </div>
          : 
          <div className="row"><h2>Pending Token Requests</h2></div>}
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