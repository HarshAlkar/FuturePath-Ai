import React from 'react'
import Nav_Sub from './Nav_Sub'
// import Overview from './Overview'
import Hero from './Hero'
// import bodyBg from '../../assets/body_bg.svg' 
import Recent_Logs from './Recent_Logs'

const Side = () => {
  return (
    <div
      className=" w-full mx-[15em] mb-0 h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center "
      // style={{ backgroundImage: `url(${bodyBg})` }}
    >
      <Nav_Sub />
      <Hero />
      <Recent_Logs />
    </div>
  )
}

export default Side
