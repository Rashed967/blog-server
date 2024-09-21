import { Server } from 'http'
import app from './app'
import mongoose from 'mongoose'
import config from './app/config'
let server: Server

// console.log(randomId)

async function main() {
    await mongoose.connect(config.database_url as string)
    server = app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`)
    })
}

main()
