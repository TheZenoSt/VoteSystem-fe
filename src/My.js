import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Logout from './Logout'

export default function My({ setUserInfo }) {
  const [myVotes, setMyVotes] = useState([])

  useEffect(() => {
    axios.get('/myvotes').then(res => {
      setMyVotes(res.data)
    })
  }, [])

  return (
    <>
      <h5 className='text-muted display-5'>我创建的投票</h5>
      <ul className='list-group list-group-flush my-3'>
        {/* <ul> */}
        {myVotes.map((vote, idx) => {
          return (
            // <li key={idx} className='card'>
            <li key={idx} className='list-group-item'>
              <div className='card-body d-flex justify-content-between'>
                <Link to={`/vote/${vote.id}`}>
                  <span className='card-link'>{vote.title}</span>
                </Link>
                <button className='btn btn-sm btn-outline-primary'>删除</button>
              </div>
            </li>
          )
        })}
      </ul>
      {/* 直接退出按钮组件 */}
      <Logout setUserInfo={setUserInfo} />
    </>
  )
}
