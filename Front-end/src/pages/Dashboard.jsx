import React from 'react'
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
  HardDrive,
  TrendingUp,
  Calendar
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()

  // Dados simulados - em produção viriam da API
  const stats = {
    totalFiles: 24,
    validFiles: 18,
    expiringFiles: 4,
    expiredFiles: 2,
    totalStorage: '2.4 GB',
    usedStorage: '1.8 GB',
    storagePercentage: 75
  }

  const recentFiles = [
    {
      id: 1,
      name: 'apresentacao_projeto.mp4',
      type: 'video',
      size: '45.2 MB',
      uploadDate: '2024-10-01',
      expiryDate: '2025-03-30',
      status: 'valid'
    },
    {
      id: 2,
      name: 'reuniao_equipe.mp3',
      type: 'audio',
      size: '12.8 MB',
      uploadDate: '2024-09-28',
      expiryDate: '2025-03-27',
      status: 'valid'
    },
    {
      id: 3,
      name: 'entrevista_cliente.wav',
      type: 'audio',
      size: '89.1 MB',
      uploadDate: '2024-09-15',
      expiryDate: '2025-03-14',
      status: 'expiring'
    },
    {
      id: 4,
      name: 'demo_produto.mp4',
      type: 'video',
      size: '156.7 MB',
      uploadDate: '2024-04-10',
      expiryDate: '2024-10-07',
      status: 'expired'
    }
  ]

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
    return new Date(dateString).toLocaleDateString('pt-BR')
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
              +2 desde o último mês
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

      {/* Uso de armazenamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="h-5 w-5 mr-2" />
            Uso de Armazenamento
          </CardTitle>
          <CardDescription>
            Acompanhe o uso do seu espaço de armazenamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Usado: {stats.usedStorage}</span>
              <span>Total: {stats.totalStorage}</span>
            </div>
            <Progress value={stats.storagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.storagePercentage}% do espaço utilizado
            </p>
          </div>
        </CardContent>
      </Card>

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
            {recentFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
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
                  </div>
                </div>
              </div>
            ))}
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
                Envie novos arquivos de áudio ou vídeo
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
