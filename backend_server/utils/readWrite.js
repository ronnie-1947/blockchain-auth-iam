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

export const readData = (dataName, address = '') => {
  const dataFileExists = fs.existsSync(dataPath)

  if (!dataFileExists) return {}

  const dataFileStr = fs.readFileSync(dataPath, 'utf-8')
  const dataFile = JSON.parse(dataFileStr)
  return dataFile?.[address.replace('0x', '')]?.[dataName]
}

export const readKeys = (address) => {

  let keys = {}
  const jsonKeysExist = fs.existsSync(keysPath)
  if (jsonKeysExist) {
    const jsonStr = fs.readFileSync(keysPath, 'utf-8')
    if (jsonStr.length > 0) keys = JSON.parse(jsonStr)
  }
  return keys[address.replace('0x', '')]
}


export const readConsents = (address, domain, data) => {
  let cmgmt = {}
  const cmgmtExist = fs.existsSync(cPath)
  if (cmgmtExist) {
    const cmgmtStr = fs.readFileSync(cPath, 'utf-8')
    cmgmt = JSON.parse(cmgmtStr)
  }
  return cmgmt?.[address]?.[domain]?.[data]
}
export const readAllConsents = (address) => {
  let cmgmt = {}
  const cmgmtExist = fs.existsSync(cPath)
  if (cmgmtExist) {
    const cmgmtStr = fs.readFileSync(cPath, 'utf-8')
    cmgmt = JSON.parse(cmgmtStr)
  }
  return cmgmt?.[address]
}



export const writeInitialConsent = (address) => {
  const cmgmtExist = fs.existsSync(cPath)
  let cmgmt = {
    [address]: {}
  }
  if (cmgmtExist) {
    const cmgmtstr = fs.readFileSync(cPath, 'utf8')
    cmgmt = JSON.parse(cmgmtstr)
    cmgmt[address] = {}
  }
  fs.writeFileSync(cPath, JSON.stringify(cmgmt))
}


/*
{
  domain: 'walmart'
  purpose: 'Employment records',
  data: SIN
  expiry: 23423234,
  active: true
*/
export const writeConsent = (address, consent) => {
  const cmgmtstr = fs.readFileSync(cPath, 'utf8')
  let cmgmt = JSON.parse(cmgmtstr)

  const { domain, purpose, data, active, expiry } = consent
  const newConsent = { active, expiry, purpose }

  let domainConsent = cmgmt?.[address]?.[domain]
  if (domainConsent) {
    // If the domain is already available
    if (cmgmt?.[address]?.[domain]?.[data]) {
      const logs = [...cmgmt?.[address][domain][data]?.logs, active ? `permisson granted to view ${data} on ${Date.now()}` : `permisson revoked to view ${data} on ${Date.now()}`]
      cmgmt[address][domain][data] = { ...(cmgmt?.[address]?.[domain]?.[data]), ...newConsent, logs }

    } else {
      cmgmt[address][domain][data] = { ...newConsent, timestamp: new Date().toISOString(), logs: [active ? `permisson granted to view ${data} on ${Date.now()}` : `permisson revoked to view ${data} on ${Date.now()}`] }
    }

  } else {
    // When a new cosent is made for a domain
    cmgmt[address][domain] = {}
    cmgmt[address][domain][data] = { ...newConsent, timestamp: new Date().toISOString(), logs: [active ? `permisson granted to view ${data} on ${Date.now()}` : `permisson revoked to view ${data} on ${Date.now()}`] }
  }

  fs.writeFileSync(cPath, JSON.stringify(cmgmt))
}