import logo from './logo.svg'
import './App.css'
import axios from 'axios'
import { useState } from 'react'



function App () {
  const [sendEmail, setSendEmail] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  

  const emailHandler = e => {

    e.preventDefault()
    axios
      .post(`http://localhost:4900/sendMail/${userId}`, {
      
        email: email,
        name: name,
        message: message
      })
      .then(res => {
        setSendEmail(res.data)
        setEmail('')
        setName('')
        setMessage('')
        console.log(res.data)
      })
      .catch(err => {
        console.log('error emailHandler', err)
      })
  }

  return (
    <div key={sendEmail} className="App">
      <form onSubmit={emailHandler}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          name="name"
          placeholder="Your Name:"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="Your Email:"
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          name="message"
          placeholder="Details of your problem"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default App


