import express from 'express'
import contract from '@truffle/contract'

import {eth, web3} from '../server.js'
import { getUser } from '../utils/contractCalls.utils.js'
import { readKeys } from '../utils/readWrite.js'

export const welcome = async (_, res=express.response, next)=>{
  try {
    res.json("Welcome to ethereum")
  } catch (error) {
    next(error)
  }
}

export const accounts = async (_, res = express.response, next) => {
  try {
    const accounts = await (eth.getAccounts())
    res.json(accounts)
  } catch (error) {
    next(error)
  }
}

export const accInfo = async (req, res=express.response, next)=>{
  try {

    const myAddress = req.body.address
    const keys = readKeys(myAddress.replace('0x', ''))
    res.json(keys.publicKey)
    
  } catch (error) {
    next(error)
  }
}
export const accInfoSoc = async (address)=>{
  try {

    const keys = readKeys(address.replace('0x', ''))
    return keys
    
  } catch (error) {
    
  }
}

export const updateUser = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}

export const updatekeys = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}