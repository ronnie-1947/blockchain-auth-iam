import express from 'express'
import dotenv from 'dotenv'

import web3_conn from './config/connection.js'
import { ethRoutes } from './routes/routes.js'

/*---- Configurations ----- */
dotenv.config()
export const web3 = web3_conn()
export const eth = web3.eth
const PORT = process.env.PORT || 1111

/* ---- APP -----*/
const app = express()

app.use(express.json());
app.use(ethRoutes);
app.use((_, res) => {
  res.json("404 Not found")
})
app.use((error, _, res) => {
  res.status(500).json({ Error: true, error });
});


/*---- START APP ---- */
app.listen(PORT, () => {
  console.log(`Server started in port http://localhost:${PORT}`)
})