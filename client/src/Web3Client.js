import Web3 from "web3/dist/web3.min.js";
import SBTContractBuild from './truffle/build/contracts/SBT.json';

const SBT_ABI = SBTContractBuild.abi
const SBT_ADDRESS = SBTContractBuild.networks[5777].address;
export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
export const SBT = new web3.eth.Contract(SBT_ABI, SBT_ADDRESS);



