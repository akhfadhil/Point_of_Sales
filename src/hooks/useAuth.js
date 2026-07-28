// src/hooks/useAuth.js
import { useState } from 'react';
import { db } from '../db';

/**
 * Custom Hook untuk mengelola state autentikasi, sesi login, & role pengguna
 * @param {Function} setActiveTab - Callback setter untuk mengubah tab aktif setelah login
 * @param {Function} setCart - Callback setter untuk mengosongkan keranjang setelah logout
 */
export default function useAuth(setActiveTab, setCart) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('oliviana_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [emailInput, setEmailInput] = useState('owner@oliviana.com');
  const [selectedRole, setSelectedRole] = useState('OWNER'); // 'OWNER' | 'CASHIER'
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    const user = db.login(emailInput, selectedRole);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('oliviana_current_user', JSON.stringify(user));
      if (setActiveTab) {
        if (user.role === 'OWNER') {
          setActiveTab('dashboard');
        } else if (user.role === 'WORKER') {
          setActiveTab('worker-daily-log');
        } else {
          setActiveTab('pos');
        }
      }
    } else {
      setLoginError('Email atau role tidak cocok. Silakan cek detail akun simulasi.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('oliviana_current_user');
    if (setCart) setCart([]);
  };

  return {
    currentUser,
    setCurrentUser,
    emailInput,
    setEmailInput,
    selectedRole,
    setSelectedRole,
    loginError,
    setLoginError,
    handleLogin,
    handleLogout
  };
}
