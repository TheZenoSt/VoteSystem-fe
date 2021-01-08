import React from 'react'
import { Route, NavLink, useRouteMatch, Redirect } from 'react-router-dom'
import Create from './Create'
import My from './My'

export default function Home({ userInfo, setUserInfo }) {
  const { url } = useRouteMatch()

  return (
    <>
      <div className='nav-scroller bg-whhite shadow-sm fixed-top'>
        <nav className='nav'>
          <NavLink className='nav-link text-muted ml-3' to={`${url}`}>
            Nice Choice
            <img
              src='/avatar/goodJob.jpg'
              alt='logo'
              className='avatar rounded-circle ml-1'
            />
          </NavLink>
        </nav>
      </div>
      <div className='card-body mt-5'>
        <Route path={`${url}/`} exact>
          <Redirect to={`${url}/create`} />
        </Route>

        <Route path={`${url}/create`}>
          {/*  */}
          <Create />
        </Route>

        <Route path={`${url}/my`}>
          {/*  */}
          <My setUserInfo={setUserInfo} />
        </Route>
      </div>
      <nav className='card-footer navbar navbar-expand navbar-light bg-light fixed-bottom'>
        <ul className='navbar-nav mx-auto'>
          <div className='row mx-md-n5'>
            <div className='col px-md-5'>
              <li className='nav-item p-3 btn btn-lg btn-block btn-outline-primary'>
                <NavLink className='nav-link' to={`${url}/create`}>
                  新建
                </NavLink>
              </li>
            </div>
            <div className='col px-md-5'>
              <li className='nav-item p-3 btn btn-lg btn-block btn-outline-primary'>
                <NavLink className='nav-link' to={`${url}/my`}>
                  我的
                </NavLink>
              </li>
            </div>
          </div>
        </ul>
      </nav>
    </>
  )
}
