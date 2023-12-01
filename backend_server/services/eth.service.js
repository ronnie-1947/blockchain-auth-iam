import express from 'express'
import contract from '@truffle/contract'

import {eth, web3} from '../server.js'

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

export const accInfo = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}

export const addUser = async (_, res=express.response, next)=>{
  try {
    
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