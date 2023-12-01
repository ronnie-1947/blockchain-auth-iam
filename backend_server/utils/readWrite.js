import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'database', 'data.json')

export const writeData = (data, address) => {
  let arr = {}
  const jsonKeysExist = fs.existsSync(dataPath)
  if (jsonKeysExist) {
    let jsonKeys = fs.readFileSync(dataPath, 'utf-8')
    if(jsonKeys.length > 0){
      jsonKeys = JSON.parse(jsonKeys)
      arr = jsonKeys
    }
  }
  const prevData = arr[address.replace('0x','')] 
  arr[address.replace('0x','')] = {...prevData, ...data}

  fs.writeFileSync(dataPath, JSON.stringify(arr))
}