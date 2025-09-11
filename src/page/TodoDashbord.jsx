import React, { useState } from 'react'
import Sidebar from '../component/Sidebar'
import { AlignJustify } from 'lucide-react'
import { Outlet } from 'react-router-dom'

const TodoDashbord = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('todolist')

  return (
    <div className='flex '>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="p-4 w-full z-10 h-screen overflow-y-auto">
        {/* Toggle Button (only for mobile) */}
        <button
          className="flex items-center gap-1 md:hidden bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => setIsOpen(true)} >
          <AlignJustify className='w-4 h-4'/> Menu
        </button>

          <Outlet/>
        
      </div>
    </div>
  )
}

export default TodoDashbord