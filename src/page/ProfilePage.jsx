import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Camera, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { useUpdateUserMutation, useUserByIdQuery } from "../redux/rtkApi";

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const userId = localStorage.getItem("userId");
  const { data, isLoading } = useUserByIdQuery(userId);
  const [updateUser] = useUpdateUserMutation();

  // 🔹 handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // instant preview
      handleUpload(file);
    }
  };

  // 🔹 send to backend
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      await updateUser({ id: userId, formData }).unwrap();
      console.log("✅ Image uploaded successfully");
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
                    `https://node-express-mongo-ce73.onrender.com/uploads/${data?.image}`
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
              <button className="absolute -top-12 md:-top-10 -right-5 md:right-0 z-30 flex items-center gap-2 bg-gray-900 text-white p-2 rounded-md text-sm md:text-lg">
                <Pencil size={20} />
                Edit
              </button>

              <p className="text-3xl font-semibold">{data.name}</p>
              <p className="text-lg">{data.title || "Your title"}</p>
              <p>{data.bio} </p>
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
              +88{data.phone}
            </div>

            <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-2">
              <MapPin size={22} className="text-red-500" />
              {data.address}
            </div>

            <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" />
              {data.dateOfBirth ? data.dateOfBirth.split("T")[0] : ""}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
