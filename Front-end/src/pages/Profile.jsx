import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import axios from 'axios'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Calendar,
  HardDrive
} from 'lucide-react'

const profileSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

const Profile = () => {
  const { user, setUser } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Adicionado para as estatísticas da conta
  const [userStats, setUserStats] = useState({ totalFiles: 0, totalStorage: '0 GB', memberSince: '', lastLogin: '' })
  const [loadingStats, setLoadingStats] = useState(false)

  // Função para formatar bytes em GB/MB
  const formatStorage = (bytes) => {
    if (!bytes || bytes === 0) return '0 GB'
    const gb = bytes / (1024 * 1024 * 1024)
    return gb < 1 ? `${(gb * 1024).toFixed(2)} MB` : `${gb.toFixed(2)} GB`
  }

  // Buscar dados reais da conta
  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoadingStats(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Token não encontrado')

        const response = await fetch(`http://localhost:8080/api/user/account-info/${user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erro ao buscar informações da conta')
        }

        const data = await response.json()
        setUserStats({
          totalFiles: data.totalFiles || 0,
          totalStorage: formatStorage(data.totalStorage),
          memberSince: '2024-01-15',
          lastLogin: '2024-10-04'
        })
      } catch (err) {
        console.error('Erro ao buscar dados da conta:', err)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user?.id) fetchAccountInfo()
  }, [user?.id])

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  })

const onProfileSubmit = async (data) => {
  console.log('User ID:', user?.id); // Verifica se o ID está correto
  setProfileLoading(true);
  setProfileError('');
  setProfileSuccess('');

  try {
    const response = await axios.put(`http://localhost:8080/api/user/profile/${user.id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    // Atualiza estado global ou local com os dados retornados
    // setUser(response.data); // Comentado: AuthContext não fornece setUser. Atualização do formulário já reflete os dados.
    profileForm.reset(response.data); // Atualiza campos do formulário

    setProfileSuccess('Perfil atualizado com sucesso!');
    setTimeout(() => setProfileSuccess(''), 3000);
  } catch (error) {
    console.error('Erro na requisição:', error);
    setProfileError('Erro ao atualizar perfil. Tente novamente.');
  } finally {
    setProfileLoading(false);
  }
};


const onPasswordSubmit = async (data) => {
  setPasswordLoading(true)
  setPasswordError('')
  setPasswordSuccess('')
  try {
    await axios.put(`http://localhost:8080/api/user/password/${user.id}`, {
      senhaAtual: data.currentPassword,
      senhaNova: data.newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })

    setPasswordSuccess('Senha alterada com sucesso!')
    passwordForm.reset()
    setTimeout(() => setPasswordSuccess(''), 3000)
  } catch (error) {
    setPasswordError(error.response?.data?.message || 'Erro ao alterar senha.')
  } finally {
    setPasswordLoading(false)
  }
}

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Perfil do Usuário</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      {/* Estatísticas do usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Membro desde</p>
              <p className="font-semibold">{loadingStats ? '...' : formatDate(userStats.memberSince)}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total de arquivos</p>
              <p className="font-semibold">{loadingStats ? '...' : userStats.totalFiles}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Armazenamento usado</p>
              <p className="font-semibold">{loadingStats ? '...' : userStats.totalStorage}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Último acesso</p>
              <p className="font-semibold">{loadingStats ? '...' : formatDate(userStats.lastLogin)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              {profileSuccess && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {profileSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  type="text"
                  {...profileForm.register('nome')}
                  className={profileForm.formState.errors.nome ? 'border-destructive' : ''}
                />
                {profileForm.formState.errors.nome && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    className={`pl-10 ${profileForm.formState.errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={profileLoading} className="w-full">
                {profileLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Alterar senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              {passwordSuccess && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {passwordSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Sua senha atual"
                    {...passwordForm.register('currentPassword')}
                    className={passwordForm.formState.errors.currentPassword ? 'border-destructive' : ''}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </span>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Sua nova senha"
                    {...passwordForm.register('newPassword')}
                    className={passwordForm.formState.errors.newPassword ? 'border-destructive' : ''}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </span>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua nova senha"
                    {...passwordForm.register('confirmPassword')}
                    className={passwordForm.formState.errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </span>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={passwordLoading} className="w-full">
                {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Outras configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Configurações de Notificação
          </CardTitle>
          <CardDescription>
            Gerencie suas preferências de e-mail e notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: Opções para gerenciar suas notificações.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
