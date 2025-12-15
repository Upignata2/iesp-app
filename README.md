# IESP App - Igreja Evangélica Sinais e Prodígios

Um aplicativo móvel nativo para Android com funcionalidades completas de conteúdo, autenticação, favoritos e pagamentos para a comunidade evangélica.

## ✨ Características

- **Autenticação Segura**: Login com e-mail/senha
- **Conteúdo Dinâmico**: Artigos, notícias, eventos, hinário e palavra do dia
- **Sistema de Favoritos**: Salve seus conteúdos favoritos
- **Pagamentos Integrados**: PIX, Mercado Pago e cartão de crédito
- **Galeria Multimídia**: Fotos e vídeos dos eventos
- **Formulário de Contato**: Envie mensagens para a comunidade
- **Design Responsivo**: Interface otimizada para mobile
- **Navegação Intuitiva**: 4 abas principais (Home, Vídeos, Favoritos, Menu)

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm
- PostgreSQL 14+
- Android SDK (para compilação)
- Java Development Kit (JDK)

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd "IESP APP"

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Edite o arquivo .env com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 📱 Compilação para Android

### 1. Build do Frontend

```bash
pnpm build
```

### 2. Adicionar Plataforma Android

```bash
npx cap add android
```

### 3. Sincronizar Código

```bash
npx cap sync
```

### 4. Compilar APK

```bash
# Abrir Android Studio
npx cap open android

# Ou compilar via CLI
npx cap build android
```

### 5. Gerar APK de Produção

No Android Studio:
1. Build > Generate Signed Bundle/APK
2. Selecione APK
3. Escolha sua keystore (ou crie uma nova)
4. Selecione "release" como build variant
5. Clique em Finish

## 🗄️ Banco de Dados

### Configuração

- Crie um banco no PostgreSQL (ex.: `iesp_app`)
- No arquivo `.env`, defina `DATABASE_URL` no formato `postgres://usuario:senha@host:porta/banco`

### Aplicar Migrações

```bash
npm run db:push
```

### Popular com Dados (Opcional)

```bash
# Executar seed script (requer tabelas criadas)
node seed-db.mjs
```

### Popular com Dados de Exemplo

```bash
# Executar seed script (PostgreSQL)
node seed-db.mjs
```

## 📚 Documentação

- **[DOCUMENTACAO.md](./DOCUMENTACAO.md)** - Documentação técnica completa
- **[GUIA_USUARIO.md](./GUIA_USUARIO.md)** - Guia de uso para usuários finais

## 🏗️ Estrutura do Projeto

```
iesp_app/
├── client/              # Frontend React + Capacitor
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── components/ # Componentes reutilizáveis
│   │   └── lib/        # Utilitários
│   └── public/         # Assets estáticos
├── server/             # Backend Express + tRPC
│   ├── routers.ts      # Procedimentos tRPC
│   └── db.ts           # Funções de query
├── drizzle/            # Schema do banco
└── seed-db.mjs         # Script de seed
```

## 🔧 Desenvolvimento

### Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

### Executar Testes

```bash
npm test
```

### Build para Produção

```bash
pnpm build
```

## 🔐 Autenticação

O app utiliza **Manus OAuth** para autenticação segura. Configure as seguintes variáveis:

```env
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=seu-secret-seguro
```

## 💳 Pagamentos

Integração com:
- **PIX**: Pagamento instantâneo
- **Mercado Pago**: Múltiplos métodos
- **Cartão de Crédito**: Direto

Os valores são armazenados em centavos (ex: R$ 50,00 = 5000 centavos)

## 📊 Modelos de Dados

O banco de dados inclui as seguintes tabelas:

- **users** - Usuários registrados
- **articles** - Artigos e reflexões
- **news** - Notícias da comunidade
- **events** - Eventos e cultos
- **hymns** - Hinário da comunidade
- **dailyWords** - Palavra do dia
- **prayerReasons** - Motivos de oração
- **serviceSchedules** - Horários dos cultos
- **galleryItems** - Fotos e vídeos
- **contactSubmissions** - Formulários de contato
- **campaigns** - Campanhas de arrecadação
- **campaignDonations** - Histórico de doações
- **userFavorites** - Favoritos dos usuários

## 🎨 Design

### Cores Principais
- **Azul**: #0066CC
- **Roxo**: #9333EA
- **Branco**: #FFFFFF

### Componentes
- **MobileLayout** - Layout com navegação inferior
- **FavoriteButton** - Botão de favorito reutilizável
- **DonationWidget** - Widget de doação
- **SplashScreen** - Tela de carregamento

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com cobertura
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## 📝 Variáveis de Ambiente

```env
# Banco de Dados (PostgreSQL)
DATABASE_URL=postgres://user:password@host:5432/iesp_app

# Autenticação
JWT_SECRET=seu-secret-aqui
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Aplicação
VITE_APP_TITLE=IESP
VITE_APP_LOGO=/logo.png
```

## 🐛 Troubleshooting

### Problema: Banco de dados não conecta
```bash
# Verifique a DATABASE_URL
# Certifique-se de que MySQL está rodando
# Teste a conexão manualmente
```

### Problema: Autenticação falha
```bash
# Verifique JWT_SECRET
# Limpe cookies do navegador
# Tente fazer login novamente
```

### Problema: APK não compila
```bash
# Atualize Android SDK
# Verifique versão do Java
# Limpe cache: npx cap clean
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a [documentação técnica](./DOCUMENTACAO.md)
2. Verifique o [guia de uso](./GUIA_USUARIO.md)
3. Entre em contato com a equipe de desenvolvimento

## 📄 Licença

Este projeto é propriedade da Igreja Evangélica Sinais e Prodígios.

## 👥 Contribuidores

Desenvolvido pela equipe de tecnologia da IESP.

---

**Versão**: 1.0.0  
**Status**: Produção  
**Última Atualização**: 2024

## 🙏 Agradecimentos

Agradecemos a Deus por guiar este projeto e à comunidade IESP pelo apoio.

Que este aplicativo sirva para fortalecer a fé e a comunhão entre os membros da Igreja Evangélica Sinais e Prodígios.
