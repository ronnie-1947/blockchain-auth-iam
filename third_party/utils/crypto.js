export const encrypt = async (publicKey, data) => {

  const pubKey = pemToBinary(publicKey)

  const cryptoKey = await crypto.subtle.importKey(
    'spki',
    pubKey,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );
  const encoder = new TextEncoder();
  const dataToEncrypt = encoder.encode(data);
  
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    cryptoKey,
    dataToEncrypt
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const encryptedHex = Array.from(encryptedArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return encryptedHex
}

function pemToBinary(pem) {
  // Remove the first and last lines of the PEM format
  const pemBody = pem.replace(/-----BEGIN PUBLIC KEY-----/, '').replace(/-----END PUBLIC KEY-----/, '');

  // Remove any newline characters and decode the base64 data
  const binaryString = atob(pemBody.replace(/\s/g, ''));

  // Convert the binary string to an ArrayBuffer
  const binary = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    binary[i] = binaryString.charCodeAt(i);
  }

  return binary.buffer;
}
