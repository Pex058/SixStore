# 📋 Lista de Tarefas & Status - SixStore (Vitrine Digital de Roupas & Pedidos WhatsApp)

Este arquivo registra o progresso exato do desenvolvimento do projeto **SixStore**. Em caso de reinício de sessão ou quando os créditos da IA terminarem, este documento orienta exatamente onde paramos e como prosseguir.

---

## 📌 Status Atual do Projeto
- **Data da Última Atualização:** 24/09/2026
- **Versão:** 0.3.1
- **Status de Construção:** Causa raiz do sumiço dos produtos corrigida. Catálogo restaurado no Firestore a partir dos produtos locais do PC (`MOCK_PRODUTOS`), preservando as edições feitas no produto 2. Listener em tempo real (`subscribeProdutos`), sanitização de dados no salvamento (`sanitizeData`) e regras de segurança reforçadas (`isAdminUser()`) no Firestore.
- **Conta GitHub Verificada & Repositório Criado:** `Pex058` (`https://github.com/Pex058/SixStore`)
- **Conta Firebase Configurada:** Concluído com credenciais do projeto `sixstore-d3572`. Regras do Firestore e Firebase Hosting 100% implantados.
- **Painel Administrativo:** Acesso restrito via Google Sign-In (`pauloedu1985@gmail.com`), logout seguro, gestão de catálogo com sincronização instantânea em tempo real e lista de pedidos WhatsApp anti-perda.


---

## 📂 Resumo dos Arquivos Criados

| Arquivo / Pasta | Descrição | Status |
| :--- | :--- | :--- |
| `SixStore/frontend/src/types/index.ts` | Interfaces TypeScript (Produto, Variantes, ItemCarrinho, PedidoWhatsApp, LinkCampanha, OrigemLead) | Concluído |
| `SixStore/frontend/src/services/firebase.ts` | Inicialização do Firebase com Fallback gracioso | Concluído |
| `SixStore/frontend/src/services/auth.ts` | Autenticação Google exclusiva para o e-mail autorizado (`pauloedu1985@gmail.com`) | Concluído |
| `SixStore/frontend/src/services/products.ts` | Serviços de CRUD de Produtos (Firestore + Mock Local + Real-time Sync) | Concluído |
| `SixStore/frontend/src/services/orders.ts` | Gravação Anti-Perda no Firestore + Formatação do Link WhatsApp | Concluído |
| `SixStore/frontend/src/services/tracking.ts` | Leitura de UTMs, cliques e links de campanha | Concluído |
| `SixStore/frontend/src/hooks/useCart.ts` | Hook de gerenciamento do carrinho com localStorage | Concluído |
| `SixStore/frontend/src/hooks/useTracking.ts` | Hook de captura automática de parâmetros da URL | Concluído |
| `SixStore/frontend/src/components/Header.tsx` | Topbar com busca, filtro de categorias e contador de itens | Concluído |
| `SixStore/frontend/src/components/ProductCard.tsx` | Card de roupas com preço promocional e badges | Concluído |
| `SixStore/frontend/src/components/ProductModal.tsx` | Modal de detalhes, fotos e seleção de cor/tamanho | Concluído |
| `SixStore/frontend/src/components/CartDrawer.tsx` | Gaveta flutuante do carrinho com checkout WhatsApp | Concluído |
| `SixStore/frontend/src/components/ProtectedRoute.tsx` | Dashboard Administrativo com controle de acesso Google | Concluído |
| `SixStore/frontend/src/components/Admin/ProductForm.tsx` | Formulário de criação e edição de roupas | Concluído |
| `SixStore/frontend/src/components/Admin/OrdersList.tsx` | Tabela de acompanhamento dos pedidos salvos em tempo real | Concluído |
| `SixStore/frontend/src/components/Admin/CampaignLinks.tsx` | Gerador e rastreador de URLs com UTM | Concluído |
| `SixStore/frontend/src/App.tsx` | Integração principal da aplicação | Concluído |
| `SixStore/firebase.json` | Configuração de Hosting e Firestore para Firebase | Concluído |
| `SixStore/firestore.rules` | Regras de segurança NoSQL para Firestore | Concluído |
| `SixStore/storage.rules` | Regras de segurança de upload de fotos no Firebase Storage | Concluído |

---

## ⚙️ Detalhamento das Fases

### 🚀 Fase 1: Inicialização do Projeto & Estrutura Base
- [x] Leitura da especificação (`SistemaBGS/DOC_VITRINE_ROUPAS.md`)
- [x] Criação da pasta `SixStore`
- [x] Verificação da conta GitHub via CLI (`Pex058`)
- [x] Criação dos arquivos `tasks.md`, `changelog.md`, `README.md`, `firebase.json`, `firestore.rules`, `storage.rules`, `.env.example`, `.gitignore`
- [x] Criação da aplicação React + TypeScript + Vite em `frontend`
- [x] Instalação de dependências (`firebase`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite`)

### 📦 Fase 2: Modelagem de Dados & Serviços
- [x] Interfaces TypeScript em `types/index.ts`
- [x] Serviços em `services/` com suporte dual (Firestore real quando configurado + Mock Local para desenvolvimento offline)

### 🛍️ Fase 3: Vitrine Pública & Carrinho Interativo
- [x] Header com busca textual e pills de categorias (`Header.tsx`)
- [x] Card de produto responsivo com porcentagem de desconto (`ProductCard.tsx`)
- [x] Modal de detalhes com galeria de imagens e seletores de cor, tamanho e quantidade (`ProductModal.tsx`)
- [x] Hook do carrinho com persistência (`useCart.ts`)
- [x] Gaveta lateral do carrinho (`CartDrawer.tsx`)
- [x] Checkout WhatsApp anti-perda (salva pedido antes de abrir `wa.me`)

### 📊 Fase 4: Rastreamento de Marketing (UTMs)
- [x] Captura automática de `ref`, `utm_source`, `utm_medium`, `utm_campaign` (`useTracking.ts`)
- [x] Associação da origem a cada pedido gerado

### 🔐 Fase 5: Painel Administrativo & Autenticação Google
- [x] Login Administrativo via Google Auth restrito exclusivamente a `pauloedu1985@gmail.com` (`auth.ts` e `ProtectedRoute.tsx`)
- [x] Desconexão automática e bloqueio de usuários não autorizados
- [x] Formulário de Cadastro/Edição de Roupas com fotos e variações (`ProductForm.tsx`)
- [x] Gestão de Pedidos/Carrinhos Salvos com alteração de status e listener em tempo real (`OrdersList.tsx`)
- [x] Gerador de Links Rastreados (`CampaignLinks.tsx`)

### 🌐 Fase 6: Git, GitHub & Deploy
- [x] Validação de build (`npm run build` executado com sucesso)
- [x] Configuração do arquivo `.env` com as credenciais reais do Firebase (`sixstore-d3572`)
- [x] Inicialização de repositório Git local (`git init` em `SixStore`)
- [x] Criação do repositório remoto no GitHub (`https://github.com/Pex058/SixStore`) e push inicial
- [x] Publicação online concluída via `firebase deploy`: **[https://sixstore-d3572.web.app](https://sixstore-d3572.web.app)**

### 🛡️ Fase 7: Estabilidade do Catálogo, Anti-Perda & Sincronização em Tempo Real
- [x] Identificação da causa raiz do sumiço de produtos e restauração dos 4 produtos no Firestore
- [x] Preservação das edições do usuário no produto 2 (Blusa Manga Longa Seda Premium)
- [x] Sincronização em tempo real do catálogo (`subscribeProdutos`) para vitrine e admin
- [x] Sanitização de dados com `sanitizeData` em produtos e pedidos
- [x] Reforço das regras de segurança NoSQL (`isAdminUser()`) no Cloud Firestore


