'use client'

import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import styles from './Signup.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const signup = () => {
  const params = useSearchParams()
  const account = params.get('acc')

  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const login = await fetch('http://localhost:3735/auth/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: account,
        name: formData.name,
        email: formData.email
      })
    })

    const jsonResponse = await login.json()

    console.log(jsonResponse)
    router.push('/login')
  };

  return (
    <div className={styles.formContainer}>
      <h1>Simple Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <p>
        Go back to{' '}
        <Link href="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

export default signup