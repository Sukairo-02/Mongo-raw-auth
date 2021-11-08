const express = require('express')
const db = require('mongodb')
const config = require('config')

const app = express()
app.use(express.json({ extended: true }))
