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
  const [skillSBTFormData, setskillSBTFormData] = useState({
    id: 1,
    name: "",
    issueDate: 0,
    difficulty: "",
    testType: ""
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
        setError(handleError(err.message));
      }
    }
    getCountIssued()
  }, [address, setIsRegistered]) 

  function handleSubmit(event) {
    event.preventDefault()
    setError("")
  }

  function handleChange(event) {
    setskillSBTFormData(prevSkillSBTFormData => {
      return {
        ...prevSkillSBTFormData, [event.target.name]: event.target.value
      }
    })
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

  function toggleSkillForm(id) {
    if (document.getElementById(id).style.display === 'flex') {
      document.getElementById(id).style.display = 'none';
    } else {
      document.getElementById(id).style.display = 'flex';
    }
  }

  async function respondToRequest(candidate, response) {
    if (!response) {
      await SBT.methods.rejectRequest(candidate).send({from: address, gas: 300000});
      
      let result = await SBT.methods.getPendingSBTCompany().call({from: address, gasLimit: 300000});
      setPendingSBTCompany({
        addresses: result[1],
        credentialIds: result[0]
      });      
    } else {
      let temp = {
        id: skillSBTFormData.id,
        name: skillSBTFormData.name,
        issueDay: parseInt(skillSBTFormData.issueDate.slice(8, 10)),
        issueMonth: parseInt(skillSBTFormData.issueDate.slice(5, 7)),
        issueYear: parseInt(skillSBTFormData.issueDate.slice(0, 4)),
        difficulty: skillSBTFormData.difficulty,
        testType: skillSBTFormData.testType
      }
      
      await SBT.methods.respondToRequest(candidate, temp, response).send({from: address, gas: 300000});

      let result = await SBT.methods.getPendingSBTCompany().call({from: address, gasLimit: 300000});
      setPendingSBTCompany({
        addresses: result[1],
        credentialIds: result[0]
      });      
    }    
  }

  const skillSBTForm = (candidate, id) => {
    return(
      <form key={id} id={id} style={{display: "none"}} className="skill-form">
        <label>Skill</label>
        <input 
          type="text"
          name="name"
          placeholder="Golang, ReactJS etc."
          onChange={handleChange}
          value={skillSBTFormData.name}
        />
        <label>Issue Date</label>
        <input 
          type="date"
          name="issueDate"
          onChange={handleChange}
          value={skillSBTFormData.issueDate}
        />
        <label>Difficulty</label>
        <select 
          name="difficulty"
          value={skillSBTFormData.difficulty}
          onChange={handleChange}
        >
          <option value="1">Beginner</option>
          <option value="2">Intermediate</option>
          <option value="3">Advanced</option>
          <option value="4">Expert</option>
        </select>
        <label>Test Type</label>
        <select
          name="testType"
          value={skillSBTFormData.testType}
          onChange={handleChange}
        >
          <option value="1">MCQs</option>
          <option value="2">Problem Solving</option>
        </select>
        <button type="button" onClick={() => respondToRequest(candidate, true)} >Issue</button>
      </form>
    )
  }


  const displayPendingSBTCompany = pendingSBTCompany.addresses.map((addr, index) => {
    return (
      <div key={index} className="row" style={{backgroundColor: "#f5e6db"}}>
        <div>
          <div>Candidate Address</div>
          <div>{addressShortner(addr)}</div>
        </div>
        <div>
          <div>Credential Id [Token]</div>
          <div>{web3.utils.hexToUtf8(pendingSBTCompany.credentialIds[index])}</div>
        </div>
        <div className="buttons">
          <button onClick={() => toggleSkillForm(index)}>Accept Request</button>
          <button onClick={() => respondToRequest(addr, false, index)}>Reject Request</button>
        </div>
        {skillSBTForm(addr, index)}
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