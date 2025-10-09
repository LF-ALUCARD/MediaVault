import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

useEffect(() => {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (savedToken && savedUser) {
    try {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      logout();
    }
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  setLoading(false);
}, []);

  const login = async (email, password) => {
    try {
      // Simulação de API - substitua pela URL real da sua API
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data
      
      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      
      const { token, user } = response.data
      
      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { success: true }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao criar conta'
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
