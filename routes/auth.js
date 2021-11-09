const Router = require('express')
const { check, query } = require('express-validator')

const router = new Router()
const authClass = require('./classes/authClass')

const ensureAuth = require('./middleware/ensureAuth')

router.post(
	'/sign_up',
	[
		check('email', 'Invalid email!').isEmail(),
		check('password', 'Password must be 4-24 characters long!').isLength({
			min: 4,
			max: 24,
		}),
	],
	authClass.sign_up
)

router.post(
	'/login',
	[
		query('email').isEmail(),
		check('password').isLength({
			min: 4,
			max: 24,
		}),
	],
	authClass.login
)

router.get('/refresh', authClass.refresh)

router.get('/me0', ensureAuth, authClass.me(0))
router.get('/me1', ensureAuth, authClass.me(1))
router.get('/me2', ensureAuth, authClass.me(2))
router.get('/me3', ensureAuth, authClass.me(3))
router.get('/me4', ensureAuth, authClass.me(4))
router.get('/me5', ensureAuth, authClass.me(5))
router.get('/me6', ensureAuth, authClass.me(6))
router.get('/me7', ensureAuth, authClass.me(7))
router.get('/me8', ensureAuth, authClass.me(8))
router.get('/me9', ensureAuth, authClass.me(9))

module.exports = router
