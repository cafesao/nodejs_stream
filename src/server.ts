import http from 'http'
import { Transform } from 'stream'
import fs from 'fs'
import path from 'path'
import csv from 'fast-csv'

const __dirname = path.resolve()
const pathFile = path.resolve(__dirname, 'microdados.csv')

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
  const transform = new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      if (chunk['porte_empresa'] === 'Grande Porte') {
        cb(null, JSON.stringify(chunk))
      } else {
        cb(null, '')
      }
    },
  })

  fs.createReadStream(pathFile)
    .pipe(csv.parse({ headers: true }))
    .pipe(transform)
    .pipe(res)
}

http
  .createServer(handler)
  .listen(3000)
  .on('listening', () => {
    console.log('Server start at port 3000')
  })
