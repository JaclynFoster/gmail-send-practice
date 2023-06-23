require('dotenv').config()
console.log('process.env:', process.env)
const send = require('gmail-send')({
  user: process.env.EMAIL_USERNAME,
  pass: process.env.EMAIL_PASSWORD,
  to: process.env.EMAIL_USERNAME,
  subject: 'test subject',
  text: 'gmail send test'
})

const filepath = './demo-attachment.txt'

const sendEmail = (req, res) => {
  const { name, email, message } = req.body
  send(
    {
      subject: `Portfolio email from ${email}`,
      text: `
        name: ${name}
        email: ${email}
        message: ${message}
        `
    },
    (error, result, fullResult) => {
      if (error) console.error(error)
      res.sendStatus(200)
      console.log(result)
    }
  )
}

module.exports = { sendEmail }
