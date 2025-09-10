import React, { useEffect, useId, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useAddTodoMutation, useUpdateTodoMutation } from "../redux/rtkApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const commonStyle = {
  "& .MuiInputBase-root": { padding: "4px 8px" },
  "& .MuiOutlinedInput-input": { padding: "6px 8px" },
  "& .MuiInputLabel-root": { top: "-5px" },
};

const AddTodo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    category: "",
  });
  const userId = localStorage.getItem("userId");

  // const navigate = useNavigate();

  const [addTodo, { isLoading: adding }] = useAddTodoMutation();
  const [updateTodo, { isLoading: updating }] = useUpdateTodoMutation();

  const location = useLocation();
  const editData = location.state;

  // If editData exists, prefill the form
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData
      });
    }
    // console.log(editData);
  }, [editData]);

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
      if (editData) {
        // Edit mode
        await updateTodo({
          id: editData.id,
          ...formData,
        }).unwrap();
        toast.success("Todo updated successfully!");
      } else {
        // Add mode
        await addTodo({
          ...formData,
        }).unwrap();
        toast.success("Added your Todo successfully!");
      }
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
        category: "",
      });

      // navigate("/todo");
    } catch (error) {
      console.error("Failed to add Todo:", error);
    }
  };

  return (
    <div className="px-4 max-w-2xl mx-auto my-7">
      <ToastContainer />
      <p className="text-2xl font-semibold mb-6">
        {editData ? "Edit Todo" : "Add Todo"}
      </p>

      {!userId ? (
        <p className="text-red-500 font-semibold text-center">
          please loging frist to add your todo !
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-7 max-w-sm ">
          <TextField
            label="Title"
            name="title"
            variant="outlined"
            type="text"
            fullWidth
            value={formData.title || ""}
            onChange={handleChange}
            required
            sx={commonStyle}
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            type="text"
            fullWidth
            value={formData.description || ""}
            onChange={handleChange}
            multiline
            rows={4}
            required
            sx={commonStyle}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.dueDate}
            onChange={handleChange}
            sx={commonStyle}
          />

          <TextField
            label="Status"
            name="status"
            select
            fullWidth
            value={formData.status}
            onChange={handleChange}
            sx={commonStyle}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>

          <TextField
            label="Category"
            name="category"
            type="text"
            fullWidth
            value={formData.category}
            onChange={handleChange}
            sx={commonStyle}
          />

          <div>
            <Button
              type="submit"
              variant="contained"
              disabled={adding || updating}
            >
              {adding || updating ? "Saving..." : editData ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTodo;
