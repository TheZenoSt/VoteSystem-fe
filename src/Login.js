import axios from 'axios'
import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'
import './Login.css'

/**
 *
 * @param {*} param0
 * 接收到一个 函数 Props，或者说是 Hooks
 * 将其在下面进行调用
 */
export default function Login({ setUserInfo }) {
  const nameRef = useRef()
  const passwordRef = useRef()
  const history = useHistory()

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/login', {
        name: nameRef.current.value,
        password: passwordRef.current.value,
      })

      setUserInfo(res.data)
      history.push('/home')
    } catch (e) {
      // console.log(e.msg.toString())
      if (e.response) {
        // console.log('e.response: ', e.response)
        console.log(e.response.data.msg)
      } else {
        console.log('Err: ', e)
      }
    }
  }

  return (
    <div>
      <form className='form-signin'>
        <img
          src='https://isometric.online/wp-content/uploads/2019/07/Data_chart_SVG.svg'
          alt='vote-system-logo'
          className='mb-4'
          width='80%'
          height='80%'
        />
        <h1 className='h3 mb-3 font-weight-normal'>请登录</h1>
        <div className='form-label-group'>
          <input
            type='text'
            id='inputUserName'
            className='form-control'
            placeholder='Username'
            required
            autoFocus
            ref={nameRef}
          />
          <label htmlFor='inputUserName'>Username</label>
        </div>

        <div className='form-label-group'>
          <input
            type='password'
            id='inputPassWord'
            className='form-control'
            placeholder='Passwords'
            required
            ref={passwordRef}
          />
          <label htmlFor='inputPassWord'>Passwords</label>
        </div>
        <div className='checkbox'>
          <label>
            <input type='checkbox' value='remeber-me' /> 记住我
          </label>
        </div>
        <button
          onClick={handleLogin}
          className='btn btn-primary btn-block btn-lg my-3'
        >
          登录
        </button>
        <p className='text-muted text-center copyright my-5'>
          &copy; 2020-2023
        </p>
      </form>
    </div>
  )
}
