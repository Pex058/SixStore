# 📜 CHANGELOG - SixStore

Todas as modificações notáveis no projeto **SixStore** serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.3.1] - 2026-09-24

### 🛠️ Correção da Causa Raiz dos Produtos Sumidos & Sincronização em Tempo Real
- **Diagnóstico da Causa Raiz:** O Firestore inicial não continha documentos e operava no modo fallback com dados mock do código do PC. Ao editar e salvar a primeira peça (`prod_2`), o banco passou a ter 1 item, fazendo a consulta ignorar o mock e exibir apenas o produto salvo, ocultando os outros 3 produtos que nunca haviam sido persistidos.
- **Restauração Completa dos Produtos:** Utilizados os produtos locais do PC (`MOCK_PRODUTOS`) para persistir `prod_1`, `prod_3` e `prod_4` no Firestore, preservando integralmente a nova foto e edições feitas pelo usuário no `prod_2`.
- **Sincronização em Tempo Real do Catálogo (`subscribeProdutos`):** Implementado listener `onSnapshot` no catálogo de produtos, atualizando a vitrine e o painel admin instantaneamente a cada edição, criação ou exclusão.
- **Sanitização de Dados no Produto (`salvarProduto`):** Integrada a função `sanitizeData` para evitar que propriedades opcionais com valor `undefined` (como `precoPromocional`) causem erro na gravação do Firestore.
- **Busca Resiliente de Produtos (`getProdutos`):** Eliminação de omissões silenciosas que ocorriam com `orderBy('createdAt')` do Firestore, garantindo que todo produto cadastrado seja sempre retornado e ordenado em memória.
- **Reforço de Segurança nas Regras (`firestore.rules`):** Regras de segurança em `/produtos` e `/configuracoes` travadas com `allow write: if isAdminUser();` e reimplantadas no Cloud Firestore.

---

## [0.3.0] - 2026-09-24

### 🔐 Autenticação Google & Permissões do Painel Admin
- **Login com Conta Google:** Implementada integração com o Firebase Authentication via Google Provider (`signInWithPopup`).
- **Lista de Autorização Restrita:** Painel admin configurado exclusivamente para o e-mail autorizado: `pauloedu1985@gmail.com`. Tentativas de acesso com outras contas Google são imediatamente bloqueadas e desconectadas com notificação visual.
- **Header do Administrador:** Exibição da foto, nome e e-mail do usuário Google autenticado no topo do painel, com botão de logout funcional.
- **Regras do Firestore Atualizadas:** Regras de segurança NoSQL atualizadas e publicadas no projeto Firebase `sixstore-d3572` exigindo `request.auth.token.email == 'pauloedu1985@gmail.com'` para todas as operações administrativas.

### 🛒 Gravação do Carrinho & Sincronização em Tempo Real (WhatsApp Checkout)
- **Persistência Anti-Perda Garantida:** Implementada sanitização de dados (`sanitizeData`) e configuração `ignoreUndefinedProperties: true` no Firestore para evitar que campos opcionais/indefinidos (como parâmetros de UTM) causem falha na criação do documento.
- **Geração e Gravação de ID no Documento:** Pedidos agora geram o ID único do Firestore antecipadamente e salvam o pedido completo no Firestore antes de redirecionar o cliente para o WhatsApp.
- **Sincronização em Tempo Real (`onSnapshot`):** A lista de pedidos do painel administrativo agora recebe atualizações instantâneas via listener em tempo real, sem necessidade de atualizar a página quando um novo cliente envia o carrinho.
- **Ajustes de Hooks e Conformidade:** Corrigida a ordem dos hooks no `ProductModal.tsx` e `CartDrawer.tsx`, assegurando 0 erros de linting e build de produção 100% validado.

---

## [0.2.1] - 2026-09-24

### 🎨 Melhorias de UX & Usabilidade (mudar.txt)
- **Fechamento ao clicar fora do Carrinho:** O carrinho (drawer) agora fecha suavemente ao clicar na área escura de fundo (backdrop).
- **Botão "Continuar Comprando":** Inserido botão explícito com ícone no rodapé do carrinho para permitir que o cliente retorne imediatamente à navegação da vitrine.
- **Fechamento ao clicar fora do Pop-up da Roupa:** O modal de detalhes do produto agora também fecha ao clicar fora dele na área escurecida.
- **Atalhos e Acessibilidade:** Suporte ao fechamento via tecla `Escape` (ESC) e travamento da rolagem da página de fundo (`body scroll lock`) enquanto o modal ou o carrinho estiverem abertos.
- **Vinculação de Projeto:** Criação do `.firebaserc` associado ao projeto `sixstore-d3572`.

---

## [0.2.0] - 2026-09-24

### 🚀 Adicionado / Configurado
- Leitura dos dados do Firebase (`firebase.txt`) e criação do arquivo `.env` com as chaves de API do projeto `sixstore-d3572`.
- Autenticação e seleção da conta Firebase CLI `campolargob2b@gmail.com`.
- Publicação da aplicação e das regras do Firestore no Firebase Hosting: [https://sixstore-d3572.web.app](https://sixstore-d3572.web.app).
- Integração e inicialização do repositório Git local.
- Adição do arquivo `firebase.txt` e variações `.env` ao `.gitignore` para proteção de segredos.
- Criação e envio (push) do repositório público no GitHub: [https://github.com/Pex058/SixStore](https://github.com/Pex058/SixStore).
- Revalidação do build de produção (`npm run build`) com 0 erros.

---


## [0.1.0] - 2026-09-24


### 🚀 Adicionado
- Leitura e especificação técnica baseada no documento `SistemaBGS/DOC_VITRINE_ROUPAS.md`.
- Inicialização do diretório principal do projeto `SixStore` e do projeto frontend React + TypeScript + Vite.
- Instalação e configuração de dependências: `firebase`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite`.
- Criação dos arquivos de infraestrutura do Firebase: `firebase.json`, `firestore.rules`, `storage.rules`, `.env.example`.
- Definição das interfaces de dados em `src/types/index.ts` (`Produto`, `ItemCarrinho`, `PedidoWhatsApp`, `LinkCampanha`, `OrigemLead`).
- Implementação de serviços Firebase e Mock offline em `src/services/` (`firebase.ts`, `products.ts`, `orders.ts`, `tracking.ts`).
- Desenvolvimento da interface da Vitrine Pública:
  - Header com barra de busca, filtro por categorias e badge de contador do carrinho (`Header.tsx`).
  - Card de Exibição de Roupas com preço promocional, porcentagem de desconto e fotos (`ProductCard.tsx`).
  - Modal de Detalhes do Produto com seletores de cor, tamanho e quantidade (`ProductModal.tsx`).
  - Drawer Flutuante de Carrinho Interativo com cálculo de total e checkout anti-perda via WhatsApp (`CartDrawer.tsx`).
  - Hooks personalizados para estado do carrinho (`useCart.ts`) e captura de UTMs de marketing (`useTracking.ts`).
- Desenvolvimento do Painel Administrativo (`ProtectedRoute.tsx`):
  - Formulário de cadastro e edição de produtos com variações de cores e tamanhos (`ProductForm.tsx`).
  - Gerenciador e acompanhamento de carrinhos salvos / pedidos WhatsApp com controle de status (`OrdersList.tsx`).
  - Gerador e rastreador de links de campanhas com acompanhamento de cliques e conversões (`CampaignLinks.tsx`).
- Verificação e compilação do projeto via `npm run build` com sucesso.
- Validação do ambiente Git e verificação da conta do GitHub (`Pex058` / `pauloedu1985@gmail.com`).
