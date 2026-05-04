import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './global.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <AuthContextProvider>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '12px',
          fontFamily: 'inherit',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        error: {
          style: {
            background: '#fff1f1',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fff1f1',
          },
        },
        success: {
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#16a34a',
            secondary: '#f0fdf4',
          },
        },
      }}
    />
   </AuthContextProvider>
);


