-- Products table for marketplace listings
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  crop_type text not null,
  quantity numeric not null,
  unit text not null,
  price_per_unit numeric not null,
  currency text default 'NGN',
  location_state text not null,
  location_lga text not null,
  available_from date not null,
  images text[] default '{}',
  status text not null default 'active'
    check (status in ('active', 'sold', 'draft', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone can read active products
create policy "products_read_active" on public.products
  for select to authenticated
  using (status = 'active');

-- Sellers can read their own products
create policy "products_read_own" on public.products
  for select to authenticated
  using (auth.uid() = seller_id);

-- Sellers can insert their own products
create policy "products_insert_own" on public.products
  for insert to authenticated
  with check (auth.uid() = seller_id);

-- Sellers can update their own products
create policy "products_update_own" on public.products
  for update to authenticated
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

-- Sellers can delete their own products
create policy "products_delete_own" on public.products
  for delete to authenticated
  using (auth.uid() = seller_id);

-- Indexes for performance
create index if not exists products_seller_idx on public.products(seller_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_crop_type_idx on public.products(crop_type);
create index if not exists products_location_idx on public.products(location_state);
create index if not exists products_created_idx on public.products(created_at desc);

-- Trigger to update updated_at
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();
