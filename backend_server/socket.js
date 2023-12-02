import { accInfoSoc } from "./services/eth.service.js";
import WebSocket from 'ws'

const clients = new Map();

export default function (ws, req) {
  console.log('WebSocket connection established');

  const userClientId = 'client_react';
  const thirdPartyId = 'other_react';

  // Handle messages from WebSocket clients
  ws.on('message', async (message) => {
    // console.log(message)
    try {
      message = JSON.parse(message)
      const { status = '', payload = {} } = message

      switch (status) {

        case 'initialized': // Initialize
          const { whoami } = payload
          if (whoami === userClientId) clients.set(userClientId, ws)
          if (whoami === thirdPartyId) clients.set(thirdPartyId, ws)
          break

        case 'fetchPub':
          const { address } = payload
          const pubKey = (await accInfoSoc(address))?.publicKey
          if (!pubKey) throw new Error('No public key found')

          sendCustomMessageToClient(clients.get(thirdPartyId), JSON.stringify({
            status: 'getPubKey',
            payload: {
              pubKey
            }
          }))
          break

        case 'sentEncryptedCode':
          console.log(payload)
          // Send it to user Client
          sendCustomMessageToClient(clients.get(userClientId), JSON.stringify({
            status: 'decryptCode',
            payload: { encryptedCode: payload }
          }))
          break

        case 'sentDecryptCode':
          console.log(payload)
          // Send it to user Client
          sendCustomMessageToClient(clients.get(thirdPartyId), JSON.stringify({
            status: 'decryptedCode',
            payload
          }))
          break

        default:
        // Do Nothing
      }
    } catch (error) {
      sendCustomMessageToClient(clients.get(thirdPartyId), JSON.stringify({
        status: 'error',
        payload: {
          message: error.message
        }
      }))

    }
  });

  req.wsClients = clients

  // Handle WebSocket disconnect
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
}

// Function to send a custom message to a specific client
const sendCustomMessageToClient = (client, message) => {
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
}

