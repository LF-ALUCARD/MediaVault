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
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

const Upload = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Processar arquivos aceitos
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type.startsWith('video/') ? 'video' : 'audio',
      status: 'ready', // ready, uploading, completed, error
      progress: 0,
      error: null
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Processar arquivos rejeitados
    if (rejectedFiles.length > 0) {
      console.log('Arquivos rejeitados:', rejectedFiles)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.aac', '.ogg', '.m4a', '.flac']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: true
  })

  const removeFile = (fileId) => {
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
    return type === 'video' ? (
      <Video className="h-8 w-8 text-blue-500" />
    ) : (
      <Music className="h-8 w-8 text-green-500" />
    )
  }

  const simulateUpload = async (file) => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, progress: Math.round(progress) }
              : f
          )
        )
      }, 200)
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)

    // Marcar todos os arquivos como uploading
    setFiles((prev) =>
      prev.map((file) => ({ ...file, status: 'uploading', progress: 0 }))
    )

    try {
      // Simular upload de cada arquivo
      for (const file of files) {
        await simulateUpload(file)
        
        // Marcar como concluído
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        )
      }

      // Limpar arquivos após 2 segundos
      setTimeout(() => {
        setFiles([])
      }, 2000)

    } catch (error) {
      console.error('Erro no upload:', error)
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: 'error',
          error: 'Erro no upload'
        }))
      )
    } finally {
      setUploading(false)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload de Arquivos</h1>
        <p className="text-muted-foreground mt-1">
          Envie seus arquivos de áudio e vídeo para armazenamento seguro
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
                <p>Formatos suportados: MP4, AVI, MOV, MP3, WAV, AAC</p>
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
                onClick={uploadFiles}
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
              Após o vencimento, os arquivos não poderão mais ser baixados
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Os arquivos são automaticamente compactados em formato ZIP para download
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Tamanho máximo por arquivo: <strong>500MB</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Upload
