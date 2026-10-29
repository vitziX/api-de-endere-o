# Buscador de CEP — ViaCEP + Supabase

Projeto integrador escolar que consulta endereços pela API pública ViaCEP e registra o histórico em uma tabela PostgreSQL do Supabase. A interface mantém o visual profissional solicitado.

## Funcionalidades

- Consulta de CEP com validação, carregamento e tratamento de erros.
- Exibição de endereço e campos complementares da ViaCEP.
- Histórico compartilhado das 10 consultas mais recentes, salvo no Supabase.
- Fallback para o armazenamento local do navegador se o Supabase não estiver configurado ou indisponível.
- Layout responsivo com componentes React/TypeScript e Tailwind CSS.
- Atalho para visualizar o endereço no Google Maps.

## Tecnologias

- React 18, TypeScript e Vite
- Tailwind CSS 3 e Lucide React
- ViaCEP: `https://viacep.com.br/ws/{cep}/json/`
- Supabase (PostgreSQL) para histórico de consultas

## Variáveis de ambiente

O app utiliza `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Configure essas variáveis no seu arquivo `.env` local a partir do projeto Supabase correto. Nunca publique `.env` em um repositório público; a versão destinada ao GitHub não inclui esse arquivo. Para a Vercel, configure as duas variáveis no painel de Environment Variables.

## Banco de dados

O projeto contém as migrações entregues pelo Bolt em `supabase/migrations/`:

- `20261029182431_create_consultas_cep_table.sql`: cria `consultas_cep`, ativa RLS e permite leitura/inserção para o aplicativo sem login.
- `20261029182443_revoke_update_delete_consultas_cep.sql`: remove permissões de atualização e exclusão.

A interface foi ajustada para **não oferecer botão de apagar histórico**, pois o banco configurado pelo Bolt é de inserção/leitura (append-only). A política permite que qualquer visitante leia e insira registros. Como o projeto não exige login, o histórico é compartilhado. Não use essa política para informações pessoais ou dados de produção.

Se a tabela ainda não existir no banco remoto, execute `SUPABASE_SETUP.sql` no SQL editor do projeto Supabase conectado. O arquivo configura apenas o histórico de CEP; não altera nem exclui a tabela `clientes`.

> A presença de arquivos de migração na pasta não confirma, por si só, se eles foram aplicados no banco remoto. A conexão real precisa ser verificada por um teste de consulta e gravação no app.

## Executar localmente

Requer Node.js 18+ e npm.

```bash
npm install
npm run dev
```

Verificações de qualidade e build:

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Publicar na Vercel

1. Envie o conteúdo do projeto ao GitHub sem o arquivo `.env`.
2. Importe o repositório na Vercel usando Vite.
3. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel de Environment Variables.
4. Use `npm run build` como build command e `dist` como output directory.
5. Faça um novo deploy depois de definir as variáveis.

## Documentação da ViaCEP

- Documentação oficial: https://viacep.com.br/
- Endpoint: `GET https://viacep.com.br/ws/{cep}/json/`
- Exemplo: `https://viacep.com.br/ws/01001000/json/`
- Autenticação: não exige chave de API.
- A ViaCEP fornece os dados de endereço; o Supabase registra o histórico da consulta.
