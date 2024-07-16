import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin'

function Layout() {
  return (
    <>
    <HeaderAdmin></HeaderAdmin>
    <Outlet></Outlet>
    </>
  )
}

export default Layout