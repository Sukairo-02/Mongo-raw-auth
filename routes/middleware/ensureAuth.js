const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		next()
		return
	}

	try {
		if (!req.headers.authorization) {
			return res.status(401).json({ message: 'You are not authorized!' })
		}

		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			return res.status(401).json({ message: 'You are not authorized!' })
		}

		try {
			req.user = jwt.verify(token, config.get('jwt.access'))
		} catch (ex) {
			return res.status(401).json({ message: 'You are not authorized!' })
		}

		next()
		return
	} catch (e) {
		console.log(e)
		return res.status(401).json({ message: 'You are not authorized!' })
	}
}
