import express from 'express'
import cookie from 'cookie'
import { addUser, getUser } from '../utils/contractCalls.utils.js'
import {makeKeyPair} from '../utils/crypto.utils.js'
import { readKeys } from '../utils/readWrite.js'


export const welcome = async (_, res = express.response, next) => {
  try {
    res.json("Welcome to auth Routes")
  } catch (error) {
    next(error)
  }
}

export const signup = async (req= express.request, res = express.response, next) => {
  try {

    const {address, name, email} = req.body
    const user = await getUser(address)
    if(user) throw new Error('address already present')

    // Make public private key pair
    const {publicKey} = await makeKeyPair(address)
    
    // Save user in blockchain
    const receipt = await addUser(address, name, email, publicKey)
    console.log(receipt.events.UserAdded.returnValues)

    // return user in json format
    res.json({address, name, email})

  } catch (error) {
    console.error(error)
    res.status(500).json({error: true, error_code: 500, msg: error.message})
  }
}

export const login = async (req = express.request, res = express.response, next) => {
  try {
    const { address } = req.body
    
    const user = await getUser(address)
    const keys = await readKeys(address)
    if (!user) {
      res.status(200).json({
        error: true,
        error_code: '4001',
        msg: 'No user found'
      })
      return
    }
    const setCookie = cookie.serialize('_connectsid', address, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true
    })
    
    res.setHeader('Set-Cookie', setCookie).json({...user, ...keys})

  } catch (error) {
    console.error(error)
    next(error)
  }
}

export const oAuth = async (_, res = express.response, next) => {
  try {

  } catch (error) {
    next(error)
  }
}

export const verify = async (req, res=express.response, next)=>{
  try {

    const encryptedCode = req.body.encryptedHex
    
    // Send the code to client and decrypt it
    const sendMsg = await sendCustomMessageToClient('client_react', {command: 'decrypt', encryptedCode})
    console.log(sendMsg)
    // Send the response back
    res.json('Wait for verification')
    
  } catch (error) {
    next(error)
  }
}