# Planejamento do Front-end - Sistema de Armazenamento de Mídia

## Arquitetura do Front-end

### Tecnologias Escolhidas
- **React 18** - Framework principal
- **TypeScript** - Para tipagem estática
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP para API
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Cache e sincronização de dados
- **Styled Components** - Estilização com CSS-in-JS
- **React Icons** - Ícones modernos
- **React Dropzone** - Upload de arquivos com drag & drop

### Estrutura de Páginas

1. **Página de Login** (`/login`)
   - Formulário de autenticação
   - Link para cadastro
   - Validação de campos

2. **Página de Cadastro** (`/register`)
   - Formulário de registro
   - Validação de dados
   - Redirecionamento após sucesso

3. **Dashboard** (`/dashboard`)
   - Visão geral dos arquivos
   - Estatísticas (total, válidos, expirados)
   - Acesso rápido às funcionalidades

4. **Upload de Arquivos** (`/upload`)
   - Interface drag & drop
   - Preview de arquivos
   - Barra de progresso
   - Validação de tipo e tamanho

5. **Lista de Arquivos** (`/files`)
   - Tabela com todos os arquivos
   - Filtros (tipo, status, data)
   - Ações (download, visualizar, excluir)
   - Paginação

6. **Perfil do Usuário** (`/profile`)
   - Informações pessoais
   - Alteração de senha
   - Configurações

### Componentes Principais

#### Layout
- **Header** - Navegação principal, logo, menu do usuário
- **Sidebar** - Menu lateral com navegação
- **Footer** - Informações do sistema
- **Layout** - Container principal com sidebar e conteúdo

#### Funcionalidades
- **FileCard** - Card para exibir arquivo individual
- **FileUpload** - Componente de upload com drag & drop
- **FileList** - Lista/tabela de arquivos
- **StatusBadge** - Badge para status do arquivo (válido/expirado)
- **ProgressBar** - Barra de progresso para uploads
- **Modal** - Modal genérico para confirmações
- **LoadingSpinner** - Indicador de carregamento

#### Formulários
- **LoginForm** - Formulário de login
- **RegisterForm** - Formulário de cadastro
- **ProfileForm** - Formulário de perfil

### Tema Escuro - Paleta de Cores

#### Cores Principais
- **Background Principal**: `#0f0f0f` (preto suave)
- **Background Secundário**: `#1a1a1a` (cinza escuro)
- **Background Cards**: `#262626` (cinza médio)
- **Bordas**: `#404040` (cinza claro)

#### Cores de Destaque
- **Primária**: `#6366f1` (índigo vibrante)
- **Secundária**: `#8b5cf6` (roxo)
- **Sucesso**: `#10b981` (verde)
- **Aviso**: `#f59e0b` (amarelo/laranja)
- **Erro**: `#ef4444` (vermelho)

#### Texto
- **Texto Principal**: `#ffffff` (branco)
- **Texto Secundário**: `#d1d5db` (cinza claro)
- **Texto Muted**: `#9ca3af` (cinza médio)

### Estados dos Arquivos

#### Visual dos Status
- **Válido**: Badge verde com ícone de check
- **Expirando** (< 30 dias): Badge amarelo com ícone de aviso
- **Expirado**: Badge vermelho com ícone de X
- **Uploading**: Badge azul com spinner

### Responsividade

#### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

#### Adaptações Mobile
- Sidebar colapsível
- Cards em coluna única
- Upload simplificado
- Menu hambúrguer

### Funcionalidades Especiais

#### Upload
- Drag & drop visual
- Preview de arquivos
- Validação de tipo (áudio/vídeo)
- Limite de tamanho
- Upload múltiplo
- Barra de progresso individual

#### Download
- Verificação de validade
- Compactação automática (.zip)
- Mensagens de erro claras
- Download direto ou modal de confirmação

#### Notificações
- Toast notifications
- Feedback de ações
- Alertas de expiração
- Confirmações de exclusão

### Integração com API

#### Endpoints Esperados
- `POST /auth/login` - Autenticação
- `POST /auth/register` - Cadastro
- `GET /files` - Listar arquivos
- `POST /files/upload` - Upload de arquivo
- `GET /files/{id}/download` - Download
- `DELETE /files/{id}` - Excluir arquivo
- `GET /user/profile` - Perfil do usuário

#### Gerenciamento de Estado
- Context API para autenticação
- React Query para cache de dados
- Local Storage para persistência de sessão

### Performance

#### Otimizações
- Lazy loading de componentes
- Virtualização de listas grandes
- Compressão de imagens
- Code splitting por rota
- Memoização de componentes pesados

#### SEO e Acessibilidade
- Meta tags apropriadas
- ARIA labels
- Contraste adequado
- Navegação por teclado
- Screen reader friendly
