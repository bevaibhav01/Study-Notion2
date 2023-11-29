import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children,active,linkto}) => {
  return (
   <Link to={linkto}>
   <div className={` hover:scale-95
    ${ active ? "bg-yellow-50 text-black":"bg-richblack-800"} translate-all duration-200 text-center text-[13px] px-6 py-3 rounded-md font-bold`}>
    {children}
   </div>
   </Link>
  )
}

export default Button