const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dbClient = require('../../database/dbObject')
const config = require('config')
const { validationResult } = require('express-validator')
const { ObjectId } = require('bson')

class authClass {
	sign_up = async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(403)
					.json({ message: 'Registration error!', errors })
			}
			const { email } = req.body

			const cUser = dbClient.db('Lambda').collection('User')
			const user = await cUser.findOne({ email })

			if (user) {
				return res
					.status(403)
					.json({ message: 'This email adress is already occupied!' })
			}

			const hashPass = await bcrypt.hash(req.body.password, 7)
			const newUser = { email, password: hashPass }

			await cUser.insertOne(newUser)

			return res.json({
				message: 'You have been succesfully registered!',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: 'Internal server error!' })
		}
	}

	login = async (req, res) => {
		try {
			const { email, password } = req.query
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(403)
					.json({ message: 'Invalid email or password!' })
			}

			const cUser = dbClient.db('Lambda').collection('User')
			const user = await cUser.findOne({ email })

			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res
					.status(403)
					.json({ message: 'Invalid email or password!' })
			}

			const accessToken = jwt.sign(
				{
					id: user._id,
				},
				config.get('jwt.access'),
				{
					expiresIn: '' + Math.floor(Math.random() * 20 + 40) + 's',
				}
			)

			const refreshToken = jwt.sign(
				{
					id: user._id,
				},
				config.get('jwt.refresh')
			)

			return res.json({ accessToken, refreshToken })
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: 'Internal server error!' })
		}
	}

	refresh = async (req, res) => {
		try {
			const refreshToken = req.headers.authorization.split(' ')[1]
			if (!refreshToken) {
				return res
					.status(401)
					.json({ message: 'You are not authorized!' })
			}

			let tData
			try {
				tData = jwt.verify(refreshToken, config.get('jwt.refresh'))
			} catch (ex) {
				return res
					.status(401)
					.json({ message: 'You are not authorized!' })
			}

			const cUser = dbClient.db('Lambda').collection('User')
			const user = await cUser.findOne({ _id: ObjectId(tData.id) })

			if (!user) {
				return res.status(401).json({ message: 'Nonexistent user!' })
			}

			const accessToken = jwt.sign(
				{
					id: user._id,
				},
				config.get('jwt.access'),
				{
					expiresIn: '' + Math.floor(Math.random() * 20 + 40) + 's',
				}
			)

			return res.json({ accessToken })
		} catch (e) {
			console.log(e)
			return res.status(500)
		}
	}

	me = (num) => {
		return (req, res) => {
			try {
				return res.json({
					request: num,
					data: {
						login: req.user.email,
					},
				})
			} catch (e) {
				console.log(e)
				return res.status(500)
			}
		}
	}
}

module.exports = new authClass()
