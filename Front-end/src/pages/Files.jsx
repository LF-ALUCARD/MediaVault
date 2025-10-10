import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  Download,
  Trash2,
  MoreVertical,
  Video,
  Music,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileX
} from 'lucide-react'

const Files = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (!localStorage.getItem('token')) {
          setError('Token de autenticação não encontrado. Por favor, faça login.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/api/files', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        } );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const processedData = data.map((file, index) => {
          const expiryDate = new Date(file.expiryDate);
          const today = new Date();
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let status = 'valid';
          if (diffDays <= 0) {
            status = 'expired';
          } else if (diffDays <= 30) {
            status = 'expiring';
          }

          return { 
            ...file, 
            daysRemaining: diffDays, 
            status 
          };
        });
        setFiles(processedData);
      } catch (e) {
        setError('Falha ao carregar arquivos: ' + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || file.type === filterType
    const matchesStatus = filterStatus === 'all' || file.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size)
      case 'expiry':
        return new Date(a.expiryDate) - new Date(b.expiryDate)
      default: // date
        return new Date(b.uploadDate) - new Date(a.uploadDate)
    }
  })

  const getStatusBadge = (status, daysRemaining) => {
    switch (status) {
      case 'valid':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Válido
          </Badge>
        )
      case 'expiring':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Expirando
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        )
      default:
        return null
    }
  }

  const getFileIcon = (type) => {
    return type === 'video' ? (
      <Video className="h-5 w-5 text-blue-500" />
    ) : (
      <Music className="h-5 w-5 text-green-500" />
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleDownload = async (file) => {
    if (file.status === 'expired') {
      alert('Este arquivo expirou e não pode mais ser baixado.')
      return
    }
    
    if (!file.id) {
      alert("Erro: ID do arquivo não encontrado.");
      return;
    }
    
    try {
      if (!localStorage.getItem("token")) {
        alert("Token de autenticação não encontrado. Por favor, faça login.");
        return;
      }

      // Fazer a requisição para o endpoint de download
      const response = await fetch(`http://localhost:8080/api/files/${file.id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro no download: ${response.status} ${response.statusText}`);
      }

      // Debug: verificar headers da resposta
      console.log('Headers da resposta:');
      response.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // Obter o blob do arquivo
      const blob = await response.blob();
      console.log('Tipo do blob:', blob.type);
      console.log('Tamanho do blob:', blob.size);
      
      // Verificar se é um arquivo ZIP baseado no Content-Type ou nome do arquivo
      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      
      console.log('Content-Type:', contentType);
      console.log('Content-Disposition:', contentDisposition);
      
      // Determinar o nome do arquivo para download
      let downloadName = file.name;
      
      // Se o Content-Type indica ZIP, ajustar a extensão
      if (contentType && contentType.includes('application/zip')) {
        if (!downloadName.endsWith('.zip')) {
          downloadName = downloadName.replace(/\.[^/.]+$/, '') + '.zip';
        }
      }
      
      // Se há Content-Disposition, extrair o nome do arquivo
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          downloadName = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      console.log('Nome do arquivo para download:', downloadName);
      
      // Criar URL temporária para o blob
      const url = window.URL.createObjectURL(blob);
      
      // Criar elemento de link temporário para iniciar o download
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      
      // Limpar recursos
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao fazer download do arquivo:', error);
      alert(`Erro ao fazer download: ${error.message}`);
    }
  }


const handleDelete = async (fileId) => {
  if (confirm('Tem certeza que deseja excluir este arquivo?')) {
    try {
      await fetch(`http://localhost:8080/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert('Arquivo excluído com sucesso!');
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      alert('Erro ao excluir o arquivo. Tente novamente.');
    }
  }
};


  const getStatusCounts = () => {
    const valid = files.filter(f => f.status === 'valid').length
    const expiring = files.filter(f => f.status === 'expiring').length
    const expired = files.filter(f => f.status === 'expired').length
    
    return { valid, expiring, expired }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium">Carregando arquivos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meus Arquivos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todos os seus arquivos de áudio e vídeo
        </p>
      </div>

      {/* Resumo de status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Válidos</p>
                <p className="text-2xl font-bold text-green-500">{statusCounts.valid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Expirando</p>
                <p className="text-2xl font-bold text-yellow-500">{statusCounts.expiring}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold text-red-500">{statusCounts.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="valid">Válidos</SelectItem>
                <SelectItem value="expiring">Expirando</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="size">Tamanho</SelectItem>
                <SelectItem value="expiry">Expiração</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de arquivos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Arquivos ({sortedFiles.length})
          </CardTitle>
          <CardDescription>
            {sortedFiles.length === 0 ? 'Nenhum arquivo encontrado' : 'Clique em um arquivo para mais opções'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {files.length === 0 ? 'Você ainda não tem arquivos' : 'Nenhum arquivo corresponde aos filtros'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        {getStatusBadge(file.status, file.daysRemaining)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="capitalize">{file.type}</span>
                        <span>{file.size}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(file.uploadDate)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Expira: {formatDate(file.expiryDate)}
                        </span>
                      </div>
                      
                      {file.status === 'expiring' && (
                        <Alert className="mt-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                            Este arquivo expira em {file.daysRemaining} dias
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {file.status === 'expired' && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Este arquivo expirou há {Math.abs(file.daysRemaining)} dias e não pode mais ser baixado
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file)}
                      disabled={file.status === 'expired'}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownload(file)}
                          disabled={file.status === 'expired'}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Files