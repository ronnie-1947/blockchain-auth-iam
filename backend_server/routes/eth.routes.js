import express from 'express'
import * as ethServices from '../services/eth.service.js'

const router = express.Router()
router.get('/', ethServices.welcome)
router.get('/accounts', ethServices.accounts)
router.get('/accInfo', ethServices.accInfo)
router.get('/keys', ethServices.updatekeys) // Gen and store new keys
router.get('/updateUser', ethServices.updateUser)

export default router