'use client'

import { useEffect, useState } from 'react';
import './LoginPage.css'; // Import the CSS file for styling
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const [accounts, setAccounts] = useState([])

  const router = useRouter()

  useEffect(() => {
    (async function () {
      const accounts = await fetch('http://localhost:3735/eth/accounts', {
        method: 'get'
      })
      const jsonData = await accounts.json()
      setAccounts(jsonData)

    }())

  }, [])

  const handleLogin = async (account) => {
    try {
      const login = await fetch('http://localhost:3735/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          address: account
        })
      })
  
      const jsonResponse = await login.json()
      jsonResponse.address = account
      if(jsonResponse.error)throw new Error(jsonResponse)
      window.localStorage.setItem('token', JSON.stringify(jsonResponse))
      router.push('/')
    } catch (error) {
      router.push(`/signup?acc=${account}`)
    }

  }

  return (
    <div className="login-page">
      <h1>Login to an account</h1>

      <div className="account-list">
        <h2>Account List</h2>
        <ul>
          {accounts.map((account) => (
            <li key={account} onClick={() => handleLogin(account)} className="account-button">
              <strong>{account}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
