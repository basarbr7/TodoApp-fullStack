import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { useUpdateUserDataMutation, useUserByIdQuery } from "../redux/rtkApi";
import Modal from "../component/Modal";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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

  //  handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // instant preview
      handleUpload(file);
    }
  };

  //  send to backend
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      await updateUser({ id: userId, formData }).unwrap();
      toast.success("Image uploaded successfully");

      console.log(" Image uploaded successfully");
    } catch (err) {
      console.error(" Upload failed:", err);
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
    })
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
      // const updatedData = { ...formData }; 
      await updateUser({ id: userId, formData }).unwrap();
      setOpenModal(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      {isLoading && <p>Loading........</p>}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white px-14 py-10 rounded-md shadow-lg w-full max-w-xl"
        >
          {/* profile and name section */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative bg-gray-200 rounded-full ">
              {/* profile image */}
              <div className="h-40 w-40 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={
                    preview ||
                    (data?.image
                      ? `https://node-express-mongo-ce73.onrender.com/uploads/${data.image}`
                      : " ")
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black rounded-full pointer-events-none z-10"
              />

              {/* camera icon */}
              <label
                htmlFor="imageUpload"
                className="absolute bottom-1 right-1 z-20 bg-black/80 rounded-full p-2 flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              >
                <Camera className="text-white w-6 h-6" />
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="w-full text-center mt-12 space-y-2 relative">
              <button
                onClick={() => handleEdit(data)}
                className="absolute -top-12 md:-top-10 -right-5 md:right-0 z-30 flex items-center gap-2 bg-gray-900 text-white p-2 rounded-md text-sm md:text-lg"
              >
                <Pencil size={20} />
                Edit
              </button>

              <p className="text-3xl font-semibold capitalize">{data.name}</p>
              <p className="text-lg capitalize ">{data.title || "Click edit to set your title"}</p>
              <p style={{ textTransform: "capitalize" }}>{data.bio || "No bio yet! Write something cool"} </p>
            </div>
          </div>

          {/* user info */}
          <div className="mt-7 space-y-4">
            <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-2">
              <Mail size={20} className="text-blue-500" />
              {data.email}
            </div>

            <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-2">
              <Phone size={20} className="text-green-500" />
              {data.phone ? `+88 ${data.phone}` : "Add your phone number"}
            </div>

            <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-2">
              <MapPin size={22} className="text-red-500" />
              {data.address ? data.address : "Add your address"}
            </div>

            <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" />
              {data.dateOfBirth
                ? data.dateOfBirth.split("T")[0]
                : "Add your Birth Date"}
            </div>
          </div>
        </motion.div>
      )}

      {openModal && (
        <Modal onClose={() => setOpenModal(false)} className="max-w-2xl ">
          <h2 className="mb-4 text-xl font-bold">Edit profile</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"
          >
            {/* Name */}
            <div className=" flex flex-col">
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Your title"
                className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 01712345678"
                className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
                className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all"
              />
            </div>

            {/* Bio (Full width) */}
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-600">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Write something about yourself..."
                className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;
