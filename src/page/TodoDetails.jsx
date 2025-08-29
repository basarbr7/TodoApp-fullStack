import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useGetSingleTodoQuery } from '../redux/rtkApi'

const TodoDetails = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useGetSingleTodoQuery(id)

  return (
    <div className="max-w-2xl mx-auto px-4 mt-12">
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-600">
          <Loader className="animate-spin w-8 h-8 mb-3" />
          <p className="text-lg font-medium">Fetching your todo...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg shadow-sm"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Failed to load todo. Try again!</span>
        </motion.div>
      )}

      {/* Todo Data */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-lg p-6 space-y-5"
        >
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📝 Todo Details
          </h2>

          <div className="space-y-3 text-gray-700">
            <p className="capitalize">
              <span className="font-semibold text-gray-900">Title:</span> {data.todo.title}
            </p>
            <p className="capitalize">
              <span className="font-semibold text-gray-900">Description:</span> {data.todo.description || "No description provided"}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Status:</span>
              {data.todo.completed ? (
                <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Pending
                </span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-10"
      >
        <Link
          to="/todo"
          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-2.5 rounded-full hover:bg-yellow-700 hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </Link>
      </motion.div>
    </div>
  )
}

export default TodoDetails
