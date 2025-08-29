import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/rtkApi';
import { Eye, EyeOff } from 'lucide-react';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword]= useState(false)
  const [showConfirmPassword, setShowConfirmPassword]= useState(false)
  const navigate = useNavigate()

  const [registerUser, { isLoading, isError, error, isSuccess }] = useRegisterUserMutation();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await registerUser(formData).unwrap();
      console.log('Register Success:', response);
      alert('User Registered Successfully!');
      // Clear form (optional)
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/login')
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 pb-10"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

        {/* Handle errors from API */}
        {isError && (
          <p className="text-red-500 text-center text-sm">
            {error?.data?.message || "Registration failed. Please try again."}
          </p>
        )}

        {/* Show success message */}
        {isSuccess && (
          <p className="text-green-500 text-center text-sm">
            Registration successful!
          </p>
        )}

        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div  className='relative'>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type='button' onClick={()=>setShowPassword(!showPassword)} className='absolute top-10 right-3 '>
            { showPassword ? <Eye size={20} /> : <EyeOff size={20} /> }
          </button>

        </div>

        <div className='relative'>
          <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password" }
            name="confirmPassword"
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type='button' onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className='absolute top-10 right-3 '>
            { showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} /> }
          </button>
          
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-2 rounded-lg font-semibold transition-all ${
            isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
