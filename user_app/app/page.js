'use client'

import React, { useEffect, useState } from 'react'
import styles from './Page.module.scss';
import { encryptData } from '@/utils/encrypt';
import { useContext } from '@/hooks/useAuthContext';
import Link from 'next/link';


const page = () => {

  const { state } = useContext()
  const userData = state.user

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
    const encrypted = await encryptData(value, userData?.walletKey)

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

    await store.json()
    setFormData({
      key: '',
      value: ''
    })
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topSection}>
        <h1>Welcome to User Wallet App</h1>
        <p>
          <strong>Name:</strong> {userData?.name} | <strong>Email:</strong> {userData?.email} |{' '}
          <strong>Address:</strong> {userData?.address}
        </p>
        <Link href='/consent'>
          <button>
            See consents
          </button>
        </Link>
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