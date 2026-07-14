-- LESA Çekirdek Veritabanı v1
create extension if not exists "pgcrypto";

create type public.app_role as enum ('owner','board','general_manager','sales','planning','accounting','production','quality','service','viewer');
create type public.record_status as enum ('new','in_review','waiting_approval','approved','rejected','won','lost','cancelled','completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'viewer',
  department text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  customer_type text,
  city text,
  country text default 'Türkiye',
  tax_no text,
  email text,
  phone text,
  payment_risk text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  series text not null,
  name_tr text not null,
  name_en text,
  meter_type text,
  dn text,
  length_mm numeric,
  flow_value text,
  range_ratio text,
  temperature_class text,
  communication text[],
  certificates text[],
  warranty_months integer not null default 24,
  battery_life_years numeric,
  is_in_production boolean not null default true,
  lead_time_days integer,
  notes text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_type text not null,
  file_path text,
  valid_from date,
  valid_until date,
  product_id uuid references public.products(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.tenders (
  id uuid primary key default gen_random_uuid(),
  ikn text unique,
  authority text not null,
  title text not null,
  publication_date date,
  tender_date timestamptz,
  status public.record_status not null default 'new',
  priority text default 'medium',
  estimated_value numeric,
  currency text default 'TRY',
  technical_score numeric,
  commercial_risk text,
  owner_id uuid references public.profiles(id),
  next_action text,
  next_action_date date,
  source_url text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.tender_items (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  line_no integer,
  description text not null,
  quantity numeric,
  unit text,
  suggested_product_id uuid references public.products(id),
  compliance_status text,
  compliance_score numeric,
  created_at timestamptz not null default now()
);

create table public.tender_criteria (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  clause_no text,
  clause_text text not null,
  category text,
  required_value text,
  product_value text,
  result text,
  risk_level text,
  evidence_document_id uuid references public.documents(id),
  ai_explanation text,
  human_approval text,
  created_at timestamptz not null default now()
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_no text unique not null,
  customer_id uuid references public.customers(id),
  tender_id uuid references public.tenders(id),
  quote_date date not null default current_date,
  valid_until date,
  subtotal numeric not null default 0,
  tax_total numeric not null default 0,
  grand_total numeric not null default 0,
  currency text not null default 'EUR',
  payment_terms text,
  lead_time text,
  status public.record_status not null default 'new',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  customer_id uuid references public.customers(id),
  quote_id uuid references public.quotes(id),
  order_date date not null default current_date,
  promised_date date,
  status public.record_status not null default 'new',
  production_progress numeric not null default 0 check (production_progress between 0 and 100),
  shipment_date date,
  invoice_date date,
  owner_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text unique not null,
  order_id uuid references public.orders(id),
  customer_id uuid references public.customers(id),
  invoice_date date not null,
  due_date date not null,
  amount numeric not null,
  collected_amount numeric not null default 0,
  currency text not null default 'TRY',
  created_at timestamptz not null default now()
);



create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  product_id uuid references public.products(id),
  description text not null,
  quantity numeric not null default 1,
  unit text not null default 'Adet',
  unit_price numeric not null default 0,
  discount_rate numeric not null default 0,
  total numeric generated always as (quantity * unit_price * (1 - discount_rate / 100)) stored,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  description text not null,
  quantity numeric not null,
  produced_quantity numeric not null default 0,
  accepted_quantity numeric not null default 0,
  created_at timestamptz not null default now()
);

create table public.production_plans (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  planned_start date,
  planned_finish date,
  actual_start date,
  actual_finish date,
  planned_quantity numeric,
  produced_quantity numeric not null default 0,
  quality_status text default 'waiting',
  status text default 'planned',
  owner_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  payment_date date not null,
  amount numeric not null,
  currency text not null default 'TRY',
  payment_method text,
  reference_no text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.warranties (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  customer_id uuid references public.customers(id),
  product_id uuid references public.products(id),
  serial_no text,
  invoice_date date not null,
  start_date date generated always as (invoice_date) stored,
  end_date date not null,
  status text default 'active',
  extra_warranty_offered boolean not null default false,
  owner_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create table public.guarantees (
  id uuid primary key default gen_random_uuid(),
  guarantee_type text not null,
  reference_type text,
  reference_id uuid,
  institution text not null,
  document_no text,
  amount numeric,
  currency text default 'TRY',
  start_date date,
  end_date date,
  status text,
  owner_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create table public.service_records (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  product_id uuid references public.products(id),
  serial_no text,
  invoice_date date,
  fault_date date not null default current_date,
  fault_description text not null,
  probable_cause text,
  root_cause text,
  action_taken text,
  result text,
  cost numeric,
  is_repeat boolean not null default false,
  development_opportunity text,
  owner_id uuid references public.profiles(id),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  source_module text,
  reference_id uuid,
  title text not null,
  description text,
  department text,
  owner_id uuid references public.profiles(id),
  priority text not null default 'medium',
  due_date date,
  status public.record_status not null default 'new',
  progress numeric not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Güvenlik: kullanıcı oturum açmadan veri okunamaz.
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.documents enable row level security;
alter table public.tenders enable row level security;
alter table public.tender_items enable row level security;
alter table public.tender_criteria enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;
alter table public.invoices enable row level security;
alter table public.quote_items enable row level security;
alter table public.order_items enable row level security;
alter table public.production_plans enable row level security;
alter table public.payments enable row level security;
alter table public.warranties enable row level security;
alter table public.guarantees enable row level security;
alter table public.service_records enable row level security;
alter table public.tasks enable row level security;

create policy "authenticated_read_products" on public.products for select to authenticated using (true);
create policy "authenticated_read_customers" on public.customers for select to authenticated using (true);
create policy "authenticated_read_tenders" on public.tenders for select to authenticated using (true);
create policy "authenticated_read_tasks" on public.tasks for select to authenticated using (true);

-- İlk veri örnekleri
insert into public.products (code, series, name_tr, meter_type, dn, length_mm, flow_value, range_ratio, temperature_class, communication, certificates, lead_time_days)
values
('CM-HR1','CM-HR','Ultrasonik Kalorimetre M-Bus','Isı Sayacı','DN15',110,'Qp 1,5','50-100','Isıtma/Soğutma',array['M-Bus'],array['PTB'],28),
('CM-HR2','CM-HR','Ultrasonik Kalorimetre M-Bus','Isı Sayacı','DN20',130,'Qp 2,5','50-100','Isıtma/Soğutma',array['M-Bus'],array['PTB'],28),
('KT14','KT','Tek Hüzmeli Kuru Tip Su Sayacı','Su Sayacı','DN20',130,'Q3 2,5','R80/R100/R160','T90',array['M-Bus','Pulse'],array['MID'],21),
('KDM5','KDM','Çok Hüzmeli Kuru Soğuk Su Sayacı','Su Sayacı','DN20',190,'Q3 2,5','R100/R125/R160','Soğuk',array['M-Bus','Pulse'],array['MID'],21),
('VD5E','VDE','Volümetrik Soğuk Su Sayacı','Su Sayacı','DN20',190,'Q3 2,5','R160-R400','Soğuk',array['M-Bus','Pulse'],array['MID'],28)
on conflict (code) do nothing;


-- Yeni kullanıcı için otomatik profil oluşturma
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Kullanıcı'), 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- İlk sürüm kullanım politikaları: oturum açmış kullanıcılar okuyabilir ve kayıt ekleyip güncelleyebilir.
-- Rol bazlı daha sıkı yetkilendirme, sonraki sprintte profiles.role alanına göre daraltılacaktır.
do $$
declare
  t text;
begin
  foreach t in array array['profiles','customers','products','documents','tenders','tender_items','tender_criteria','quotes','quote_items','orders','order_items','production_plans','invoices','payments','guarantees','warranties','service_records','tasks']
  loop
    execute format('drop policy if exists authenticated_select on public.%I', t);
    execute format('drop policy if exists authenticated_insert on public.%I', t);
    execute format('drop policy if exists authenticated_update on public.%I', t);
    execute format('create policy authenticated_select on public.%I for select to authenticated using (true)', t);
    execute format('create policy authenticated_insert on public.%I for insert to authenticated with check (true)', t);
    execute format('create policy authenticated_update on public.%I for update to authenticated using (true) with check (true)', t);
  end loop;
end $$;
