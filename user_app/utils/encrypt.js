

export async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert the hex string to an array of bytes
  const bytePairs = key.match(/.{1,2}/g) || [];
  const bytes = bytePairs.map((byte) => parseInt(byte, 16));

  // Create an ArrayBuffer from the array of bytes
  const keyBuffer = new Uint8Array(bytes).buffer;

  // Import the key
  const importedKey = await crypto.subtle.importKey('raw', keyBuffer, 'AES-GCM', true, ['encrypt']);

  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, importedKey, encodedData);

  // Concatenate IV and encrypted data
  const result = new Uint8Array(iv.length + encryptedData.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedData), iv.length);

  const hexPairs = Array.from(result, (byte) => byte.toString(16).padStart(2, '0'));
  return hexPairs.join('');
}

export async function decryptData(encryptedHexData, key) {
  // Extract IV from the encrypted data
  const iv = encryptedData.slice(0, 12);

  const bytePairs = key.match(/.{1,2}/g) || [];
  const bytes = bytePairs.map((byte) => parseInt(byte, 16));
  const byteData = encryptedHexData.match(/.{1,2}/g) || [];
  const bytesData = byteData.map((byte) => parseInt(byte, 16));

  // Create an ArrayBuffer from the array of bytes
  const keyBuffer = new Uint8Array(bytes).buffer;

  // Extract encrypted data
  const encryptedBytes = bytesData.slice(12);

  // Import the key
  const importedKey = await crypto.subtle.importKey('raw', keyBuffer, 'AES-GCM', true, ['decrypt']);

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, importedKey, encryptedBytes);

  // Convert the decrypted data to a string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

export async function decryptWithPrivateKey(encryptedHex, privateKey) {
  const privKey = pemToBinary(privateKey);

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    privKey,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );

  // Convert the hex string to a Uint8Array
  const encryptedArray = new Uint8Array(encryptedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  
  // Decrypt the encrypted data
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    cryptoKey,
    encryptedArray.buffer
  );

  // Convert the decrypted data ArrayBuffer to a string
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(decryptedData);
}


function pemToBinary(pem) {
  // Remove the first and last lines of the PEM format
  const pemBody = pem.replace(/-----BEG.*KEY-----/g, '').replace(/-----END.*KEY-----/g, '');

  // Remove any newline characters and decode the base64 data
  const binaryString = atob(pemBody.replace(/\s/g, ''));

  // Convert the binary string to an ArrayBuffer
  const binary = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    binary[i] = binaryString.charCodeAt(i);
  }

  return binary.buffer;
}