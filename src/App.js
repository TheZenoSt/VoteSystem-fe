import React, { useState, useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Switch, useHistory, Redirect } from 'react-router-dom'
import axios from 'axios'
// 自定义组件
import Home from './Home'
import Login from './Login'
import CreateVote from './CreateVote'
import ViewVote from './ViewVote'

export default function App() {
  const history = useHistory()
  const [userInfo, setUserInfo] = useState(undefined)

  useEffect(() => {
    axios
      .get('/userinfo')
      .then(res => {
        // history.push('/home')
        /** 得到 userinfo 后进行设置 */
        setUserInfo(res.data)
        console.log(res.data)
      })
      .catch(e => {
        console.log('用户未登录，将显示登录界面')
        history.push('/login')
      })
    // eslint-disable-next-line
  }, [])

  return (
    <div className='App'>
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>

        <Route path='/login'>
          {/* <Login /> */}
          <Login setUserInfo={setUserInfo} />
        </Route>

        <Route path='/home'>
          {/* <Home /> */}
          {userInfo && <Home userInfo={userInfo} setUserInfo={setUserInfo} />}
        </Route>

        <Route path='/create-vote'>
          {/* <Home /> */}
          <CreateVote />
        </Route>

        <Route path='/vote/:id'>
          {/* <Home /> */}
          {userInfo && <ViewVote userInfo={userInfo} />}
        </Route>
      </Switch>
    </div>
  )
}
