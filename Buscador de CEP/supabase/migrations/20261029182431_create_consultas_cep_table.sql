/*
# Histórico de consultas de CEP

1. Novas Tabelas
- `consultas_cep`
  - `id` (uuid, chave primária, gerado automaticamente)
  - `cep` (text, obrigatório) - CEP consultado
  - `logradouro`, `complemento`, `bairro`, `localidade`, `uf`, `ibge`, `ddd`, `siafi` (text, opcionais) - dados retornados pela ViaCEP
  - `created_at` (timestamptz) - data e hora da consulta, preenchida automaticamente

2. Tabelas alteradas
- Nenhuma. A tabela `clientes` e seus dados não são modificados.

3. Segurança
- RLS habilitado em `consultas_cep`.
- Permissões concedidas apenas para leitura (SELECT) e inserção (INSERT) a `anon` e `authenticated`, pois o app não tem login.
- Não há permissão de UPDATE nem DELETE, então o histórico não pode ser alterado nem apagado pelo app.

4. Notas importantes
- A migração usa IF NOT EXISTS e DROP POLICY IF EXISTS, podendo ser reexecutada com segurança.
*/

CREATE TABLE IF NOT EXISTS consultas_cep (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cep text NOT NULL,
  logradouro text,
  complemento text,
  bairro text,
  localidade text,
  uf text,
  ibge text,
  ddd text,
  siafi text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultas_cep ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON consultas_cep TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_consultas_cep" ON consultas_cep;
CREATE POLICY "anon_select_consultas_cep" ON consultas_cep FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_consultas_cep" ON consultas_cep;
CREATE POLICY "anon_insert_consultas_cep" ON consultas_cep FOR INSERT
  TO anon, authenticated WITH CHECK (true);
