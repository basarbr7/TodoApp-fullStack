import { configureStore } from '@reduxjs/toolkit';
import todoApi from './rtkApi';

const  store = configureStore({
    reducer: {
        // Add your reducers here
        [todoApi.reducerPath]: todoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(todoApi.middleware),
})

export default store;