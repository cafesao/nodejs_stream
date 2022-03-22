import axios from 'axios'
import { Transform, Writable } from 'stream'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
const pathFile = path.resolve(__dirname, 'def.json')

const url = 'http://localhost:3000'

async function consume() {
  const response = await axios({ url, method: 'get', responseType: 'stream' })

  return response.data
}

const writableStream = fs.createWriteStream(pathFile)
writableStream.write('[')
;(async () => {
  const stream = await consume()
  stream
    .on('data', (chunk: any) => {
      writableStream.write(chunk)
      writableStream.write(',')
    })
    .on('close', () => {
      writableStream.write(']')
      console.log('Done!')
    })
})()
