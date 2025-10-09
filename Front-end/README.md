# MediaVault - Sistema de Armazenamento de Mídia

Um front-end moderno e elegante para sistema de armazenamento de arquivos de áudio e vídeo com controle de validade de 180 dias.

## 🎨 Design e Características

### Tema Escuro Elegante
- **Background Principal**: Preto suave (#0f0f0f)
- **Cards e Componentes**: Tons de cinza escuro (#1a1a1a, #262626)
- **Cores de Destaque**: Índigo vibrante (#6366f1) como cor primária
- **Status Colors**: Verde para válidos, amarelo para expirando, vermelho para expirados

### Interface Responsiva
- Layout adaptável para desktop, tablet e mobile
- Sidebar colapsível em dispositivos móveis
- Componentes otimizados para diferentes tamanhos de tela

## 🚀 Funcionalidades Implementadas

### 1. **Autenticação**
- Tela de login com validação
- Tela de cadastro de novos usuários
- Login demo para demonstração
- Gerenciamento de sessão com localStorage

### 2. **Dashboard**
- Visão geral com estatísticas dos arquivos
- Cards informativos (Total, Válidos, Expirando, Expirados)
- Gráfico de uso de armazenamento
- Lista de arquivos recentes
- Ações rápidas para upload e gerenciamento

### 3. **Upload de Arquivos**
- Interface drag & drop intuitiva
- Suporte para múltiplos arquivos
- Validação de formato (áudio/vídeo)
- Barra de progresso para uploads
- Limite de 500MB por arquivo
- Preview de arquivos selecionados

### 4. **Gerenciamento de Arquivos**
- Lista completa de todos os arquivos
- Filtros por tipo (áudio/vídeo) e status
- Busca por nome de arquivo
- Ordenação por data, nome, tamanho, expiração
- Status visual com badges coloridos
- Alertas para arquivos expirando
- Botões de download e exclusão

### 5. **Perfil do Usuário**
- Informações da conta (membro desde, total de arquivos, etc.)
- Edição de dados pessoais
- Alteração de senha com validação
- Dicas de segurança
- Estatísticas de uso

## 🛠 Tecnologias Utilizadas

### Core
- **React 18** - Framework principal
- **React Router** - Navegação entre páginas
- **Vite** - Build tool e dev server

### UI/UX
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações (disponível)

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **@hookform/resolvers** - Integração Zod + React Hook Form

### Estado e Dados
- **React Query** - Cache e sincronização de dados
- **Context API** - Gerenciamento de estado de autenticação
- **Axios** - Cliente HTTP

### Upload
- **React Dropzone** - Interface drag & drop para uploads

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── Layout.jsx          # Layout principal com sidebar
│   └── ProtectedRoute.jsx  # Proteção de rotas
├── contexts/
│   └── AuthContext.jsx     # Contexto de autenticação
├── pages/
│   ├── Login.jsx           # Página de login
│   ├── Register.jsx        # Página de cadastro
│   ├── Dashboard.jsx       # Dashboard principal
│   ├── Upload.jsx          # Upload de arquivos
│   ├── Files.jsx           # Listagem de arquivos
│   └── Profile.jsx         # Perfil do usuário
├── App.jsx                 # Componente principal
├── App.css                 # Estilos globais
└── main.jsx               # Ponto de entrada
```

## 🎯 Regras de Negócio Implementadas

### Controle de Validade
- **180 dias**: Prazo de validade para todos os arquivos
- **Status Automático**: Classificação em válido, expirando (< 30 dias), expirado
- **Bloqueio de Download**: Arquivos expirados não podem ser baixados
- **Alertas Visuais**: Indicadores claros do status de cada arquivo

### Gerenciamento de Arquivos
- **Formatos Suportados**: MP4, AVI, MOV, MP3, WAV, AAC, OGG, M4A, FLAC
- **Limite de Tamanho**: 500MB por arquivo
- **Compactação**: Arquivos são compactados em ZIP para download
- **Metadados**: Armazenamento de informações como data, tamanho, tipo

### Segurança
- **Autenticação Obrigatória**: Acesso apenas com login
- **Sessões Persistentes**: Manutenção de login entre sessões
- **Validação de Formulários**: Validação client-side robusta
- **Rotas Protegidas**: Redirecionamento automático para login

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- pnpm (ou npm/yarn)

### Instalação
```bash
# Clonar o repositório
cd media-storage-frontend

# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

### Acesso
- **Desenvolvimento**: http://localhost:5173
- **Login Demo**: Use o botão "Entrar como Demo" na tela de login

## 🎨 Capturas de Tela

### Dashboard
- Visão geral com estatísticas e arquivos recentes
- Cards informativos com uso de armazenamento
- Interface dark mode elegante

### Upload
- Área drag & drop intuitiva
- Validação de arquivos em tempo real
- Barra de progresso para uploads

### Listagem de Arquivos
- Filtros avançados e busca
- Status visual com cores
- Ações de download e gerenciamento

### Perfil
- Informações da conta
- Edição de dados pessoais
- Alteração de senha segura

## 🔮 Próximos Passos

### Integrações
- Conectar com API backend real
- Implementar upload real de arquivos
- Integração com serviços de armazenamento (AWS S3, etc.)

### Funcionalidades Avançadas
- Notificações push para arquivos expirando
- Compartilhamento de arquivos
- Histórico de downloads
- Backup automático

### Melhorias de UX
- Preview de arquivos de mídia
- Player integrado para áudio/vídeo
- Thumbnails para vídeos
- Organização por pastas

## 📄 Licença

Este projeto foi desenvolvido como demonstração de um sistema de armazenamento de mídia com interface moderna e funcionalidades completas.

---

**MediaVault** - Sistema de Armazenamento de Mídia com Interface Elegante e Tema Escuro
