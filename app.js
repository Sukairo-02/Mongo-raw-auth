'use strict'
const express = require('express')
const config = require('config')
const dbClient = require('./database/dbObject')

const app = express()
app.use(express.json({ extended: true }))

const authRouter = require('./routes/auth')

app.use('/auth', authRouter)

const PORT = config.get('server.PORT') || 3000

const start = async () => {
	try {
		await dbClient.connect((err) => {
			console.log(err || 'Database connected succesfully!')
		})
		app.listen(PORT, () => {
			console.log(`Server has been started at port: ${PORT}`)
		})
	} catch (e) {
		console.log(e)
	} finally {
		await dbClient.close()
		console.log('DB connection has been terminated.\n')
	}
}

start()
