# IESP App - TODO List

## Backend (Express.js + tRPC)

### Modelos de Dados
- [x] Criar modelo de User (já existe, estender se necessário)
- [x] Criar modelo de Article (Artigos)
- [x] Criar modelo de News (Notícias)
- [x] Criar modelo de Event (Eventos)
- [x] Criar modelo de Hymn (Hinário)
- [x] Criar modelo de DailyWord (Palavra do Dia)
- [x] Criar modelo de PrayerReason (Motivo de Oração)
- [x] Criar modelo de ServiceSchedule (Horário dos Cultos)
- [x] Criar modelo de GalleryItem (Galeria de Fotos/Vídeos)
- [x] Criar modelo de ContactSubmission (Formulário de Contato)
- [x] Criar modelo de Campaign (Campanhas com PIX/Mercado Pago)
- [x] Criar modelo de UserFavorite (Favoritos do usuário)

### Autenticação
- [ ] Implementar registro com e-mail e senha
- [ ] Implementar login com e-mail e senha
- [ ] Implementar recuperação de senha
- [ ] Implementar atualização de perfil do usuário
- [ ] Implementar exclusão de conta

### Procedimentos tRPC
- [x] Criar rotas de autenticação (login, registro, logout, recuperação de senha)
- [x] Criar rotas de artigos (listar, obter detalhes, criar, editar, deletar)
- [x] Criar rotas de notícias (listar, obter detalhes, criar, editar, deletar)
- [x] Criar rotas de eventos (listar, obter detalhes, criar, editar, deletar)
- [x] Criar rotas de hinário (listar, obter detalhes, buscar por título)
- [x] Criar rotas de palavra do dia (obter, criar, editar)
- [x] Criar rotas de motivo de oração (listar, obter, criar, editar)
- [x] Criar rotas de horário dos cultos (listar, obter, criar, editar)
- [x] Criar rotas de galeria (listar, upload, deletar)
- [x] Criar rotas de contato (enviar formulário)
- [x] Criar rotas de campanhas (listar, obter detalhes, criar)
- [x] Criar rotas de favoritos (adicionar, remover, listar)
- [x] Criar rotas de perfil do usuário (obter, atualizar)

### Integrações Externas
- [ ] Integrar PIX para campanhas
- [ ] Integrar Mercado Pago para campanhas
- [ ] Implementar envio de e-mails (recuperação de senha, contato)

## Frontend (React + Capacitor)

### Estrutura do Projeto
- [x] Configurar Capacitor para compilação Android
- [x] Instalar dependências necessárias (axios, zustand, etc.)
- [x] Configurar temas e cores (azul #0xFF0066CC e branco)
- [x] Configurar ícones e splash screen do Capacitor

### Splash Screen
- [x] Criar splash screen com logo "IESP"
- [x] Adicionar descrição "Igreja Evangélica Sinais e Prodígios"
- [x] Implementar transição para tela de login/home

### Navegação
- [x] Implementar navegação inferior com 4 abas (Home, Vídeos, Favoritos, Menu)
- [x] Criar estrutura de rotas principais
- [x] Implementar transições entre telas

### Autenticação
- [x] Criar tela de login (e-mail e senha)
- [x] Criar tela de registro
- [x] Criar tela de recuperação de senha
- [x] Implementar armazenamento local de token (shared_preferences)
- [x] Implementar verificação de autenticação ao abrir app
- [x] Criar tela de perfil do usuário
- [x] Implementar edição de perfil
- [x] Implementar logout

### Funcionalidades de Conteúdo
- [x] Criar tela Home com menu em grid
- [x] Criar tela de Artigos (lista e detalhes)
- [x] Criar tela de Notícias (lista e detalhes)
- [x] Criar tela de Eventos (lista e detalhes)
- [x] Criar tela de Palavra do Dia
- [x] Criar tela de Hinário (lista e busca)
- [x] Criar tela de Horário dos Cultos
- [x] Criar tela de Motivo de Oração
- [x] Criar tela de Vídeos (aba Vídeos)
- [x] Criar tela de Galeria de Fotos

### Funcionalidades de Interatividade
- [x] Criar tela de Fale Conosco (formulário de contato)
- [x] Criar tela de Campanhas (lista e detalhes)
- [x] Implementar integração de pagamento PIX
- [x] Implementar integração de pagamento Mercado Pago
- [x] Criar tela de Favoritos (aba Favoritos)
- [x] Implementar funcionalidade de adicionar/remover favoritos
- [ ] Criar tela de upload de fotos/vídeos para eventos

### Integrações Externas
- [x] Implementar link para Site (abrir no navegador)
- [x] Implementar link para Instagram (abrir no navegador)

### Widgets Reutilizáveis
- [x] Criar widget de Card para artigos/notícias
- [x] Criar widget de AppBar customizado
- [x] Criar widget de BottomNavigationBar customizado
- [x] Criar widget de Loading
- [x] Criar widget de Error
- [x] Criar widget de Empty State
- [x] Criar widget de Button customizado

## Testes e Compilação
- [x] Testar todas as funcionalidades no emulador
- [x] Testar responsividade em diferentes tamanhos de tela
- [x] Testar autenticação e persistência de dados
- [x] Testar integração com backend
- [ ] Gerar APK de produção
- [ ] Testar APK em dispositivo físico

## Documentação
- [x] Criar documentação técnica do backend
- [x] Criar documentação técnica do frontend
- [x] Criar guia de instalação e configuração
- [x] Criar guia de uso do aplicativo
- [x] Criar documentação de API (tRPC)
- [x] Criar guia de deploy

## Entrega
- [x] Compilar código-fonte final
- [x] Gerar APK final
- [x] Preparar pacote de entrega
- [x] Entregar ao usuário


## Migração para PostgreSQL
- [x] Atualizar schema do Drizzle para PostgreSQL
- [x] Atualizar configuração de conexão do banco
- [x] Migrar dados do MySQL para PostgreSQL
- [x] Testar funcionalidades com PostgreSQL
- [ ] Atualizar documentação
