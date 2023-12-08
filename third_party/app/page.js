'use client'
import { useState } from 'react';
import styles from './page.module.scss'
import { useContext } from '@/hooks/useAuthContext';
import { useRouter } from 'next/navigation';

// App.js


const App = () => {


  const { state } = useContext()
  const router = useRouter()

  const [formData, setFormData] = useState({
    data: '',
    purpose: '',
    expiry: '',
  });
  const [retrivedData, setRetrivedData] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // You can perform any action with the form data here

    if(!formData.data || !formData.expiry || !formData.purpose) return
    
    const socket = new WebSocket('ws://localhost:3735/ws')

    socket.onopen = () => {
      socket.send(JSON.stringify({ payload: { whoami: 'other_react' }, status: 'initialized' }))
      socket.send(JSON.stringify({ payload: { ...formData, domain: 'UOGuelph', address: state?.user }, status: 'reqData' }))
    }

    socket.onmessage = async(e)=>{
      const receivedMessage = JSON.parse(e.data)
      console.log(receivedMessage)

      const {status, payload} = receivedMessage

      // status === 'dataReqFailed'
      switch (status) {
        case 'dataRetrived':
          setRetrivedData(JSON.stringify(payload))
          break;
      
        default:
          break;
      }

    }
  };

  const logoutHandler = ()=>{
    window.localStorage.clear()
    router.push('/login')
  }

  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <p>User : {state.user}</p>
        <button onClick={logoutHandler}>Logout</button>
      </nav>

      {/* Page Content */}
      <div className={styles.box}>
        {/* Header */}
        <h1>Request sensitive user data</h1>

        {/* Paragraph with Information */}
        <p>
          Assume this is UOGuelph.com. UOGuelph wants SIN number of one of the user. UOGuelph can send a Request the user's wallet to share the SIN here.  
        </p>

        {/* Form */}
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <label>
            Request Data:
            <input
              type="text"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Purpose:
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Expiry:
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleInputChange}
            />
          </label>

          {/* Form Button */}
          <button type="submit">Submit</button>
        </form>
      </div>
      {
        retrivedData && (
          <div className={styles.box}>
            <h2>Your requested Data</h2>
            <h3>{retrivedData}</h3>
          </div>
        )
      }
    </main>
  );
};

export default App;
