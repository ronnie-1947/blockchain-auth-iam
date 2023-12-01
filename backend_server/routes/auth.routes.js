import express from 'express'
import * as authServices from '../services/auth.service.js'

const router = express.Router()

router.get('/', authServices.welcome)
router.post('/login', authServices.login)
router.post('/oAuth', authServices.oAuth)

export default router