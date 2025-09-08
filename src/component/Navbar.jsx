import React, { useRef, useState, useEffect } from "react";
import Container from "../layer/Container";
import { NavLink, useNavigate } from "react-router-dom";
import { CircleUser, LogOut, Menu, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserByIdQuery } from "../redux/rtkApi";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Todo", path: "/todo" },
];

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const { data } = useUserByIdQuery(userId);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLogin();
    window.addEventListener("authChanged", checkLogin);
    return () => window.removeEventListener("authChanged", checkLogin);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <nav className="bg-amber-300">
      <Container>
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">ToDo App</div>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* desktop menu */}
          <ul className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className="text-gray-800 hover:text-gray-600"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* desktop login/profile */}
          <div ref={profileRef} className="hidden md:block relative">
            {isLoggedIn ? (
              <div>
                {/* avatar */}
                <div
                  onClick={() => setOpenProfile(!openProfile)}
                  className="rounded-full w-10 h-10 bg-gray-700 cursor-pointer flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://node-express-mongo-ce73.onrender.com/uploads/${data?.image}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* dropdown */}
                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full w-40 right-0 mt-2 py-2 bg-[#d9d9d9] shadow-lg rounded-sm flex flex-col z-40 overflow-hidden select-none"
                    >
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setOpenProfile(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-200 transition-colors flex items-center gap-3"
                      >
                        <CircleUser size={18} /> My Account
                      </button>
                      <button className="px-4 py-2 hover:bg-gray-200 transition-colors flex items-center gap-3">
                        <Settings size={18} /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-left hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-3"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 px-6 py-2 rounded-sm cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* mobile menu overlay */}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              className="bg-black/75 fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] z-40"
            />
          )}

          {/* mobile offcanvas menu */}
          <div
            className={`md:hidden fixed top-[64px] left-0 w-64 h-screen bg-slate-900 z-50 transition-transform duration-300 p-4  ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            {/*  menu items */}
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    onClick={closeMenu}
                    className="block px-4 py-2 text-white hover:bg-gray-700 rounded"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/*  login/profile section */}
        
            <div className="mt-50">
              <div className="border-t mb-2 border-gray-600 my-2"></div>

              {isLoggedIn ? (
                <div className="px-4 py-2 text-white">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-2 hover:bg-gray-700 rounded"
                  >
                    <CircleUser size={18} /> My Account
                  </button>
                  <button
                    onClick={() => {
                      navigate("#");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 py-2 hover:bg-gray-700 rounded"
                  >
                    <Settings size={18} /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-2 hover:bg-red-600 rounded mt-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-2"
                >
                  Login
                </button>
              )}
            </div>
            
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
