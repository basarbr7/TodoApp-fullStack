import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://node-express-mongo-ce73.onrender.com',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token"); 
      // console.log("TOKEN IN HEADER:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
        // headers.set('Content-Type', 'application/json');
        // headers.set('Accept', 'application/json');
        // headers.set('Content-Type', 'multipart/form-data')
      };
      return headers;
    }
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: '/auth/login',
        method: 'POST',
        body: userData,
      }),
    }),
    userById: builder.query({
      query: (id)=>({
        url: `/api/users/${id}`,
        method: 'GET'
      }),
       providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUserData: builder.mutation({
      query: ({id, formData})=>({
        url: `/api/users/${id}`,
        method: 'PATCH',
        body: formData
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    getTodosByUser: builder.query({
      query: (userId)=> ({
        url: `/api/todos/user/${userId}`,
        method: 'GET'
      }),
      providesTags: ['Todos'],
    }),
    addTodo: builder.mutation({
      query: (todoData)=> ({
        url: '/api/todos',
        method: 'POST',
        body: (todoData)
      }),
      invalidatesTags: ['Todos'],
    }),
    getSingleTodo: builder.query({
      query: (id)=>({
        url: `/api/todos/${id}`,
        method: 'GET'
      })
    }),
    updateTodo: builder.mutation({
      query: ({id, ...data})=>({
        url: `/api/todos/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/api/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
  })
});

export const { useRegisterUserMutation, useLoginUserMutation, useUpdateUserDataMutation, useUserByIdQuery, useAddTodoMutation, useGetTodosByUserQuery, useGetSingleTodoQuery, useUpdateTodoMutation, useDeleteTodoMutation } = todoApi;
export default todoApi;
