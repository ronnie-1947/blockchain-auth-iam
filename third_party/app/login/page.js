'use client'

import React, { useState } from 'react'
import styles from './Login.module.scss';
import { encrypt } from '@/utils/crypto';

const Login = () => {


  const [address, setAddress] = useState('')
  const loginWithWeb3 = async (e) => {

    try {

      e.preventDefault()

      // Fetch public key
      const socket = new WebSocket('ws://localhost:3735/ws');

      socket.onopen = () => {
        socket.send(JSON.stringify({ payload: { whoami: 'other_react' }, status: 'initialized' }))
        socket.send(JSON.stringify({ payload: { address }, status: 'fetchPub' }))
      }

      
      let otp = ''
      socket.onmessage = async (event) => {
        const receivedMessage = JSON.parse(event.data);
        console.log(receivedMessage)
        
        const { status, payload } = receivedMessage

        switch (status) {

          case 'getPubKey':
            const { pubKey } = payload

            // Generate a 10 digit code
            const min = 1000000000; // Minimum 10-digit number
            const max = 9999999999; // Maximum 10-digit number

            const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
            otp = randomCode.toString()

            // Encrypt with the public key
            const encryptedHex = await encrypt(pubKey, otp)

            socket.send(JSON.stringify({ status: 'sentEncryptedCode', payload:encryptedHex }))
            break

          case 'decryptedCode':
            if(payload === otp){
              console.log('LOGGED IN')
            }
            break

          case 'error':
            const { message } = payload
            console.log(message)
            socket.close()
            break
        }
      };
    } catch (error) {
      console.error(error)
    }
  };


  return (
    <body className={styles.body}>
      <div className={styles.logincontainer}>
        <h1 className={styles.loginheading}>LOGIN</h1>
        <form onSubmit={loginWithWeb3}>
          <input type="text" className={styles.addressinput} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" id="addressInput" />
          <button className={styles.loginbutton} onClick={loginWithWeb3}>Login with Web3</button>
        </form>

        {/* Your Web3 login logic goes here */}
      </div>

    </body>
  );
}

export default Login