# Memora — Frontend (demo)

Projeto front-end demonstrativo chamado "Memora": uma rede social focada em memórias e timelines pessoais. O propósito deste repositório é oferecer uma interface funcional com persistência local (localStorage) para demonstração e desenvolvimento local.

## Recursos incluídos
- Autenticação mock (email/senha + login Google fictício)
- Feed com memórias (persistidas em `localStorage`)
- Criar memória (upload local, importação mock de redes sociais)
- Página de detalhes da memória com comentários
- Perfil do usuário listando memórias
- Toasters simples e skeletons para feedback e carregamento

## Pré-requisitos
- Node.js (14+ recomendado)
- pnpm (recomendado) — mas `npm` também funciona

## Instalação e execução (PowerShell)
```powershell
pnpm install
pnpm run dev
```

Abra o navegador em `http://localhost:5173` (ou na URL informada pelo Vite).

## Notas de implementação
- Persistência: memórias e comentários são salvos em `localStorage` sob a chave `memora_memories`.
- Eventos: quando memórias são salvas, um evento customizado `memora-change` é disparado para atualizar o feed em tempo real na aba do navegador.
- IDs: o gerador de ID usa um helper em `src/utils/storage.ts` (sem dependências externas).

## Desenvolvimento
- Faça alterações nos arquivos dentro de `src/` e o Vite recarregará automaticamente.
- Para testar múltiplos usuários, modifique o objeto `memora_user` em `localStorage` (ex.: usando o DevTools) ou crie/registre novos usuários na UI mock.

## Próximos passos (sugestões)
- Integrar backend real para persistência e autenticação OAuth.
- Subir imagens para um serviço externo (S3/Cloudinary).
- Melhorar UX: animações, toasts mais sofisticados, testes.

## Contato
Este é um demo local. Para dúvidas, abra uma issue ou modifique o projeto conforme necessário.
