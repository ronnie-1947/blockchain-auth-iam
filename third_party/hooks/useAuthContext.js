'use client'

import { createContext, useContext as ctxt, useReducer } from 'react'

const Context = createContext()

const reducer = (state, action)=>{
  
  switch (action.type){

    case 'login':
      return {...state, user: action?.payload}

    default:
      throw new Error('no type provided')
  }
}

function ContextProvider({children}){
  const initialState = {user: null}
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{state, dispatch}}>
      {children}
    </Context.Provider>
  )
}

function useContext(){
  const context = ctxt(Context)
  return context;
}

export {ContextProvider, useContext}