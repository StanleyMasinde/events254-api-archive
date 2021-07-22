const router = require('express').Router()
const axios = require('axios').default

/**
 * Verify a transaction from flutterwave
 *
 */
router.get('/verify/:transactionId', async (req, res, next) => {
  try {
    axios.defaults.headers['Content-Type'] = 'application/json'
    axios.defaults.headers.Authorization = `Bearer ${process.env.FLUTTERWAVE_SECRECT}`
    const { data } = await axios.get(`https://api.flutterwave.com/v3/transactions/${req.params.transactionId}/verify`)
    res.json(data)
  } catch (error) {
    res.status(error.response.status).json(error.response.data)
  }
})

module.exports = router
