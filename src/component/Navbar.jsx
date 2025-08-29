import React, { useState  } from 'react'
import Container from '../layer/Container'
import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    // { name: 'Services', path: '/services' },
    // { name: 'Blog', path: '/blog' },
    { name: 'Todo', path: '/todo' }
]

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        const checkLogin = ()=>{
            const token = localStorage.getItem("token")
            setIsLoggedIn(!!token)
        }
        checkLogin()
        window.addEventListener("authChanged", checkLogin)
        return ()=> window.removeEventListener("authChanged", checkLogin)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.dispatchEvent(new Event("authChanged"));
        navigate('/');
    };

    const toggleMenu= ()=>{
        setMenuOpen(!menuOpen)
    }

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        if (menuOpen) {
        document.body.style.overflow = 'hidden'
        } else {
        document.body.style.overflow = 'auto'
        }
        return () => {
        document.body.style.overflow = 'auto'
        }
    }, [menuOpen])
    
    return (
        <nav className='bg-amber-300 '>
            <Container>
                <div className='flex justify-between items-center py-4'>
                    <div className='text-2xl font-bold'>ToDo App</div>

                    {/* Hamburger for mobile */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu}>
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                    
                    {/* desktop menu */}
                    <ul className='hidden md:flex space-x-6'>
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <a href={item.path} className='text-gray-800 hover:text-gray-600'>{item.name}</a>
                            </li>
                        ))}
                    </ul>
                    
                    {/* login and logout */}
                    <div className='hidden md:block '>
                        {isLoggedIn ? (<button onClick={handleLogout} className='bg-red-500 px-6 py-2 rounded-sm cursor-pointer'>
                                LogOut
                            </button>) : (<button onClick={()=>navigate('/login')} className='bg-blue-600 px-6 py-2 rounded-sm cursor-pointer'>
                                login
                            </button>)
                        }
                    </div>

                    {/* mobile menu offcanvas */}
                    {menuOpen && (
                        <div onClick={()=>setMenuOpen(false)} className='bg-black/75 fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] z-40 '/>
                    )}
                    <ul className={`md:hidden fixed top-[64px] left-0 w-64 h-screen bg-slate-900 z-50 transition-transform duration-300 p-4 space-y-1 overflow-y-auto
                        ${ menuOpen ? 'translate-x-0': '-translate-x-full'}` }>
                        {menuItems.map((item, index) => (
                            <li key={index} className=''>
                                <NavLink
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={`block px-4 py-1 text-white hover:bg-gray-200 rounded `}
                                    >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                </div>
            </Container>
        </nav>
    )
}

export default Navbar