import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Files,
  Clock,
  AlertTriangle,
  CheckCircle,

  TrendingUp,
  Calendar,
  Loader2
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentFiles, setRecentFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Token de autenticação não encontrado.')
        }

        const response = await fetch('http://localhost:8080/api/dashboard/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Falha ao buscar dados do dashboard.')
        }

        const data = await response.json()
        
        console.log('Dados recebidos da API:', data) // Para debug
        
	        // Criando o objeto stats com os dados necessários
	        const formattedStats = {
	          totalFiles: data.totalFiles || 0,
	          validFiles: data.validFiles || 0,
	          expiringFiles: data.expiringFiles || 0,
	          expiredFiles: data.expiredFiles || 0,
	        }

        setStats(formattedStats)
        setRecentFiles(data.recentFiles || [])
        
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'text-green-500'
      case 'expiring':
        return 'text-yellow-500'
      case 'expired':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expiring':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Função para obter ícone do tipo de arquivo
  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      case 'image':
        return '🖼️'
      default:
        return '📄'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Carregando dados do dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Erro ao carregar o dashboard:</p>
        <p className="text-md text-center">{error}</p>
        <p className="text-sm mt-2">Por favor, tente novamente mais tarde ou verifique sua conexão.</p>
      </div>
    )
  }

  // Renderiza o dashboard somente se os dados estiverem disponíveis
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg">Nenhum dado disponível para o dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header de boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo, {user?.nome || 'Usuário'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está um resumo dos seus arquivos de mídia
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              Novo Upload
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              Todos os seus arquivos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivos Válidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.validFiles}</div>
            <p className="text-xs text-muted-foreground">
              Dentro do prazo de 180 dias
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirando</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.expiringFiles}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.expiredFiles}</div>
            <p className="text-xs text-muted-foreground">
              Não disponíveis para download
            </p>
          </CardContent>
        </Card>
      </div>



      {/* Arquivos recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Arquivos Recentes
              </CardTitle>
              <CardDescription>
                Seus uploads mais recentes
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/files">Ver todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFiles.length > 0 ? (
              recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 text-2xl">
                      {getFileTypeIcon(file.type)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span className="capitalize">{file.type}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Upload: {formatDate(file.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className={`text-xs font-medium ${getStatusColor(file.status)}`}>
                        {file.status === 'valid' && 'Válido'}
                        {file.status === 'expiring' && 'Expirando'}
                        {file.status === 'expired' && 'Expirado'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expira: {formatDate(file.expiryDate)}
                      </p>
                      {file.daysRemaining !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {file.daysRemaining > 0 ? `${file.daysRemaining} dias restantes` : 'Expirado'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Nenhum arquivo recente encontrado.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/upload">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Upload className="h-5 w-5 mr-2" />
                Fazer Upload
              </CardTitle>
              <CardDescription>
                Envie novos arquivos de áudio, vídeo ou imagem
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/files">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Files className="h-5 w-5 mr-2" />
                Gerenciar Arquivos
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os seus arquivos
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard