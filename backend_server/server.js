import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from 'cors'
import expressWS from 'express-ws'

import web3_conn from "./config/connection.js"
import { ethRoutes, privateRoutes, authRoutes } from "./routes/routes.js"
import callContract from "./utils/initContract.utils.js"
import socket from "./socket.js"

/*---- Configurations ----- */
dotenv.config()
export const web3 = web3_conn()
export const eth = web3.eth
export const contract = callContract(eth)
const PORT = process.env.PORT || 1111

/* ---- APP -----*/
const app = express()
expressWS(app)

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use((req, _, next) => {

  console.log(req.cookies)
  const authCookies = req.cookies["_connectsid"] || ""
  const auth = req.headers.authorization?.replace('Bearer ', '') || authCookies || ""
  req.authCookie = auth
  next()
})

app.ws('/ws', socket)
app.use("/eth", ethRoutes)
app.use("/private", privateRoutes)
app.use("/auth", authRoutes)
app.use("*", (req, res) => {
  console.log("404 ROUTE TOUCHED === ", req.baseUrl)
  res.json("404 Not found")
})
app.use((err, _, res) => {
  res.status(500).json({ Error: true, msg: err.message })
})


/*---- START APP ---- */
app.listen(PORT, () => {
  console.log(`Server started in port http://localhost:${PORT}`)
})
