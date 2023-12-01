import express from 'express'
import { writeData } from '../utils/readWrite.js'

export const welcome = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}

export const storeData = async (req, res=express.response, next)=>{
  try {
    
    const myAddr = req.authCookie
    const body = req.body

    // Write data in disk
    writeData(body, myAddr)

    res.json(body)

  } catch (error) {
    next(error)
  }
}

export const updateData = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}

export const deleteData = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}

export const reqData = async (_, res=express.response, next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}