const express = require('express')
const cors = require('cors')
const { json } = require('body-parser')
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs').promises
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
require('dotenv').config()

const port = 4900

const app = express()

app.use(express.static(`${__dirname}/../public`))
app.use(json())
app.use(cors())

const path = require('path')
const { sendMail } = require('./gmail')


app.post(`/sendMail:userId`, sendMail)

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/../public/index.html'))
})



// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    console.log("error on loadSavedCredentialsIfExist:", err)
    return null
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  try{

    const content = await fs.readFile(CREDENTIALS_PATH)
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token
    })
    await fs.writeFile(TOKEN_PATH, payload)
  } catch (err) {
    console.log("Error on saveCredentials:", err)
  }
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  try {

    let client = await loadSavedCredentialsIfExist()
    if (client) {
      return client
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH
    })
    if (client.credentials) {
      await saveCredentials(client)
    }
    return client
  } catch (err) {
    console.log("Error on authorize", err)
  }
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  try {

    const gmail = google.gmail({ version: 'v1', auth })
    const res = await gmail.users.labels.list({
      userId: 'fosterjaclynd@gmail.com'
    })
    const labels = res.data.labels
    if (!labels || labels.length === 0) {
      console.log('No labels found.')
      return
    }
    console.log('Labels:')
    labels.forEach(label => {
      console.log(`- ${label.name}`)
    })
  } catch (err) {
    console.log("Error on listLabels:", err)
  }
}

authorize()
  .then(listLabels)
  .catch(console.error)
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
