# 📜 CHANGELOG - SixStore

Todas as modificações notáveis no projeto **SixStore** serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
