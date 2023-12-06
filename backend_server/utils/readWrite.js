import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'database', 'data.json')
const keysPath = path.join(process.cwd(), 'database', 'keys.json')
const cPath = path.join(process.cwd(), 'database', 'cmgmt.json')

export const writeData = (data, address) => {
  let arr = {}
  const jsonKeysExist = fs.existsSync(dataPath)
  if (jsonKeysExist) {
    let jsonKeys = fs.readFileSync(dataPath, 'utf-8')
    if (jsonKeys.length > 0) {
      jsonKeys = JSON.parse(jsonKeys)
      arr = jsonKeys
    }
  }
  const prevData = arr[address.replace('0x', '')]
  arr[address.replace('0x', '')] = { ...prevData, ...data }

  fs.writeFileSync(dataPath, JSON.stringify(arr))
}

export const readData = (dataName, address='')=>{
  const dataFileExists = fs.existsSync(dataPath)

  if(!dataFileExists) return {}

  const dataFileStr = fs.readFileSync(dataPath, 'utf-8')
  const dataFile = JSON.parse(dataFileStr)
  return dataFile?.[address.replace('0x', '')]?.[dataName]
}

export const readKeys = (address) => {
  
  let keys ={}
  const jsonKeysExist = fs.existsSync(keysPath)
  if (jsonKeysExist) {
    const jsonStr = fs.readFileSync(keysPath, 'utf-8')
    if(jsonStr.length>0) keys = JSON.parse(jsonStr)
  }
  return keys[address.replace('0x','')]
}

/* 
{
  0x2de3d: {
    walmart: {
      SIN: {
        active: true,
        expiry: Date(),
        purpose: Employment records
        timestamp: new Date()
        logs: [
          permisson granted to view SIN in timestamp,
          permisson revoked to view SIN in timestamp
        ]
      }
    }
  }
}

*/
export const readConsents = (address, domain, data)=>{
  let cmgmt ={}
  const cmgmtExist = fs.existsSync(cPath)
  if (cmgmtExist) {
    const cmgmtStr = fs.readFileSync(cPath, 'utf-8')
    cmgmt = JSON.parse(cmgmtStr)
  }
  return cmgmt?.[address]?.[domain]?.[data]
}

/*
{
  domain: 'walmart'
  purpose: 'Employment records',
  data: SIN
  expiry: 23423234
*/

export const writeConsent = (address, consent)=>{
  let cmgmt = {}
}