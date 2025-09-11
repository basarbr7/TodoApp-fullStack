import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ status = 404, message = "Page not found" }) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500">{status}</h1>
      <p className="mt-4 text-2xl font-semibold">{message}</p>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Home
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-200 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
