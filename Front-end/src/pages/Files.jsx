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
  const [selectedFiles, setSelectedFiles] = useState([]) // Novo estado para arquivos selecionados

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
  if (!file.id) {
    alert("Erro: ID do arquivo não encontrado.");
    return;
  }

  try {
    if (!localStorage.getItem("token")) {
      alert("Token de autenticação não encontrado. Por favor, faça login.");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/files/${file.id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData?.error === 'FORBIDDEN') {
        alert(errorData.message);
        return;
      }
      throw new Error(`Erro no download: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type');
    const contentDisposition = response.headers.get('content-disposition');

    let downloadName = file.name;

    if (contentType && contentType.includes('application/zip')) {
      if (!downloadName.endsWith('.zip')) {
        downloadName = downloadName.replace(/\.[^/.]+$/, '') + '.zip';
      }
    }

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        downloadName = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Erro ao fazer download do arquivo:', error);
    alert(`Erro ao fazer download: ${error.message}`);
  }
}


  // Nova função para download de múltiplos arquivos
  const handleMultipleDownload = async () => {
  if (selectedFiles.length === 0) {
    alert('Nenhum arquivo selecionado para download.');
    return;
  }

  if (!localStorage.getItem('token')) {
    alert('Token de autenticação não encontrado. Por favor, faça login.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/files/download-multiple', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileIds: selectedFiles }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData?.error === 'FORBIDDEN') {
        alert(errorData.message);
        return;
      }
      throw new Error(`Erro no download de múltiplos arquivos: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    let downloadName = 'arquivos_selecionados.zip';

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        downloadName = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setSelectedFiles([]);

  } catch (error) {
    console.error('Erro ao fazer download de múltiplos arquivos:', error);
    alert(`Erro ao fazer download de múltiplos arquivos: ${error.message}`);
  }
};


  const handleCheckboxChange = (fileId) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileId)
        ? prevSelectedFiles.filter((id) => id !== fileId)
        : [...prevSelectedFiles, fileId]
    );
  };

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

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivos..."
            className="pl-9 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="video">Vídeos</SelectItem>
            <SelectItem value="audio">Áudios</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="valid">Válidos</SelectItem>
            <SelectItem value="expiring">Expirando</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <MoreVertical className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Data de Upload</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="size">Tamanho</SelectItem>
            <SelectItem value="expiry">Data de Expiração</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botão de Download Múltiplo */}
      {selectedFiles.length > 0 && (
        <Button onClick={handleMultipleDownload} className="w-full md:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Download Selecionados ({selectedFiles.length})
        </Button>
      )}

      {/* Lista de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle>Arquivos Recentes</CardTitle>
          <CardDescription>Seus arquivos de áudio e vídeo mais recentes.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedFiles.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum arquivo encontrado.</p>
          ) : (
            <div className="grid gap-4">
              {sortedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center space-x-3">
                    {/* Checkbox para seleção */}
                      <button
                        onClick={() => handleCheckboxChange(file.id)}
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedFiles.includes(file.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                        }`}
                      >
                        {selectedFiles.includes(file.id) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </button>
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.size} MB | Upload em {formatDate(file.uploadDate)} | Expira em {formatDate(file.expiryDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(file.status, file.daysRemaining)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownload(file)}
                          className="text-blue-600"
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