import React, { useState } from 'react'
import todoApi, { useLoginUserMutation } from '../redux/rtkApi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginUser, { error, isSuccess }] = useLoginUserMutation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await loginUser(formData).unwrap()
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('userId', res.user.id)
        // console.log('Login success:', res)
        alert('Login successful')
        window.dispatchEvent(new Event("authChanged"));
        dispatch(todoApi.util.resetApiState());
        // Optional: redirect to dashboard
        navigate('/')
      }
    } catch (err) {
      console.error('Login failed:', err)
      alert('Login failed')
    } finally {
      setFormData({ email: '', password: '' })
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
      
      <div className='bg-white p-5 mb-10 rounded-sm'>
        <p>Email: demo@gmail.com</p>
        <p>Password: 123456</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error?.data?.message || 'Login failed'}
          </div>
        )}

        {
          isSuccess && (
            <div className="text-green-500 text-sm text-center">
              Login successful!
            </div>
          )
        }

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="text"
            name='email'
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className='relative '>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
             type={showPassword ? "text" : "password" }
            name='password'
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button type='button' onClick={()=>setShowPassword(!showPassword)} className='absolute top-10 right-3 '>
            { showPassword ? <Eye size={20} /> : <EyeOff size={20} /> }
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}

export default Login
