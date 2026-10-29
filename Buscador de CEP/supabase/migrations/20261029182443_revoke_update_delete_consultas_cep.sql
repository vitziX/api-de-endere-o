/*
# Restringir permissões do histórico de CEP

1. Tabelas alteradas
- `consultas_cep`: remove as permissões de edição (UPDATE) e exclusão (DELETE) concedidas por padrão do banco a `anon` e `authenticated`.

2. Segurança
- Após esta migração, o público só pode consultar (SELECT) e adicionar (INSERT) registros no histórico.
- A tabela `clientes` não é afetada.

3. Notas importantes
- A operação REVOKE é idempotente e pode ser reexecutada com segurança.
*/

REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON consultas_cep FROM anon, authenticated;
