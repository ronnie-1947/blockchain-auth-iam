import { contract, eth, web3 } from '../server.js'
import { newContract } from './initContract.utils.js'

export const getUser = async (address) => {

  const userEmail = await contract('getUserEmail', [address])
  const userName = await contract('getUserName', [address])
  const userPublicKey = await contract('getUserPublicKey', [address])
 
  if (!userEmail) return false
  return {
    email: userEmail,
    name: userName,
    publicKey:userPublicKey
  }
}

export const addUser = async (address, name, email, publicKey) => {

  const contract = await newContract(eth)
  eth.defaultAccount = address
  const transaction = await contract.methods.addUser(name, email, publicKey)
  const randomGas = Math.floor(Math.random() * (5000000 - 2000000 + 1)) + 2000000;

  const receipt = await transaction.send({
    from: eth.defaultAccount,
    gas: randomGas,
  });

  return receipt
}

function decodeUserData(hexString) {
  // Remove "0x" prefix if present
  const cleanedHexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

  // Separate data every 64 characters
  const separatedData = cleanedHexString.match(/.{1,64}/g) || [];

  // Extract name, email, and public key
  const name = Buffer.from(separatedData[0], 'hex').toString('utf-8');
  const email = Buffer.from(separatedData[1], 'hex').toString('utf-8');
  const publicKey = Buffer.from(separatedData[2], 'hex').toString('utf-8');

  // Create and return an object
  const resultObject = {
    name: name,
    email: email,
    publicKey: publicKey,
  };

  return resultObject;
}