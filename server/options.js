const fs = require('fs');
const path = require('path');
const sendMail = require('./gmail');

const main = async () => {
    const {name, email, message} = req.body
    const options = {
        subject: `Portfolio email from ${email}`,
        html: `
        <div>
          name: ${name}
          email: ${email}
          message: ${message}
          </div>
          `
    }
          const messageId = await sendMail(options);
          return messageId;
    };


main()
  .then((messageId) => console.log('Message sent successfully:', messageId))
  .catch((err) => console.error(err));