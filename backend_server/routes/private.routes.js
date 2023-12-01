import express from 'express'
import * as privateServices from '../services/private.service.js'

const router = express.Router()

router.get('/', privateServices.welcome)
router.post('/storeData', privateServices.storeData)
router.post('/updateData', privateServices.updateData)
router.post('/deleteData', privateServices.deleteData)
router.post('/reqData', privateServices.reqData) // Used by 3rd party to request any data

export default router