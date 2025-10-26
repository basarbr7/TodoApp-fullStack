import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Mail, MapPin, Pencil, Phone, User, Sparkles } from "lucide-react";
import { useUpdateUserDataMutation, useUserByIdQuery } from "../redux/rtkApi";
import Modal from "../component/Modal";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });

  const userId = localStorage.getItem("userId");
  const { data, isLoading } = useUserByIdQuery(userId);
  const [updateUser] = useUpdateUserDataMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);

    try {
      await updateUser({ id: userId, formData }).unwrap();
      toast.success("Image uploaded successfully");
      console.log("Image uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (data) => {
    setEditUserData(data);
    setFormData({
      name: data.name || "",
      title: data.title || "",
      bio: data.bio || "",
      phone: data.phone || "",
      address: data.address || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
    });
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id: userId, formData }).unwrap();
      setOpenModal(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    }
  };

  const infoItems = data ? [
    { icon: Mail, value: data.email, bgColor: "bg-blue-50", iconColor: "text-blue-600", borderColor: "border-blue-200" },
    { icon: Phone, value: data.phone ? `+88 ${data.phone}` : "Add your phone number", bgColor: "bg-green-50", iconColor: "text-green-600", borderColor: "border-green-200" },
    { icon: MapPin, value: data.address || "Add your address", bgColor: "bg-red-50", iconColor: "text-red-600", borderColor: "border-red-200" },
    { icon: Calendar, value: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "Add your Birth Date", bgColor: "bg-purple-50", iconColor: "text-purple-600", borderColor: "border-purple-200" },
  ] : [];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header Background */}
          <div className="relative h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div/>
            
            {/* Floating Elements */}
            <motion.div
              className="absolute top-8 right-12"
              animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="text-white/40 w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute bottom-12 left-16"
              animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              <Sparkles className="text-white/30 w-6 h-6" />
            </motion.div>
            <motion.div
              className="absolute top-16 left-1/4"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-white/10"></div>
            </motion.div>
          </div>

          <div className="w-full pb-10 px-6 md:px-14">
            {/* Profile Section */}
            <div className="flex flex-col items-center justify-center space-y-3 -mt-20">
              <motion.div  className="relative"
                whileHover={{ scale: 1.05 }}
                >
                {/* Animated Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500 via-purple-500 to-black/70 -m-1.5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Profile Image Container */}
                <div className="relative h-40 w-40 rounded-full overflow-hidden bg-white p-1.5">
                  <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    {preview || data?.image ? (
                      <img
                        src={
                          preview ||
                          `https://node-express-mongo-ce73.onrender.com/uploads/${data.image}`
                        }
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>

                  {/* Upload Loading Overlay */}
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full"
                    >
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                  )}

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/40 rounded-full pointer-events-none z-10 flex items-center justify-center"
                  >
                    <Camera className="text-white w-10 h-10 z-40" />
                  </motion.div>

                  {/* Camera Button */}
                  
                </div>
                <label
                    htmlFor="imageUpload"
                    className="absolute bottom-1 right-1 z-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-3 flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer shadow-lg hover:shadow-xl "
                  >
                    <Camera className="text-white w-5 h-5 z-40 " />
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
              </motion.div>

              {/* Name and Bio Section */}
              <div className="w-full text-center mt-6 space-y-2 relative">
                <motion.button
                  onClick={() => handleEdit(data)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-8 md:-top-6 -right-2 md:right-0 z-30 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Pencil size={18} />
                  Edit
                </motion.button>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent capitalize"
                >
                  {data.name}
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-gray-600 font-medium capitalize"
                >
                  {data.title || "Click edit to set your title"}
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 capitalize pt-1"
                >
                  {data.bio || "No bio yet! Write something cool"}
                </motion.p>
              </div>
            </div>

            {/* User Info Cards */}
            <div className="mt-8  grid grid-cols-12 gap-5 ">
              {infoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className={`${item.bgColor} border-l-4 ${item.borderColor} p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group col-span-12 sm:col-span-6 `}
                  >
                    <motion.div
                      transition={{ duration: 0.5 }}
                      className={`${item.iconColor} bg-white p-2.5 rounded-lg shadow-sm group-hover:shadow-md transition-all`}
                    >
                      <Icon size={22} />
                    </motion.div>
                    <span className="text-gray-700 font-medium ">
                      {item.value}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {openModal && (
        <Modal onClose={() => setOpenModal(false)} className="max-w-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 -m-6 mb-6 p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Pencil className="w-6 h-6" />
              Edit Profile
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Your title"
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 01712345678"
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
              />
            </div>

            {/* Bio */}
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Write something about yourself..."
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
              <motion.button
                type="button"
                onClick={() => setOpenModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;