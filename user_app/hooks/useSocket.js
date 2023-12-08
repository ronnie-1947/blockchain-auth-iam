'use client'

import { decryptWithPrivateKey, decryptData } from '@/utils/encrypt';
import { useEffect } from 'react'

const useSocket = (consentPopup, setConsentPopup) => {

  useEffect(() => {

    try {

      const socket = new WebSocket('ws://localhost:3735/ws');
      window.connection = socket
      const tokenStr = window.localStorage.getItem('token')
      if (!tokenStr) throw new Error('You are not logged in')
      const token = JSON.parse(tokenStr)

      socket.onopen = () => {
        socket.send(JSON.stringify({ status: 'initialized', payload: { whoami: 'client_react' } }))
      };

      // socket.send(JSON.stringify({ status: 'decrypt_auth', whoami: 'client_react' }))
      socket.onmessage = async (event) => {
        const receivedMessage = JSON.parse(event.data);
        console.log('Received Message',receivedMessage)

        const { status = '', payload = {} } = receivedMessage

        switch (status) {
          case 'decryptCode':

            const { encryptedCode } = payload
            // Decrypt the code with private key

            const decryptedMessage = await decryptWithPrivateKey(encryptedCode, token?.privateKey)
            console.log(decryptedMessage)
            // Return the message to server
            socket.send(JSON.stringify({ status: 'sentDecryptCode', payload: decryptedMessage }))
            break

          case 'reqDataDecrypt':
            const {consent, encryptedData, purpose, dataName, domain} = payload

            if(consent){
              // Show popup
              setConsentPopup(payload)
              break
            }

            const decryptedData = await decryptData(encryptedData, token.walletKey)
            // Send it to backend
            socket.send(JSON.stringify({
              status: 'sentDecryptedData',
              payload: {
                address: token.address,
                data: {
                  [dataName]: decryptedData
                },
                purpose, domain, newConsent: true
              }
            }))
          }
      };

      return () => {
        "Closing conn"
      }
    } catch (error) {
      console.error(error)
      "Closing conn"
      socket.close()
    }

  }, [consentPopup]);

}

export default useSocket