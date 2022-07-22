import { useState } from 'react';
import { web3, SBT } from '../Web3Client';
import { handleError } from '../ErrorHandler';
import './CandidatePage.css';

export default function CandidatePage({address}) {
  
  const [formData, setFromData] = useState({
    companyAddress: "",
    credentialId: ""
  })
  const [error, setError] = useState("")

  function handleChange(event) {
    setFromData(prevFromData => {
      return {
      ...prevFromData, [event.target.name]: event.target.value 
      }
    })
  }

  async function handleSubmit(event)  {
    event.preventDefault()

    let _error = ""
    if(formData.companyAddress === "" || formData.credentialId === "") {
      _error = "All fields are required";
    } else if (formData.companyAddress.length !== 42) {
      _error = "Invalid company address";
    }
    setError(_error)

    if (_error === "") {
      try {
        console.log(address)
        await SBT.methods.requestSBT(formData.companyAddress, web3.utils.utf8ToHex(formData.credentialId)).send({from: address, gas: 30000});
        // call pending requests here
      } catch (err) {
        setError(handleError(err.message))
      }
    }
  }

  return(
    <div className="Container">
      <div className="Container-view">
        <div className="row"><h2>Issued Skill-SBT</h2></div>
        <div className="row">
          <div>
            <div className="bold">Skill</div>
            <div>Cplusplus</div>
          </div>
          <div>
            <div>Difficulty</div>
            <div>Expert</div></div>
          <div>
            <div>Test Type</div>
            <div>Problem Solving</div>
          </div>
          <div>
            <div>Issuing Authority</div>
            <div>Crossover, 0x123</div>
          </div>
          <div>
            <div>Issue Date</div>
            <div>13-12-1998</div>
          </div>
          
        </div>
        <div className="row"><h2>Pending Skill-SBT</h2></div>
      </div>
      <div className="Container-form">
        <div className="Form-container">
          <h2>Request SBT</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-error">{error}</div>
            <input 
              type="text"
              name="companyAddress"
              placeholder="Company address"
              value={formData.companyAddress}
              onChange={handleChange}
            />
            <input 
              type="text"
              name="credentialId"
              placeholder="Credential ID"
              value={formData.credentialId}
              onChange={handleChange}
            />
            <button>Request</button>
          </form>
        </div>
      </div>
    </div>
  )
}