import express from 'express'
import contract from '@truffle/contract'

import {eth} from '../server.js'

export const showErr = async (req, res = express.response) => {

  const accounts = await (eth.getAccounts())
  // const defaultAcc = await()
  // console.log(defaultAcc)
  res.json(accounts)
}