import crypto from 'crypto'
import fs from 'fs'
import path from 'path'


const walletKeysPath = path.join(process.cwd(), 'database', 'walletKeys.json')
const keysPath = path.join(process.cwd(), 'database', 'keys.json')

const { private_keys } = JSON.parse(fs.readFileSync(walletKeysPath))

export const makeKeyPair = (address) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })

  // Get private key with address
  const walletKey = private_keys?.[address?.toLowerCase()]
  
  const key = {
    walletKey,
    publicKey, privateKey
  }

  // Save in disk
  let arr = {}

  const jsonKeysExist = fs.existsSync(keysPath)
  if (jsonKeysExist) {
    let jsonKeys = fs.readFileSync(keysPath, 'utf-8')
    if(jsonKeys.length > 0){
      jsonKeys = JSON.parse(jsonKeys)
      arr = jsonKeys
    }
  }
  const prevData = arr[address.replace('0x','')] 
  arr[address.replace('0x','')] = {...prevData, ...key}

  fs.writeFileSync(keysPath, JSON.stringify(arr))

  return key
}