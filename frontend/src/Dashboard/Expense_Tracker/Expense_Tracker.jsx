import React from 'react'
import Nav_Sub from './Nav_Sub'
import ET_Hero from './ET_Hero'

const Expense_Tracker = () => {
  return (
    <div className="w-full mx-[15em] mb-0 h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center ">
      <Nav_Sub />
      <ET_Hero />
    </div>
  )
}

export default Expense_Tracker
