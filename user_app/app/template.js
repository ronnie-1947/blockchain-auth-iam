'use client'

import { ContextProvider, useContext } from '@/hooks/useAuthContext'
import useSocket from '@/hooks/useSocket'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import PopupLayout from './screens/PopupLayout'
import Popup from './screens/Popup'
import { decryptData, decryptWithPrivateKey } from '@/utils/encrypt'

const Auth = ({ children }) => {

  const [consentPopup, setConsentPopup] = useState(null)
  const [loginPopup, setLoginPopup] = useState(null)
  const [popupData, setPopupData] = useState(null)
  useSocket(consentPopup, setConsentPopup, setLoginPopup)
  const { dispatch, state } = useContext()
  const router = useRouter()
  const pathname = usePathname()




  useEffect(() => {
    const userTkn = window.localStorage.getItem('token')
    if (!userTkn) {
      if (!pathname.includes('signup')) router.push('/login')
      return
    }
    const user = JSON.parse(userTkn)
    dispatch({ type: 'login', payload: user })
  }, [])

  const consentAcceptHandler = async () => {

    const { encryptedData, purpose, dataName, domain } = consentPopup
    console.log('Encrypted', encryptedData)

    const tokenStr = window.localStorage.getItem('token')
    if (!tokenStr) throw new Error('You are not logged in')
    const token = JSON.parse(tokenStr)
    const decryptedData = await decryptData(encryptedData, token.walletKey)
    // Send it to backend
    window.connection.send(JSON.stringify({
      status: 'sentDecryptedData',
      payload: {
        address: token.address,
        data: {
          [dataName]: decryptedData
        },
        purpose, domain, newConsent: true
      }
    }))
    setConsentPopup(null)

  }
  const rejectHandler = async (e) => {
    setConsentPopup(null)
    setLoginPopup(null)
  }

  const loginAcceptHandler = async () => {
    // Decrypt the code with private key
    const encryptedCode = loginPopup?.encryptedCode
    const tokenStr = window.localStorage.getItem('token')
    if (!tokenStr) throw new Error('You are not logged in')
    const token = JSON.parse(tokenStr)

    const decryptedMessage = await decryptWithPrivateKey(encryptedCode, token?.privateKey)
    console.log(decryptedMessage)
    // Return the message to server
    window.connection?.send(JSON.stringify({ status: 'sentDecryptCode', payload: decryptedMessage }))
    setLoginPopup(null)
  }

  useEffect(() => {
    console.log(consentPopup)
    let popupData = null
    if (loginPopup?.encryptedCode) {
      popupData = {
        header: 'Login Request',
        subHeader: `A third party app is requesting to Login`,
        paragraph: '',
        onButtonClick1: loginAcceptHandler,
        onButtonClick2: rejectHandler
      }
    } else if (consentPopup?.noConsent) {
      popupData = {
        header: 'New Consent Request',
        subHeader: `${consentPopup?.domain} has requested to view ${consentPopup?.dataName} for purpose: ${consentPopup?.purpose}`,
        paragraph: `I hereby provide consent to ${consentPopup?.domain} to view ${consentPopup?.dataName} for the purpose : ${consentPopup?.purpose}`,
        onButtonClick1: consentAcceptHandler,
        onButtonClick2: rejectHandler
      }
    }
    setPopupData(popupData)

  }, [consentPopup, loginPopup])


  return (
    <>
      {
        loginPopup?.encryptedCode || consentPopup?.noConsent && (
          <PopupLayout>
            <Popup {...popupData} />
          </PopupLayout>
        )
      }
      {children}
    </>
  )
}

export default function Template({ children }) {
  return <ContextProvider><Auth>{children}</Auth></ContextProvider>
}