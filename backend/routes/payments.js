const router = require('express').Router()
const axios = require('axios').default

// const sampleMpesaResponse = {
//   Body: {
//     stkCallback: {
//       MerchantRequestID: '86318-3163240-1',
//       CheckoutRequestID: 'ws_CO_180520211506578765',
//       ResultCode: 0,
//       ResultDesc: 'The service request is processed successfully.',
//       CallbackMetadata: [Object]
//     }
//   }
// }

// const CallbackMetadata = {                                                                                                                                                    15:12:16
//   Item: [
//     {
//       Name: 'Amount',
//       Value: 1
//     },
//     {
//       Name: 'MpesaReceiptNumber',
//       Value: 'PEI73SHRT3'
//     },
//     {
//       Name: 'Balance'
//     },
//     {
//       Name: 'TransactionDate',
//       Value: 20210518151214
//     },
//     {
//       Name: 'PhoneNumber',
//       Value: 254706394137
//     }
//   ]
/**
 * Verify a transaction from flutterwave
 *
 */
router.get('/verify/:transactionId', async (req, res) => {
  try {
    axios.defaults.headers['Content-Type'] = 'application/json'
    axios.defaults.headers.Authorization = `Bearer ${process.env.FLUTTERWAVE_SECRECT}`
    const { data } = await axios.get(`https://api.flutterwave.com/v3/transactions/${req.params.transactionId}/verify`)
    res.json(data)
  } catch (error) {
    res.status(error.response.status).json(error.response.data)
  }
})

router.post('/mpesa', (req, res) => {
  res.status(202).json('')
})

module.exports = router
