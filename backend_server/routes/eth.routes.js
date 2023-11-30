import express from 'express'
import * as ethServices from '../services/eth.service.js'

const router = express.Router()

router.get('/', ethServices.showErr)

export default router