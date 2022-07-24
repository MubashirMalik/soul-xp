import { useState, useEffect } from 'react';
import { web3, SBT } from '../Web3Client';
import { handleError } from '../ErrorHandler';
import './CandidatePage.css';
import { addressShortner } from '../Util';

export default function CandidatePage({address}) {
  
  const [formData, setFromData] = useState({
    companyAddress: "",
    credentialId: ""
  })
  const [error, setError] = useState("")
  const [pendingSBTCandidate, setPendingSBTCandidate] = useState({
    addresses: [],
    credentialIds: []
  })

  useEffect(() => {
    async function getPendingSBTCandidate() {
      let result = await SBT.methods.getPendingSBTCandidate().call({from: address, gasLimit: 300000});
      setPendingSBTCandidate({
        addresses: result[1],
        credentialIds: result[0]
      });      
    }
    getPendingSBTCandidate();
  }, [address, setPendingSBTCandidate])


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
        await SBT.methods.requestSBT(formData.companyAddress, web3.utils.utf8ToHex(formData.credentialId)).send({from: address, gasLimit: 300000});
        // call pending requests here
        let result = await SBT.methods.getPendingSBTCandidate().call({from: address, gasLimit: 300000});
        setPendingSBTCandidate({
          addresses: result[1],
          credentialIds: result[0]
        });  
      } catch (err) {
        setError(handleError(err.message))
      }
    }
  }

  const displayPendingSBTCandidate = pendingSBTCandidate.addresses.map((addr, index) => {
    return (
      <div className="row" style={{backgroundColor: "#f5e6db"}}>
        <div>
          <div>Compay Address</div>
          <div>{addressShortner(addr)}</div>
        </div>
        <div>
          <div>Credential Id [Token]</div>
          <div>{web3.utils.hexToUtf8(pendingSBTCandidate.credentialIds[index])}</div>
        </div>
      </div>
    ) 
  })

  return(
    <div className="Container">
      <div className="Container-view">
        <div className="row">
          <h2>Issued Tokens</h2><a title="Click to know more!" href="/">Soul Address:</a> {addressShortner(address)}
        </div>
        <div className="row" style={{backgroundColor: "#f5e6db"}}>
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
        <div className="row"><h2>Requested Tokens</h2>[Pending]</div>
         {pendingSBTCandidate.addresses.length === 0 ? 
            <div className="row" style={{backgroundColor: "#f5e6db"}}>"You have no pending requests."</div>
            :
            displayPendingSBTCandidate
          }
        
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