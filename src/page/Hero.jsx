import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Sparkles, TrendingUp, Calendar, Target } from 'lucide-react';
import { useGetTodosByUserQuery } from '../redux/rtkApi';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  
  // RTK Query - শুধু data fetch করবে
  const { data, isLoading } = useGetTodosByUserQuery(userId, { skip: !userId });

  // Listen for auth changes
  useEffect(() => {
    const handler = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const todos = data?.todos || [];
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // শুধু প্রথম 3টা task দেখাবে preview হিসেবে
  const previewTodos = todos.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-white space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all cursor-pointer">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Simple & Powerful Todo App</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Organize Your Life
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text mt-2">
                  One Task at a Time
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Stay productive and achieve your goals with our intuitive task management system. Simple, fast, and effective.
              </p>

              {/* Features */}
              <div className="space-y-3">
                {[
                  { icon: Target, text: 'Track your daily progress' },
                  { icon: Calendar, text: 'Never miss a deadline' },
                  { icon: TrendingUp, text: 'Boost your productivity' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <feature.icon className="w-5 h-5 text-yellow-300" />
                    </div>
                    <span className="text-base md:text-lg">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  onClick={() => navigate(userId ? "/todo" : "/login")}
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/90 hover:scale-105 transition-all shadow-2xl"
                >
                  {userId ? 'Go to My Tasks' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 md:gap-8 pt-6">
                <div className="hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300">10K+</div>
                  <div className="text-white/70 text-sm">Active Users</div>
                </div>
                <div className="hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300">50K+</div>
                  <div className="text-white/70 text-sm">Tasks Completed</div>
                </div>
                <div className="hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300">4.9★</div>
                  <div className="text-white/70 text-sm">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Side - Todo Preview Card */}
            <div className="w-full">
              <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
                      {userId ? 'Your Tasks' : 'Tasks Preview'}
                      {total > 0 && <TrendingUp className="w-5 h-5 text-green-400 animate-bounce" />}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {userId ? 'Quick overview' : 'See how it works'}
                    </p>
                  </div>
                  {total > 0 && (
                    <div className="bg-yellow-400 text-purple-900 px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
                      {total} Total
                    </div>
                  )}
                </div>

                {/* Content Area */}
                {!userId ? (
                  // Not Logged In - Demo Preview
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4 animate-bounce">📝</div>
                      <p className="text-white/90 text-lg mb-6">
                        Manage all your tasks in one place
                      </p>
                    </div>

                    {/* Demo Tasks */}
                    <div className="space-y-3">
                      {[
                        { title: 'Morning workout', completed: true },
                        { title: 'Team meeting at 10 AM', completed: false },
                        { title: 'Finish project report', completed: false },
                      ].map((task, i) => (
                        <div
                          key={i}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3"
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            task.completed
                              ? 'bg-green-400 border-green-400'
                              : 'border-white/50'
                          }`}>
                            {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`flex-1 text-white ${
                            task.completed ? 'line-through opacity-60' : ''
                          }`}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Demo Progress */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-white/70 text-sm mb-2">
                        <span>Daily Progress</span>
                        <span className="font-bold">1/3</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-1/3" />
                      </div>
                    </div>

                    {/* Login CTA */}
                    <button 
                      onClick={() => navigate("/login")}
                      className="w-full mt-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      Login to Start Managing Tasks
                    </button>
                  </div>
                ) : isLoading ? (
                  // Loading State
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    <p className="text-white/70 mt-4">Loading your tasks...</p>
                  </div>
                ) : total === 0 ? (
                  // No Tasks Yet
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-white/90 text-lg mb-6">
                      You don't have any tasks yet
                    </p>
                    <button 
                      onClick={() => navigate("/todo/add")}
                      className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      Create Your First Task
                    </button>
                  </div>
                ) : (
                  // User's Tasks Preview
                  <div className="space-y-4">
                    {/* Preview Tasks (শুধু প্রথম 3টা) */}
                    <div className="space-y-3">
                      {previewTodos.map((todo) => (
                        <div
                          key={todo._id}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all cursor-pointer"
                          
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            todo.status === "Done"
                              ? 'bg-green-400 border-green-400'
                              : 'border-white/50'
                          }`}>
                            {todo.status==="Done" && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className={`flex-1 text-white text-sm md:text-base ${
                            todo.completed ? 'line-through opacity-60' : ''
                          }`}>
                            {todo.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Show More Button */}
                    {total > 3 && (
                      <button 
                        onClick={() => navigate("/todo")}
                        className="w-full bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-medium hover:bg-white/20 transition-all border border-white/30"
                      >
                        View {total - 3} More Task{total - 3 > 1 ? 's' : ''} →
                      </button>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-white/70 text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Overall Progress
                        </span>
                        <span className="font-bold">{completed}/{total}</span>
                      </div>
                      <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {progress === 100 && (
                        <p className="text-green-300 text-sm text-center mt-3 font-bold animate-bounce">
                          🎉 All tasks completed! Amazing!
                        </p>
                      )}
                    </div>

                    {/* Manage Tasks CTA */}
                    <button 
                      onClick={() => navigate("/todo")}
                      className="w-full mt-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-500 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      Manage All Tasks
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}