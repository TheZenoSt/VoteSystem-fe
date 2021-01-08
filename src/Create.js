import React from 'react'
import { Link } from 'react-router-dom'

export default function Create() {
  return (
    <div className='row justify-content-center'>
      <div className='col-lg-5'>
        <div className='card shadow mb-2'>
          <div className='card-body'>
            <img
              src='/uploads/single-vote-logo.png'
              alt='single-vote'
              className='mb-2'
              style={{ maxWidth: '180px' }}
            />
            <Link
              className='btn btn-lg btn-block btn-primary shadow mb-4'
              type='button'
              to='/create-vote'
            >
              单选投票
            </Link>
          </div>
        </div>
        <div className='card shadow mb-2'>
          <div className='card-body'>
            <img
              src='/uploads/multiple-votes-logo.png'
              alt='multiple-votes'
              className='mb-2'
              style={{ maxWidth: '180px' }}
            />
            <Link
              className='btn btn-lg btn-block btn-primary shadow mb-4'
              type='button'
              to='/create-vote?multiple=1'
            >
              多选投票
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
