import React from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

export default function LogoutBtn({ setUserInfo }) {
  const history = useHistory()

  function logout() {
    axios.get('/logout').then(() => {
      history.push('/login')
      setUserInfo(null)
    })
  }

  return (
    <>
      <button onClick={logout} className='btn btn-default btn-primary my-3'>
        登出
      </button>
    </>
  )
}
