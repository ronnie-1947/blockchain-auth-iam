import { Web3 } from 'web3'
import truffleConfig from './config.truffle.js'

const { MODE, GANACHE_IP, GANACHE_PORT, GANACHE_NETWORK } = process.env

const tConfig = truffleConfig(GANACHE_IP, GANACHE_PORT, GANACHE_NETWORK)

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
