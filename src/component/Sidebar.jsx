import { href, NavLink } from 'react-router-dom';
import { List, Pen, Plus, X } from 'lucide-react';
import { useEffect } from 'react';

const menuItems = [
  { name: "Todo List", href: "", icon: List },
  { name: "Add Todo", href: "add", icon: Plus },
  // { name: "Update", href: "update", icon: Pen },
]

const Sidebar = ({ isOpen, setIsOpen }) => {

  useEffect(() => {
      if (isOpen) {
      document.body.style.overflow = 'hidden'
      } else {
      document.body.style.overflow = 'auto'
      }
      return () => {
      document.body.style.overflow = 'auto'
      }
  }, [isOpen])

  return (
    <>
      {/* Sidebar */}
      <div className={`
          fixed md:static top-[64px] left-0 h-screen w-68 bg-slate-900 text-white p-6 z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
        {/* Close Button only mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <X className="text-white h-6 w-6" />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-8">📝 TodoApp</h1>
        <nav className="flex flex-col gap-4">
          {
            menuItems.map((item, index)=>(
              <NavLink onClick={() => setIsOpen(false)} to={item.href} end={item.href===""} key={index} className={({isActive})=>`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition ${isActive ? 'bg-gray-700': 'hover:bg-gray-500'} `}>
                <item.icon size={24}/>{item.name}
              </NavLink>
            ))
          }
        </nav>
      </div>

      {/* Backdrop only mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black opacity-50 z-20 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
