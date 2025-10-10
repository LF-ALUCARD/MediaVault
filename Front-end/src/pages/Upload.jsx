import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload as UploadIcon,
  File,
  Video,
  Music,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import axios from 'axios'

const Upload = () => {
  console.log('🔥 COMPONENTE UPLOAD CARREGADO!')
  
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('📁 Arquivos selecionados:', acceptedFiles.length)
    
    // Processar arquivos aceitos
    const newFiles = acceptedFiles.map(file => {
      // Determinar o tipo do arquivo baseado no MIME type
      let tipo = 'audio'; // padrão
      if (file.type.startsWith('video/')) {
        tipo = 'video';
      } else if (file.type.startsWith('image/')) {
        tipo = 'image';
      } else if (file.type.startsWith('audio/')) {
        tipo = 'audio';
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: tipo,
        status: 'ready',
        progress: 0,
        error: null
      };
    });

    console.log('📋 Novos arquivos processados:', newFiles)
    setFiles((prev) => [...prev, ...newFiles])

    // Processar arquivos rejeitados
    if (rejectedFiles.length > 0) {
      console.log('❌ Arquivos rejeitados:', rejectedFiles)
      rejectedFiles.forEach(rejection => {
        console.log('Arquivo rejeitado:', rejection.file.name, 'Motivos:', rejection.errors)
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.aac', '.ogg', '.m4a', '.flac', '.opus'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: true
  })

  const removeFile = (fileId) => {
    console.log('🗑️ Removendo arquivo:', fileId)
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-8 w-8 text-blue-500" />
      case 'image':
        return <Image className="h-8 w-8 text-purple-500" />
      case 'audio':
      default:
        return <Music className="h-8 w-8 text-green-500" />
    }
  }

  // FUNÇÃO DE UPLOAD REAL PARA SUA API SPRING BOOT
  const uploadFiles = async () => {
    console.log('🚀 INICIANDO UPLOAD REAL!')
    console.log('📊 Total de arquivos:', files.length)
    
    if (files.length === 0) {
      console.log('⚠️ Nenhum arquivo para upload')
      return
    }

    setUploading(true)
    console.log('🔄 Estado uploading = true')

    // Marcar todos os arquivos como uploading
    setFiles((prev) =>
      prev.map((file) => ({ ...file, status: 'uploading', progress: 0 }))
    )

    try {
      // Upload de cada arquivo individualmente
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`\n📤 PROCESSANDO ARQUIVO ${i + 1}/${files.length}:`, file.name)
        
        try {
          // Criar FormData
          const formData = new FormData()
          formData.append('file', file.file)
          formData.append('nome', file.name)
          formData.append('tipo', file.type)
          formData.append('tamanho', file.size.toString())
          formData.append('tamanhoFormatado', formatFileSize(file.size))

          console.log('📋 FormData criado:')
          console.log('  - file:', file.file)
          console.log('  - nome:', file.name)
          console.log('  - tipo:', file.type)
          console.log('  - tamanho:', file.size.toString())
          console.log('  - tamanhoFormatado:', formatFileSize(file.size))

          console.log('🌐 Fazendo requisição para: http://localhost:8080/api/files/upload')

          // Fazer a requisição para sua API Spring Boot
          const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              // Se precisar de autenticação, descomente:
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              console.log(`📈 Progresso ${file.name}: ${progress}%`)
              
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id ? { ...f, progress } : f
                )
              )
            },
            timeout: 300000, // 5 minutos
          })

          console.log('✅ UPLOAD BEM-SUCEDIDO!')
          console.log('📥 Resposta da API:', response.data)

          // Marcar como concluído
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
            )
          )

        } catch (fileError) {
          console.error(`❌ ERRO NO UPLOAD DO ARQUIVO ${file.name}:`, fileError)
          
          let errorMessage = 'Erro no upload'
          
          if (fileError.response) {
            console.error('📄 Resposta de erro da API:', fileError.response.data)
            console.error('🔢 Status do erro:', fileError.response.status)
            errorMessage = fileError.response.data?.message || `Erro ${fileError.response.status}`
          } else if (fileError.request) {
            console.error('🌐 Erro de rede - sem resposta do servidor')
            errorMessage = 'Erro de conexão com o servidor'
          } else {
            console.error('⚠️ Erro desconhecido:', fileError.message)
            errorMessage = fileError.message || 'Erro desconhecido'
          }

          // Marcar como erro
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: 'error', error: errorMessage } : f
            )
          )
        }
      }

      console.log('🎉 PROCESSO DE UPLOAD FINALIZADO!')

      // Limpar arquivos concluídos após 3 segundos
      setTimeout(() => {
        console.log('🧹 Limpando arquivos concluídos...')
        setFiles(prev => prev.filter(f => f.status !== 'completed'))
      }, 3000)

    } catch (generalError) {
      console.error('🚨 ERRO GERAL NO PROCESSO DE UPLOAD:', generalError)
    } finally {
      setUploading(false)
      console.log('✅ Estado uploading = false')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Função para retry de arquivos com erro
  const retryFile = async (fileId) => {
    console.log('🔄 Tentando novamente arquivo:', fileId)
    
    const fileToRetry = files.find(f => f.id === fileId)
    if (!fileToRetry) {
      console.error('❌ Arquivo não encontrado para retry:', fileId)
      return
    }

    setFiles(prev => 
      prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading', progress: 0, error: null } : f
      )
    )

    try {
      const formData = new FormData()
      formData.append('file', fileToRetry.file)
      formData.append('nome', fileToRetry.name)
      formData.append('tipo', fileToRetry.type)
      formData.append('tamanho', fileToRetry.size.toString())
      formData.append('tamanhoFormatado', formatFileSize(fileToRetry.size))

      console.log('🔄 Reenviando arquivo:', fileToRetry.name)

      const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress } : f
            )
          )
        },
        timeout: 300000,
      })

      console.log('✅ Retry bem-sucedido:', response.data)

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
        )
      )

    } catch (error) {
      console.error('❌ Erro no retry:', error)
      
      let errorMessage = 'Erro no upload'
      if (error.response) {
        errorMessage = error.response.data?.message || `Erro ${error.response.status}`
      } else if (error.request) {
        errorMessage = 'Erro de conexão com o servidor'
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'error', error: errorMessage } : f
        )
      )
    }
  }

  console.log('🎨 Renderizando componente - files:', files.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload de Arquivos</h1>
        <p className="text-muted-foreground mt-1">
          Envie seus arquivos de áudio, vídeo e imagens para armazenamento seguro
        </p>
      </div>

      {/* Área de upload */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Arquivos</CardTitle>
          <CardDescription>
            Arraste e solte seus arquivos aqui ou clique para selecionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <UploadIcon className="h-12 w-12 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg text-primary">Solte os arquivos aqui...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg text-foreground">
                    Arraste e solte seus arquivos aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para selecionar arquivos
                  </p>
                </div>
              )}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Formatos suportados: MP4, AVI, MOV, MP3, WAV, AAC, OPUS, JPG, PNG, GIF, WEBP</p>
                <p>Tamanho máximo: 500MB por arquivo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Arquivos Selecionados</CardTitle>
                <CardDescription>
                  {files.length} arquivo(s) pronto(s) para upload
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  console.log('🔘 BOTÃO ENVIAR TODOS CLICADO!')
                  uploadFiles()
                }}
                disabled={uploading || files.every(f => f.status === 'completed')}
                className="min-w-[120px]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Enviar Todos
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        {file.status === 'ready' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            disabled={uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {file.status === 'error' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryFile(file.id)}
                            disabled={uploading}
                          >
                            Tentar Novamente
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{file.type}</span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={file.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {file.progress}% enviado
                        </p>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-700 dark:text-green-400">
                          Arquivo enviado com sucesso! Válido até {new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {file.status === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {file.error || 'Erro no upload do arquivo'}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações importantes */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Todos os arquivos têm validade de <strong>180 dias</strong> a partir da data de upload
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Arquivos são armazenados de forma segura e criptografada
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Suporte para múltiplos formatos: áudio, vídeo e imagens
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Tamanho máximo por arquivo: 500MB
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Upload