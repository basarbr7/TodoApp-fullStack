import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useAddTodoMutation, useUpdateTodoMutation } from '../redux/rtkApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

const commonStyle = {
    "& .MuiInputBase-root": { padding: "4px 8px" },
    "& .MuiOutlinedInput-input": { padding: "6px 8px" },
    "& .MuiInputLabel-root": { top: "-5px" },
    }

const AddTodo = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        completed: ""
    })

    const navigate = useNavigate()

    const [addTodo, { isLoading: adding }] = useAddTodoMutation()
    const [updateTodo, { isLoading: updating}] = useUpdateTodoMutation()

    const location = useLocation()
    const editData = location.state

    // If editData exists, prefill the form
    useEffect(() => {
        if (editData) {
        setFormData({
            title: editData.title,
            description: editData.description,
            completed: editData.completed
        });
        }
        // console.log(editData);
        
    }, [editData]);

    const handleChange= (e)=>{
        const {name, value} = e.target
        setFormData((prev)=>({
            ...prev, 
            [name]: value
        }))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
           if (editData) {
                // Edit mode
                await updateTodo({ 
                    id: editData.id, 
                    title: formData.title,
                    description: formData.description,
                    completed: formData.completed
                }).unwrap();
                toast.success("Todo updated successfully!");
            } else {
                // Add mode
                await addTodo({ 
                title: formData.title,
                description: formData.description,
                completed: formData.completed
                }).unwrap();
                toast.success("Added your Todo successfully!");
            }
            setFormData({ title: "", description: "", completed: "" });

            navigate('/todo')

        } catch (error) {
            console.error("Failed to add Todo:", error )
        }
    }

    return (
    <div className='px-4 max-w-2xl mx-auto my-7'>
        <ToastContainer />
        <p className='text-2xl font-semibold mb-6'>{editData ? "Edit Todo" : "Add Todo"}</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5 max-w-sm '>
            <TextField
                label= 'Title'
                name='title'
                variant='outlined'
                type='text'
                fullWidth
                value={formData.title || ""}
                onChange={handleChange}
                required
                sx={commonStyle}
            />
            <TextField
                label= 'Description'
                name='description'
                variant='outlined'
                type='text'
                fullWidth
                value={formData.description || ""}
                onChange={handleChange}
                multiline
                rows={6}
                required
                sx={commonStyle}
            />
            <TextField
                label= 'Completed'
                name='completed'
                variant='outlined'
                select
                fullWidth
                value={formData.completed}
                onChange={handleChange}
                sx={commonStyle}
            >
                <MenuItem value={false}>False</MenuItem>
                <MenuItem value={true}>True</MenuItem>
            </TextField>

            <div>
                <Button type='submit' variant='contained' disabled={adding || updating}>
                    {adding || updating ? 'Saving...' : editData ? 'Update' : 'Save'}
                </Button>
            </div>
        </form>

    </div>
    )
}

export default AddTodo