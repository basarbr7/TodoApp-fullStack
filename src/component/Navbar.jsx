import React, { useRef, useState, useEffect } from "react";
import Container from "../layer/Container";
import { NavLink, useNavigate } from "react-router-dom";
import { CircleUser, LogOut, Menu, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserByIdQuery } from "../redux/rtkApi";



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

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "My Tasks", path: "/todo" },
    ...(isLoggedIn ? [{ name: "Profile", path: "/profile" }] : []),
  ];

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
    <nav className="bg-white/80  shadow-sm">
      <Container>
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">ToDo App</div>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                ""
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
                  className=" w-10 h-10  bg-black rounded-full cursor-pointer  flex items-center justify-center overflow-hidden "
                >
                  <img
                    src={
                      data?.image
                        ? `https://node-express-mongo-ce73.onrender.com/uploads/${data.image}`
                        : " "
                    }
                    alt=""
                    className="w-full h-full object-cover "
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
                      <button
                        onClick={() => {
                          navigate("/setting");
                          setOpenProfile(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-200 transition-colors flex items-center gap-3"
                      >
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
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
              />
            )}
          </AnimatePresence>

          {/* mobile offcanvas menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 left-0 w-[70%] h-full bg-slate-900 z-50 md:hidden flex flex-col "
              >
                <div onClick={()=>setMenuOpen(false)}>
                  <X  className="w-6 h-6 absolute top-4 -right-[30%] text-white" />
                </div>

                <div className="bg-white py-5 w-full">
                  <div className="px-10">TodoApp</div>
                </div>

                {/* menu items */}
                <ul className="space-y-4 flex-1 mx-10 mt-5 ">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <NavLink
                        to={item.path}
                        onClick={closeMenu}
                        className=" text-white hover:bg-gray-700 rounded"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                {/* login/profile section */}
                <div className="border-t border-gray-600 pt-4 mx-10 ">
                  {isLoggedIn ? (
                    <div className="text-white">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          closeMenu();
                        }}
                        className="flex items-center gap-3 py-2 hover:bg-gray-700 rounded"
                      >
                        <CircleUser size={18} /> My Account
                      </button>
                      <button
                        onClick={() => {
                          navigate("/setting");
                          closeMenu();
                        }}
                        className=" flex items-center gap-3 py-2 hover:bg-gray-700 rounded"
                      >
                        <Settings size={18} /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 py-2 hover:bg-red-600 rounded mt-2"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/login");
                        closeMenu();
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-2"
                    >
                      Login
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
