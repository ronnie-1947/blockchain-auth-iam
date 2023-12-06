'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './Page.module.scss';
import { encryptData } from '@/utils/encrypt';
import { useContext } from '@/hooks/useAuthContext';


const page = () => {

  const {state} = useContext()
  const userData = state.user
  console.log(userData)

  const [formData, setFormData] = useState({
    key: '',
    value: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    const { key, value } = formData

    if (key.length < 1 || value.length < 1) return

    // Encrypt with private key
    const encrypted = await encryptData(value, userData?.walletKey.replace('0x', ''))

    // Submit data
    const store = await fetch('http://localhost:3735/private/storeData', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${userData?.address}`
      },
      body: JSON.stringify({
        [key]: encrypted,
      })
    })

    const jsonResponse = await store.json()

    console.log(jsonResponse)
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topSection}>
        <h1>Welcome to Next.js App</h1>
        <p>
          <strong>Name:</strong> {userData?.name} | <strong>Email:</strong> {userData?.email} |{' '}
          <strong>Address:</strong> {userData?.address}
        </p>
      </div>

      <div className={styles.bottomSection}>
        <h2>Add Sensitive Data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Data Name:
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
            />
          </label>
          <label>
            Sensitive Data Value:
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default page