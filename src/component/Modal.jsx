import React, { useEffect } from "react";
import ReactDOM from "react-dom";

function Modal({ children, onClose , className}) {
  useEffect(() => {
    // modal খোলা হলে scroll বন্ধ
    document.body.style.overflow = "hidden";
    return () => {
      // modal বন্ধ হলে আবার scroll allow
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className={`bg-white md:rounded-lg p-6 w-full h-full md:h-auto overflow-y-auto relative ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-7 right-5 text-gray-100 hover:text-red-500 text-xl cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body //  Portal er maddhome modal body te jabe
  );
}

export default Modal