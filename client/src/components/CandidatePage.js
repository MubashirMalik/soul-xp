import { useState, useEffect } from 'react';
import { web3, SBT, GAS_LIMIT } from '../Web3Client';
import { handleError } from '../ErrorHandler';
import './CandidatePage.css';
import { addressShortner, dateFormater, decodeDifficultly, decodeTestType } from '../Util';

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

  const [issuedSBTCandidate, setIssuedSBTCandidate] = useState([])

  useEffect(() => {
    async function getPendingSBTCandidate() {
      let result = await SBT.methods.getPendingSBTCandidate().call({from: address, gasLimit: GAS_LIMIT});
      setPendingSBTCandidate({
        addresses: result[1],
        credentialIds: result[0]
      });
      
      result = await SBT.methods.getIssuedSBTCandidate().call({from: address, gasLimit: GAS_LIMIT});
      setIssuedSBTCandidate(result);
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
        await SBT.methods.requestSBT(formData.companyAddress, web3.utils.utf8ToHex(formData.credentialId)).send({from: address, gasLimit: GAS_LIMIT});
        // call pending requests here
        let result = await SBT.methods.getPendingSBTCandidate().call({from: address, gasLimit: GAS_LIMIT});
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
      <div key={index} className="row" style={{backgroundColor: "#f5e6db"}}>
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

  const displayIssuedSBTCandidate = issuedSBTCandidate.map((skillSBT) => {
    return(
      <div key={skillSBT["id"]} className="row" style={{backgroundColor: "#f5e6db"}}>
        <div>
          <div className="bold">id</div>
          <div>{skillSBT["id"]}</div>
        </div>
        <div>
          <div className="bold">Skill</div>
          <div>{skillSBT["name"]}</div>
        </div>
        <div>
          <div>Difficulty</div>
          <div>{decodeDifficultly(skillSBT["difficulty"])}</div></div>
        <div>
          <div>Test Type</div>
          <div>{decodeTestType(skillSBT["testType"])}</div>
        </div>
        <div>
          <div>Issuing Authority</div>
          <div>{addressShortner(skillSBT["companyAddress"])}</div>
        </div>
        <div>
          <div>Issue Date</div>
          <div>{ dateFormater(skillSBT["issueDay"], skillSBT["issueMonth"], skillSBT["issueYear"]) }
          </div>
        </div>
      </div>
    );
  });

  return(
    <div className="Container">
      <div className="Container-view">
        <div className="row">
          <h2>Issued Tokens</h2><a title="Click to know more!" href="/">Soul Address:</a> {addressShortner(address)}
        </div>
        {issuedSBTCandidate.length === 0 ? 
            <div className="row" style={{backgroundColor: "#f5e6db"}}>You have no issued token.</div>
            :
            displayIssuedSBTCandidate
        }

        <div className="row"><h2>Requested Tokens</h2>[Pending]</div>
         {pendingSBTCandidate.addresses.length === 0 ? 
            <div className="row" style={{backgroundColor: "#f5e6db"}}>You have no pending requests.</div>
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