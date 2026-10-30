-- Banco do Faro no Supabase (projeto "faro", região sa-east-1).
-- Já aplicado no projeto; fica aqui como registro e para recriar o banco do zero.

-- progresso de cada pessoa: o mesmo retrato que o Faro guardava na conta do claude.ai
create table public.progresso (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  t bigint not null default 0,
  dados jsonb not null,
  atualizado timestamptz not null default now(),
  constraint progresso_tamanho check (pg_column_size(dados) < 3000000)
);
alter table public.progresso enable row level security;
create policy "ver o próprio progresso" on public.progresso for select to authenticated using ((select auth.uid()) = user_id);
create policy "criar o próprio progresso" on public.progresso for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "mudar o próprio progresso" on public.progresso for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ranking: só quem entra nele; todos com conta veem, cada um mexe só na própria linha
create table public.ranking (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  dados jsonb not null,
  atualizado timestamptz not null default now(),
  constraint ranking_tamanho check (pg_column_size(dados) < 60000)
);
alter table public.ranking enable row level security;
create policy "ver o ranking" on public.ranking for select to authenticated using (true);
create policy "entrar no ranking" on public.ranking for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "atualizar a própria linha" on public.ranking for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "sair do ranking" on public.ranking for delete to authenticated using ((select auth.uid()) = user_id);

-- a hora da última mudança vem do servidor, não do aparelho
create function public.marcar_atualizado() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.atualizado := now();
  return new;
end $$;
create trigger progresso_atualizado before insert or update on public.progresso for each row execute function public.marcar_atualizado();
create trigger ranking_atualizado before insert or update on public.ranking for each row execute function public.marcar_atualizado();

-- apagar a própria conta (e, em cascata, o progresso e a linha do ranking)
create function public.apagar_conta() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke execute on function public.apagar_conta() from public, anon;
grant execute on function public.apagar_conta() to authenticated;

-- avisos em tempo real: outro aparelho salvou, alguém mudou no ranking
alter publication supabase_realtime add table public.progresso, public.ranking;

-- trazer progresso da versão do claude.ai: o site chama logo depois de entrar;
-- se houver uma linha em importar com o e-mail da conta, ela vira o progresso da conta
create table public.importar (
  email text primary key,
  partes text[] not null default '{}'
);
alter table public.importar enable row level security;

create function public.importar_meu_progresso() returns boolean
language plpgsql security definer set search_path = '' as $$
declare em text := lower(coalesce(auth.jwt() ->> 'email', '')); txt text; d jsonb; n int;
begin
  if auth.uid() is null or em = '' then return false; end if;
  select array_to_string(partes, '') into txt from public.importar where email = em;
  if txt is null then return false; end if;
  d := txt::jsonb;
  insert into public.progresso (user_id, t, dados) values (auth.uid(), coalesce((d->>'t')::bigint, 0), d)
    on conflict (user_id) do nothing;
  get diagnostics n = row_count;
  if n = 1 then delete from public.importar where email = em; end if;
  return n = 1;
end $$;
revoke execute on function public.importar_meu_progresso() from public, anon;
grant execute on function public.importar_meu_progresso() to authenticated;
