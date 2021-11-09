const { MongoClient } = require('mongodb')
const config = require('config')

const dbClient = new MongoClient(config.get('db.conStr'), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

module.exports = dbClient
