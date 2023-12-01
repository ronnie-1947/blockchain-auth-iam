import { Web3 } from 'web3'
import truffleConfig from './config.truffle.js'
import dotenv from 'dotenv'

dotenv.config()
const { MODE, GANACHE_HOST, GANACHE_PORT, GANACHE_NETWORKID} = process.env
const tConfig = truffleConfig(GANACHE_HOST, GANACHE_PORT, GANACHE_NETWORKID)

const web3_pool = function () {
  const nw = tConfig.networks[MODE || 'development'];
  if (nw.provider) {
    return new Web3(nw.provider());
  } else {
    //fallback on host/port if provider not defined
    return new Web3(new Web3.providers.HttpProvider("http://" + nw.host + ":" + nw.port));
  }
}

export default function web3_init() {
  return web3_pool()
}
