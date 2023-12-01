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
  const walletKey = private_keys?.['96b18d6f9233c1f2888e698b0d8512df4519f5b2']
  
  const key = {
    walletKey,
    publicKey, privateKey
  }

  // Save in disk
  let arr = []
  const jsonKeysExist = fs.existsSync(keysPath)
  if (jsonKeysExist) {
    const jsonKeys = JSON.parse(fs.readFileSync(keysPath, 'utf-8'))
    arr = [...jsonKeys]
  }
  arr.push({ [address.replace('0x', '')]: key })

  fs.writeFileSync(keysPath, JSON.stringify(arr))

  return key
}