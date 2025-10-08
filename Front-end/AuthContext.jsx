import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

const api = axios.create({
  baseURL: 'http://localhost:8080'
});


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

  // Configurar interceptor do axios para incluir token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Verificar se há um token válido ao carregar a aplicação
useEffect(() => {
  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token')

    if (savedToken) {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        })

        setToken(savedToken)
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      } catch (error) {
        console.error('Token inválido ou expirado:', error)
        logout()
      }
    }

    setLoading(false)
  }
  checkAuth()
}, [])


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
  console.log('Dados enviados para API:', userData);
  try {
    const response = await api.post('/api/auth/register', userData);
    const { token, user } = response.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao criar conta'
    };
  }
};


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
