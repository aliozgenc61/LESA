-- LESA v4 - Supabase veritabanı şeması
-- Bu dosyanın tamamını Supabase > SQL Editor > New query ekranında çalıştırın.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user',
  department text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  series text,
  name text not null,
  dn text,
  length_mm integer,
  flow_value text,
  ratio text,
  communication text,
  certification text,
  warranty_years integer default 2,
  battery_life_years integer,
  production_status text default 'Üretimde',
  lead_time_days integer,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.tenders (
  id uuid primary key default gen_random_uuid(),
  ikn text,
  institution text not null,
  project_name text,
  publication_date date,
  tender_date date,
  status text not null default 'Yeni',
  priority text default 'Orta',
  technical_compliance text default 'İnceleme Bekliyor',
  planning_review text default 'Bekliyor',
  management_decision text default 'Bekliyor',
  proposed_product text,
  quantity numeric,
  estimated_amount numeric,
  currency text default 'TRY',
  offer_amount numeric,
  owner text,
  next_action text,
  action_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  product_code text,
  quantity numeric not null default 0,
  order_date date,
  due_date date,
  production_status text default 'Planlanmadı',
  planned_quantity numeric default 0,
  produced_quantity numeric default 0,
  quality_status text default 'Bekliyor',
  shipment_date date,
  invoice_no text,
  invoice_date date,
  owner text,
  next_action text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  invoice_no text unique,
  invoice_date date,
  amount numeric not null default 0,
  currency text default 'TRY',
  due_date date,
  collected_amount numeric not null default 0,
  sales_owner text,
  last_follow_up date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.guarantees (
  id uuid primary key default gen_random_uuid(),
  record_type text not null,
  reference text,
  customer text not null,
  document_no text,
  start_date date,
  end_date date,
  amount numeric default 0,
  currency text default 'TRY',
  action text,
  owner text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_records (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  project text,
  product_code text,
  serial_no text,
  invoice_date date,
  failure_date date,
  issue text,
  probable_cause text,
  confirmed_cause text,
  action_taken text,
  result text,
  cost numeric default 0,
  owner text,
  close_date date,
  repeated boolean default false,
  improvement_opportunity text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  source_module text,
  reference text,
  title text not null,
  department text,
  owner text,
  priority text default 'Orta',
  start_date date,
  due_date date,
  status text default 'Açık',
  completion_percent integer default 0 check (completion_percent between 0 and 100),
  dependency text,
  next_step text,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.tenders enable row level security;
alter table public.orders enable row level security;
alter table public.invoices enable row level security;
alter table public.guarantees enable row level security;
alter table public.service_records enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "profiles_authenticated" on public.profiles;
create policy "profiles_authenticated" on public.profiles
for all to authenticated using (true) with check (true);

drop policy if exists "products_authenticated" on public.products;
create policy "products_authenticated" on public.products
for all to authenticated using (true) with check (true);

drop policy if exists "tenders_authenticated" on public.tenders;
create policy "tenders_authenticated" on public.tenders
for all to authenticated using (true) with check (true);

drop policy if exists "orders_authenticated" on public.orders;
create policy "orders_authenticated" on public.orders
for all to authenticated using (true) with check (true);

drop policy if exists "invoices_authenticated" on public.invoices;
create policy "invoices_authenticated" on public.invoices
for all to authenticated using (true) with check (true);

drop policy if exists "guarantees_authenticated" on public.guarantees;
create policy "guarantees_authenticated" on public.guarantees
for all to authenticated using (true) with check (true);

drop policy if exists "service_authenticated" on public.service_records;
create policy "service_authenticated" on public.service_records
for all to authenticated using (true) with check (true);

drop policy if exists "tasks_authenticated" on public.tasks;
create policy "tasks_authenticated" on public.tasks
for all to authenticated using (true) with check (true);

insert into public.products
(code, series, name, dn, length_mm, flow_value, ratio, communication, certification, warranty_years, battery_life_years, lead_time_days, notes)
values
('CM-HR1','CM-HR','Ultrasonik Kalorimetre M-Bus','DN15',110,'Qp 1,5','50-100','M-Bus','PTB',2,10,28,''),
('CM-HR2','CM-HR','Ultrasonik Kalorimetre M-Bus','DN20',130,'Qp 2,5','50-100','M-Bus','PTB',2,10,28,''),
('KT11','KT','Tek Hüzmeli Kuru Tip Su Sayacı','DN15',110,'Q3 1,6','R80/R100/R160','M-Bus/Pulse','MID',2,null,21,''),
('KT12','KT','Tek Hüzmeli Kuru Tip Su Sayacı','DN15',110,'Q3 2,5','R80/R100/R160','M-Bus/Pulse','MID',2,null,21,''),
('KT13','KT','Tek Hüzmeli Kuru Tip Su Sayacı','DN20',110,'Q3 2,5','R80/R100/R160','M-Bus/Pulse','MID',2,null,21,''),
('KT14','KT','Tek Hüzmeli Kuru Tip Su Sayacı','DN20',130,'Q3 2,5','R80/R100/R160','M-Bus/Pulse','MID',2,null,21,''),
('KDM5','KDM','Çok Hüzmeli Kuru Soğuk Su Sayacı','DN20',190,'Q3 2,5','R100/R125/R160','M-Bus/Pulse','MID',2,null,21,'İSKİ onaylı'),
('KDM8','KDM','Çok Hüzmeli Kuru Soğuk Su Sayacı','DN25',260,'Q3 6,3','R100/R125/R160','M-Bus/Pulse','MID',2,null,28,'İSKİ onaylı'),
('VD5E','VDE','Volümetrik Soğuk Su Sayacı','DN20',190,'Q3 2,5','R160-R400','M-Bus/Pulse','MID',2,null,28,'HATSU onaylı')
on conflict (code) do nothing;
