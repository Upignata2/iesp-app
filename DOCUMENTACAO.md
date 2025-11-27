# Documentação Técnica - IESP App

## 📱 Visão Geral

O **IESP App** é um aplicativo móvel nativo para Android desenvolvido com React + Capacitor, oferecendo uma experiência completa para a Igreja Evangélica Sinais e Prodígios com funcionalidades de conteúdo, autenticação, favoritos e pagamentos.

## 🏗️ Arquitetura

### Frontend
- **Framework**: React 19 com TypeScript
- **Compilação**: Vite
- **Mobile**: Capacitor (compila para APK nativo Android)
- **UI Components**: shadcn/ui + Tailwind CSS 4
- **Estado**: tRPC React Query
- **Navegação**: Wouter

### Backend
- **Runtime**: Node.js + Express.js 4
- **API**: tRPC 11
- **Banco de Dados**: MySQL/TiDB
- **Autenticação**: Manus OAuth + JWT
- **ORM**: Drizzle

## 📦 Estrutura do Projeto

```
iesp_app/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── lib/              # Utilitários (tRPC client)
│   │   ├── contexts/         # React contexts
│   │   ├── App.tsx           # Roteamento principal
│   │   └── index.css         # Estilos globais
│   └── public/               # Assets estáticos
├── server/                    # Backend Express
│   ├── routers.ts            # Procedimentos tRPC
│   ├── db.ts                 # Funções de query
│   └── _core/                # Framework interno
├── drizzle/                   # Schema do banco
│   └── schema.ts             # Modelos de dados
├── seed-db.mjs               # Script de seed
└── DOCUMENTACAO.md           # Esta documentação
```

## 🗄️ Modelos de Dados

### Users
```typescript
- id: int (PK)
- openId: varchar (OAuth ID)
- name: text
- email: varchar
- loginMethod: varchar
- role: enum ('user' | 'admin')
- createdAt: timestamp
- updatedAt: timestamp
- lastSignedIn: timestamp
```

### Articles (Artigos)
```typescript
- id: int (PK)
- title: varchar
- description: text
- content: longtext
- imageUrl: varchar
- createdAt: timestamp
- updatedAt: timestamp
```

### News (Notícias)
```typescript
- id: int (PK)
- title: varchar
- description: text
- content: longtext
- imageUrl: varchar
- createdAt: timestamp
- updatedAt: timestamp
```

### Events (Eventos)
```typescript
- id: int (PK)
- title: varchar
- description: text
- content: longtext
- startDate: datetime
- endDate: datetime (opcional)
- location: varchar
- imageUrl: varchar
- createdAt: timestamp
- updatedAt: timestamp
```

### Hymns (Hinário)
```typescript
- id: int (PK)
- number: int
- title: varchar
- author: varchar
- lyrics: longtext
- createdAt: timestamp
- updatedAt: timestamp
```

### DailyWords (Palavra do Dia)
```typescript
- id: int (PK)
- title: varchar
- reference: varchar (referência bíblica)
- content: longtext
- createdAt: timestamp
- updatedAt: timestamp
```

### PrayerReasons (Motivos de Oração)
```typescript
- id: int (PK)
- title: varchar
- description: text
- priority: enum ('high' | 'medium' | 'low')
- createdAt: timestamp
- updatedAt: timestamp
```

### ServiceSchedules (Horário dos Cultos)
```typescript
- id: int (PK)
- dayOfWeek: enum (Monday-Sunday)
- serviceName: varchar
- startTime: time
- endTime: time
- location: varchar
- createdAt: timestamp
- updatedAt: timestamp
```

### GalleryItems (Galeria)
```typescript
- id: int (PK)
- title: varchar
- mediaUrl: varchar
- mediaType: enum ('image' | 'video')
- eventId: int (FK, opcional)
- createdAt: timestamp
- updatedAt: timestamp
```

### ContactSubmissions (Contato)
```typescript
- id: int (PK)
- name: varchar
- email: varchar
- subject: varchar
- message: longtext
- createdAt: timestamp
- updatedAt: timestamp
```

### Campaigns (Campanhas)
```typescript
- id: int (PK)
- title: varchar
- description: text
- content: longtext
- goal: int (em centavos)
- collected: int (em centavos)
- imageUrl: varchar
- createdAt: timestamp
- updatedAt: timestamp
```

### CampaignDonations (Doações)
```typescript
- id: int (PK)
- campaignId: int (FK)
- userId: int (FK, opcional)
- amount: int (em centavos)
- paymentMethod: enum ('pix' | 'mercadopago' | 'credit_card')
- status: enum ('pending' | 'completed' | 'failed')
- createdAt: timestamp
- updatedAt: timestamp
```

### UserFavorites (Favoritos)
```typescript
- id: int (PK)
- userId: int (FK)
- contentType: enum ('article' | 'news' | 'event' | 'hymn')
- contentId: int
- createdAt: timestamp
- updatedAt: timestamp
```

## 🔌 Endpoints tRPC

### Autenticação
- `auth.me` - Obter usuário atual
- `auth.logout` - Fazer logout

### Artigos
- `articles.list` - Listar artigos
- `articles.getById` - Obter artigo por ID
- `articles.create` - Criar artigo (admin)
- `articles.update` - Atualizar artigo (admin)
- `articles.delete` - Deletar artigo (admin)

### Notícias
- `news.list` - Listar notícias
- `news.getById` - Obter notícia por ID
- `news.create` - Criar notícia (admin)
- `news.update` - Atualizar notícia (admin)
- `news.delete` - Deletar notícia (admin)

### Eventos
- `events.list` - Listar eventos
- `events.getById` - Obter evento por ID
- `events.create` - Criar evento (admin)
- `events.update` - Atualizar evento (admin)
- `events.delete` - Deletar evento (admin)

### Hinário
- `hymns.list` - Listar hinos
- `hymns.getById` - Obter hino por ID
- `hymns.search` - Buscar hinos por título

### Palavra do Dia
- `dailyWord.getLatest` - Obter palavra do dia mais recente
- `dailyWord.create` - Criar palavra do dia (admin)

### Motivos de Oração
- `prayerReasons.list` - Listar motivos de oração
- `prayerReasons.getById` - Obter motivo por ID
- `prayerReasons.create` - Criar motivo (admin)

### Horário dos Cultos
- `serviceSchedules.list` - Listar horários
- `serviceSchedules.getById` - Obter horário por ID
- `serviceSchedules.create` - Criar horário (admin)

### Galeria
- `gallery.list` - Listar itens da galeria
- `gallery.upload` - Upload de foto/vídeo (autenticado)
- `gallery.delete` - Deletar item (admin)

### Contato
- `contact.submit` - Enviar formulário de contato

### Campanhas
- `campaigns.list` - Listar campanhas
- `campaigns.getById` - Obter campanha por ID
- `campaigns.create` - Criar campanha (admin)
- `campaigns.donate` - Fazer doação

### Favoritos
- `favorites.list` - Listar favoritos do usuário
- `favorites.add` - Adicionar favorito
- `favorites.remove` - Remover favorito

## 🚀 Como Executar

### Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# O app estará disponível em http://localhost:3000
```

### Seed de Dados

```bash
# Popular banco com dados de exemplo
node seed-db.mjs
```

### Build para Produção

```bash
# Build do frontend
pnpm build

# Build com Capacitor para Android
pnpm build
npx cap add android
npx cap build android
```

## 🎨 Design

### Cores Primárias
- **Azul Principal**: #0066CC
- **Roxo/Magenta**: #9333EA
- **Branco**: #FFFFFF
- **Cinza**: #F3F4F6

### Componentes Principais
- **MobileLayout**: Layout com navegação inferior em 4 abas
- **FavoriteButton**: Botão de favorito reutilizável
- **DonationWidget**: Widget de doação com múltiplos métodos de pagamento
- **SplashScreen**: Tela de carregamento animada

## 🔐 Autenticação

O app utiliza Manus OAuth para autenticação segura. O fluxo é:

1. Usuário clica em "Entrar com Manus"
2. Redirecionado para portal de login Manus
3. Após autenticação, retorna com JWT
4. JWT armazenado em cookie seguro
5. Todas as requisições incluem o JWT automaticamente

## 💳 Pagamentos

Integração com:
- **PIX**: Pagamento instantâneo
- **Mercado Pago**: Múltiplos métodos
- **Cartão de Crédito**: Direto

Valores armazenados em centavos (ex: R$ 50,00 = 5000 centavos)

## 📱 Compilação para Android

### Pré-requisitos
- Node.js 18+
- Android SDK
- Java Development Kit (JDK)

### Passos

```bash
# 1. Build do frontend
pnpm build

# 2. Adicionar plataforma Android
npx cap add android

# 3. Sincronizar código
npx cap sync

# 4. Abrir Android Studio
npx cap open android

# 5. Build e run no Android Studio
# Ou via CLI:
npx cap build android
```

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com cobertura
pnpm test:coverage
```

## 📝 Variáveis de Ambiente

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=seu-secret-aqui
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

## 🐛 Troubleshooting

### Problema: Banco de dados não conecta
**Solução**: Verificar DATABASE_URL e credenciais MySQL

### Problema: Autenticação falha
**Solução**: Verificar JWT_SECRET e cookies do navegador

### Problema: APK não compila
**Solução**: Verificar Android SDK e versão do Java

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [Capacitor Documentation](https://capacitorjs.com)
- [tRPC Documentation](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0  
**Última Atualização**: 2024  
**Status**: Produção
