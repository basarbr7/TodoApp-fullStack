import React, { useEffect } from "react";
import { useDeleteTodoMutation, useGetTodosByUserQuery } from "../redux/rtkApi";
import { Link } from "react-router-dom";
import { Loader, Trash2 } from "lucide-react";

const TodoList = () => {
  const userId = localStorage.getItem("userId");
  const { data, isLoading, isError } = useGetTodosByUserQuery(userId, {
    refetchOnMountOrArgChange: false,
  });
  const [deleteTodo] = useDeleteTodoMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(id).unwrap();
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  return (
    <div className="my-10 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📋 Your Todo List
      </h1>

      {!userId ? (
        <p className="text-red-500 font-semibold text-center">
          Please Loging First to view your todo !
        </p>
      ) : isLoading ? (
        <div className="text-gray-600 flex gap-3 items-center justify-center">
          <Loader className="animate-spin text-gray-600 w-6 h-6" />
          Loading todos...
        </div>
      ) : !isLoading && !data?.todos ? (
        <p className="text-gray-500 ">No todos found. Start adding some!</p>
      ) : isError ? (
        <p className="text-red-500 ">Failed to load todos</p>
      ) : (
        <div className="space-y-4">
          {data?.todos?.map(
            ({ _id, title, description, status, dueDate, category }, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-5 rounded-md shadow hover:shadow-md transition space-y-3 flex gap-2 "
              >
                <div>{index + 1}.</div>

                <div className="w-full">
                  {/* Left Side */}
                  <div className="flex gap-2">
                    <div className={`px-2 text-gray-900 space-y-1`}>
                      <div className="font-medium text-base capitalize flex items-center gap-3">
                        {title}
                        <span
                          className={`flex sm:hidden text-[12px] font-normal px-2 py-1 rounded ${
                            status === "Done"
                              ? "bg-green-100 text-green-700"
                              : status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {status === "Done"
                            ? "✅ Completed"
                            : status === "In Progress"
                            ? "🕒 In Progress"
                            : "⌛ Pending"}
                        </span>
                      </div>
                      <p className="font-medium text-sm pr-3 text-gray-500 text-justify capitalize">
                        {description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-2">
                        {dueDate && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            📅 Due: {new Date(dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {category && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            🏷️ {category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side (Status + Buttons) */}
                  <div className="flex items-center justify-between mt-6">
                    <span
                      className={`hidden sm:flex text-[12px] font-normal px-2 py-1 rounded ${
                        status === "Done"
                          ? "bg-green-100 text-green-700"
                          : status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status === "Done"
                        ? "✅ Completed"
                        : status === "In Progress"
                        ? "🕒 In Progress"
                        : "⌛ Pending"}
                    </span>

                    <div className="flex flex-wrap gap-3 ">
                      {/* Edit */}
                      <Link
                        to={`add`}
                        state={{
                          id: _id,
                          title,
                          description,
                          status,
                          dueDate,
                          category,
                        }}
                        className="flex items-center gap-1 text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 sm:px-3 sm:py-2 text-[12px] sm:text-sm rounded-md transition"
                      >
                        Edit
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(_id)}
                        className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-2 py-1 sm:px-3 sm:py-2 rounded-md transition text-[12px] sm:text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
