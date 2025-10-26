import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetTodosByUserQuery } from "../redux/rtkApi";

const Home = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const { data, isLoading, isError } = useGetTodosByUserQuery(userId, {
    skip: !userId,
  });

  // useEffect(() => {
  //   if (data) {
  //     console.log(data);
  //   }
  // }, [data]);

  useEffect(() => {
    const handler = () => {
      const Id = localStorage.getItem("userId");
      setUserId(Id);
    };
    window.addEventListener("authChanged", handler);
    return () => {
      window.removeEventListener("authChanged", handler);
    };
  }, []);

  return (
    <div className="max-w-4xl min-h-svh mx-auto px-4 my-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-amber-600 mb-6">
        Welcome to Todo App
      </h1>

      {/* Intro */}
      <p className="text-center text-gray-700 mb-8">
        This app helps you stay organized by tracking your daily tasks. You can
        add, view, and complete todos easily.
      </p>

      {/* Status Section */}
      <div className="flex flex-col sm:flex-row justify-around text-center mb-10">
        <div className="bg-green-100 p-4 rounded-md shadow-md w-full sm:w-[30%] mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-green-700">Total Todos</h3>
          <p className="text-2xl font-bold">
            {!userId ? 0 : data?.todos?.length}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-md shadow-md w-full sm:w-[30%] mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-blue-700">Completed</h3>
          <p className="text-2xl font-bold">
            {!userId ? 0 : data?.todos?.filter((todo) => todo.completed).length}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-md shadow-md w-full sm:w-[30%]">
          <h3 className="text-lg font-semibold text-red-700">Pending</h3>
          <p className="text-2xl font-bold">
            {!userId
              ? 0
              : data?.todos?.filter((todo) => !todo.completed).length}
          </p>
        </div>
      </div>

      {/* Todo Preview List */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Latest Todos</h2>
        {!userId ? (
          <p className="text-gray-500 text-center w-full">
            Please log in to view your todos summary.
          </p>
        ) : isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : !isLoading && !data?.todos ? (
          <p className="text-gray-500">No todos found....!</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load todos</p>
        ) : (
          <ul className="space-y-1">
            {data?.todos?.slice(0, 5).map((todo, index) => (
              <li
                key={todo._id}
                className={`p-3 hover:bg-amber-200 rounded flex justify-between items-center transition ${(index+1) % 2 == 0 ? "bg-amber-100" : "bg-green-100" }`} 
              >
                <span>{todo.title}</span>
                <span>{todo.description}</span>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    todo.completed
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button to full todo list */}
      <div className="text-center mt-10">
        <Link
          to="/todo"
          className="inline-block px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
        >
          View All Todos
        </Link>
      </div>
    </div>
  );
};

export default Home;
