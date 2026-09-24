# 🛍️ SixStore - Vitrine Digital de Roupas & Pedidos WhatsApp

Plataforma web responsiva de alta performance projetada para exibição, seleção de tamanho/cor e envio de pedidos de roupas e vestuário com checkout direto para o WhatsApp, rastreamento de origens (UTM) e painel administrativo de gestão.

---

## 📌 Estado Atual do Projeto & O Que Foi Feito

- **Vitrine Pública Concluída:** Busca textual, filtros de categorias, visualização de cards com desconto (% OFF), galeria de imagens, seletor de cores, tamanhos e quantidades.
- **Carrinho Interativo & Checkout Anti-Perda:** Carrinho flutuante em gaveta (Drawer), formulário de cliente/observações e gravação anti-perda dos dados do pedido antes do redirecionamento para o WhatsApp (`wa.me`).
- **Rastreamento de Origem (UTM):** Captura automática de parâmetros `ref`, `utm_source`, `utm_medium` e `utm_campaign` com vínculo direto a cada pedido enviado.
- **Painel Administrativo:** Gestão de catálogo de roupas (cadastro, edição, fotos, tamanhos e cores), gestão de carrinhos e pedidos recebidos (alteração de status: `pendente`, `em_atendimento`, `concluido`, `cancelado`) e gerador de links rastreados.
- **Modo Mock / Offline:** Como a conta do Firebase ainda não foi criada, os serviços operam em modo de demonstração gracioso utilizando dados locais (`localStorage`), permitindo testar 100% da aplicação.
- **Validação de Build:** O projeto passou por validação completa via `npm run build` com 0 erros.
- **Conta GitHub Verificada:** CLI autenticada na conta `Pex058` (`pauloedu1985@gmail.com`).

---

## 🛠️ Como Executar o Projeto Localmente

```bash
# Entrar na pasta do frontend
cd SixStore/frontend

# Iniciar o servidor de desenvolvimento
npm run dev

# Testar compilação de produção
npm run build
```

---

## 🚀 Como Continuar na Próxima Sessão

1. **Quando criar a conta Firebase:**
   - Crie um novo projeto no console do Firebase.
   - Copie as credenciais da aplicação Web e crie o arquivo `frontend/.env` baseado no `.env.example`:
     ```env
     VITE_FIREBASE_API_KEY=sua_api_key
     VITE_FIREBASE_AUTH_DOMAIN=sixstore.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=sixstore
     VITE_FIREBASE_STORAGE_BUCKET=sixstore.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
     VITE_WHATSAPP_NUMBER=5511999999999
     ```
2. **Inicializar Git & GitHub:**
   - Executar `git init` na pasta `SixStore`.
   - Executar `gh repo create SixStore --public --source=. --remote=origin --push`.
3. **Deploy no Firebase Hosting:**
   - Executar `firebase login` e `firebase deploy` para colocar a vitrine online.

---

## 📋 Documentação e Rastreamento
- 📜 [CHANGELOG.md](./changelog.md) - Histórico completo de modificações
- 📋 [tasks.md](./tasks.md) - Lista de tarefas e ponto de parada
- 📄 [DOC_VITRINE_ROUPAS.md](../SistemaBGS/DOC_VITRINE_ROUPAS.md) - Documento de Especificação Técnica de Origem
