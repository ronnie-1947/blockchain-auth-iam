import express from 'express'
import contract from '@truffle/contract'

import {eth, web3} from '../server.js'
import { getUser } from '../utils/contractCalls.utils.js'

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

    const myAddress = req.authCookie
    const user = await getUser(myAddress)

    res.json(user)
    
  } catch (error) {
    next(error)
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