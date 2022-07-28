import Web3 from "web3/dist/web3.min.js";
import SBTContractBuild from './truffle/build/contracts/SBT.json';

const SBT_ABI = SBTContractBuild.abi
const SBT_ADDRESS = SBTContractBuild.networks[5777].address;
export const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
export const SBT = new web3.eth.Contract(SBT_ABI, SBT_ADDRESS);
export const GAS_LIMIT = 400000;


/* Deployed Contract Address on Mumbai Testnet
 * const SBT_ADDRESS = "0x6c7ee2134aed6571db4fedc32695aa5ca943708d";
 * export const web3 = new Web3(window.ethereum);
 */