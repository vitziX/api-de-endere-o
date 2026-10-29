-- Buscador de CEP: tabela de histórico usando o esquema entregue pelo Bolt.
-- Execute apenas se a tabela consultas_cep ainda não existir no projeto Supabase conectado.
-- Este histórico é compartilhado pelos visitantes (sem login); contém consultas de CEP, não dados de clientes.

create extension if not exists pgcrypto;

create table if not exists public.consultas_cep (
  id uuid primary key default gen_random_uuid(),
  cep text not null,
  logradouro text,
  complemento text,
  bairro text,
  localidade text,
  uf text,
  ibge text,
  ddd text,
  siafi text,
  created_at timestamptz default now()
);

alter table public.consultas_cep enable row level security;

-- Remove policy names used by earlier drafts so no leftover DELETE policy remains.
drop policy if exists "public_read_consultas_cep" on public.consultas_cep;
drop policy if exists "public_insert_consultas_cep" on public.consultas_cep;
drop policy if exists "public_delete_consultas_cep" on public.consultas_cep;
drop policy if exists "anon_select_consultas_cep" on public.consultas_cep;
drop policy if exists "anon_insert_consultas_cep" on public.consultas_cep;

revoke all on public.consultas_cep from anon, authenticated;
grant select, insert on public.consultas_cep to anon, authenticated;
revoke update, delete, truncate, references, trigger on public.consultas_cep from anon, authenticated;

create policy "anon_select_consultas_cep" on public.consultas_cep
  for select to anon, authenticated using (true);

create policy "anon_insert_consultas_cep" on public.consultas_cep
  for insert to anon, authenticated with check (true);
