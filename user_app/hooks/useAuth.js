'use client'

import { decryptWithPrivateKey } from '@/utils/encrypt';
import { useEffect } from 'react'

const useAuth = () => {

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3735/ws');

    socket.onopen = () => {
      socket.send(JSON.stringify({ status: 'initialized', payload: { whoami: 'client_react' } }))
    };

    // socket.send(JSON.stringify({ status: 'decrypt_auth', whoami: 'client_react' }))
    socket.onmessage = async (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage)

      const { status = '', payload = {} } = receivedMessage

      switch (status) {
        case 'decryptCode':

          const { encryptedCode } = payload
          // Decrypt the code with private key

          const tokenStr = window.localStorage.getItem('token')
          if (!tokenStr) throw new Error('You are not logged in')
          const token = JSON.parse(tokenStr)
          const decryptedMessage = await decryptWithPrivateKey(encryptedCode, token?.privateKey)
          console.log(decryptedMessage)
          // Return the message to server
          socket.send(JSON.stringify({ status: 'sentDecryptCode', payload: decryptedMessage }))
      }
    };

    return () => {
      "Closing conn"
      socket.close()
    }


  }, []);

}

export default useAuth