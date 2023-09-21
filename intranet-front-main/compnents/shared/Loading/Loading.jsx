import React from 'react'
import Styles from "./Loading.module.css"
export default function Loading() {
  return (
    <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
      <span className={Styles.loader}></span>
    </div>
  )
}
