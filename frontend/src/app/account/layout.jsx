import React from 'react'
import Navbar from '../../components/Navbar'
const Accountlayout = ({children}) => {
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

export default Accountlayout