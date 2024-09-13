import React from 'react'
import AppRoutes from './utils/AppRoutes'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './auth/AuthContext';

function App() {
    let router = createBrowserRouter(AppRoutes);
    return (
        <AuthProvider>
            <AnimatePresence mode="wait">
                <RouterProvider router={router} />
            </AnimatePresence>
        </AuthProvider>
    );
}

export default App
