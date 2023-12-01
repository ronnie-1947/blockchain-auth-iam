import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { web3 } from '../server.js'
dotenv.config

const contractPath = path.join(process.cwd(), 'build', 'contracts', 'User.json')
const UserContractJSON = fs.readFileSync(contractPath, 'utf-8')

const contract = JSON.parse(UserContractJSON)

const abi = contract.abi
const contractAddress = contract.networks[process.env.GANACHE_NETWORKID].address

export default function (eth) {

  const myContract = new eth.Contract(abi, contractAddress)

  return async function (functionName = '', args = []) {
    const encodedFunctionCall = myContract.methods[functionName](...args).encodeABI();

    const result = await eth.call({
      to: contractAddress,
      data: encodedFunctionCall
    })
    const bytesText = web3.utils.hexToUtf8(result)
    const str = bytesText.replace(/[\x00-\x1F\x7F]+/g, '').replace(/\s/g, '')
    console.log(bytesText)
    return str;
  }
}

export const newContract = async (eth) => {
  const myContract = new eth.Contract(abi, contractAddress)

  return myContract
}