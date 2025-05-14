-- Migration: 20240803125500_initial_schema.sql
-- Description: Initial database schema for Crypto Confession application
-- This migration creates all the necessary tables, indexes, and RLS policies
-- for the cryptocurrency portfolio management application.

-- Enable pgcrypto extension for gen_random_uuid() function
create extension if not exists pgcrypto;

-- Create portfolios table
create table portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(100) not null,
  description text,
  transactions jsonb[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(user_id, name)
);

-- Create portfolio_groups table
create table portfolio_groups (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  name varchar(100) not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(portfolio_id, name)
);

-- Create positions table
create table positions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  cryptocurrency_id varchar(20) not null,
  total_amount decimal(20,8) not null,
  average_buy_price decimal(20,8) not null,
  break_even_price decimal(20,8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(portfolio_id, cryptocurrency_id)
);

-- Create position_groups table (junction table for N:M relationship)
create table position_groups (
  position_id uuid not null references positions(id) on delete cascade,
  group_id uuid not null references portfolio_groups(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (position_id, group_id)
);

-- Create transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  position_id uuid not null references positions(id) on delete cascade,
  type varchar(10) not null check (type in ('BUY', 'SELL')),
  amount decimal(20,8) not null,
  price decimal(20,8) not null,
  total_value decimal(20,8) not null,
  exchange_id varchar(50) not null,
  transaction_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Create portfolio_coins table
create table portfolio_coins (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references portfolios(id) on delete cascade,
  ticker varchar(20) not null,
  type varchar(10) not null check (type in ('buy', 'sell')),
  amount decimal(20,8) not null check (amount > 0),
  price decimal(20,8) not null check (price > 0),
  currency varchar(10) not null check (currency in ('USD', 'USDT', 'USDC')),
  timestamp timestamptz not null,
  total_price decimal(20,8) not null check (total_price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Create price_alerts table
create table price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  position_id uuid not null references positions(id) on delete cascade,
  target_price decimal(20,8) not null,
  condition varchar(10) not null check (condition in ('ABOVE', 'BELOW')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Create audit_logs table
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name varchar(50) not null,
  record_id uuid not null,
  action varchar(10) not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Create indexes
create index idx_portfolios_user_id on portfolios(user_id);
create index idx_portfolio_groups_portfolio_id on portfolio_groups(portfolio_id);
create index idx_positions_portfolio_id on positions(portfolio_id);
create index idx_positions_cryptocurrency_id on positions(cryptocurrency_id);
create index idx_transactions_position_id on transactions(position_id);
create index idx_transactions_transaction_date on transactions(transaction_date);
create index idx_transactions_exchange_id on transactions(exchange_id);
create index idx_portfolio_coins_portfolio_id on portfolio_coins(portfolio_id);
create index idx_portfolio_coins_ticker on portfolio_coins(ticker);
create index idx_portfolio_coins_timestamp on portfolio_coins(timestamp);
create index idx_price_alerts_user_id on price_alerts(user_id);
create index idx_price_alerts_position_id on price_alerts(position_id);
create index idx_price_alerts_is_active on price_alerts(is_active);
create index idx_audit_logs_table_record on audit_logs(table_name, record_id);
create index idx_audit_logs_created_at on audit_logs(created_at);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
create trigger update_portfolios_updated_at
  before update on portfolios
  for each row
  execute function update_updated_at_column();

create trigger update_portfolio_groups_updated_at
  before update on portfolio_groups
  for each row
  execute function update_updated_at_column();

create trigger update_positions_updated_at
  before update on positions
  for each row
  execute function update_updated_at_column();

create trigger update_transactions_updated_at
  before update on transactions
  for each row
  execute function update_updated_at_column();

create trigger update_portfolio_coins_updated_at
  before update on portfolio_coins
  for each row
  execute function update_updated_at_column();

create trigger update_price_alerts_updated_at
  before update on price_alerts
  for each row
  execute function update_updated_at_column();

-- Create audit log trigger function
create or replace function audit_trigger()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into audit_logs (table_name, record_id, action, new_data, user_id)
    values (tg_table_name, new.id, 'INSERT', row_to_json(new), auth.uid());
    return new;
  elsif tg_op = 'UPDATE' then
    insert into audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    values (tg_table_name, new.id, 'UPDATE', row_to_json(old), row_to_json(new), auth.uid());
    return new;
  elsif tg_op = 'DELETE' then
    insert into audit_logs (table_name, record_id, action, old_data, user_id)
    values (tg_table_name, old.id, 'DELETE', row_to_json(old), auth.uid());
    return old;
  end if;
  return null;
end;
$$ language 'plpgsql';

-- Create audit triggers
create trigger audit_portfolios_trigger
  after insert or update or delete on portfolios
  for each row
  execute function audit_trigger();

create trigger audit_portfolio_groups_trigger
  after insert or update or delete on portfolio_groups
  for each row
  execute function audit_trigger();

create trigger audit_positions_trigger
  after insert or update or delete on positions
  for each row
  execute function audit_trigger();

create trigger audit_transactions_trigger
  after insert or update or delete on transactions
  for each row
  execute function audit_trigger();

create trigger audit_portfolio_coins_trigger
  after insert or update or delete on portfolio_coins
  for each row
  execute function audit_trigger();

create trigger audit_price_alerts_trigger
  after insert or update or delete on price_alerts
  for each row
  execute function audit_trigger();

-- Create materialized view for portfolio summary
create materialized view portfolio_summary as
select 
  p.id as portfolio_id,
  p.user_id,
  p.name as portfolio_name,
  count(distinct pos.id) as total_positions,
  sum(pos.total_amount * pos.average_buy_price) as total_invested,
  sum(pos.total_amount * coalesce(pos.break_even_price, pos.average_buy_price)) as current_value
from portfolios p
left join positions pos on p.id = pos.portfolio_id
where p.deleted_at is null and pos.deleted_at is null
group by p.id, p.user_id, p.name;

-- Create index on materialized view
create unique index idx_portfolio_summary_portfolio_id on portfolio_summary(portfolio_id);

-- Enable Row Level Security on all tables
alter table portfolios enable row level security;
alter table portfolio_groups enable row level security;
alter table positions enable row level security;
alter table position_groups enable row level security;
alter table transactions enable row level security;
alter table portfolio_coins enable row level security;
alter table price_alerts enable row level security;
alter table audit_logs enable row level security;

-- Create RLS policies for portfolios table
-- Policy for select operations - authenticated users can only see their own portfolios
create policy portfolios_select_policy
  on portfolios
  for select
  to authenticated
  using (user_id = auth.uid());

-- Policy for insert operations - authenticated users can only insert their own portfolios
create policy portfolios_insert_policy
  on portfolios
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Policy for update operations - authenticated users can only update their own portfolios
create policy portfolios_update_policy
  on portfolios
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Policy for delete operations - authenticated users can only delete their own portfolios
create policy portfolios_delete_policy
  on portfolios
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Create RLS policies for portfolio_groups table
-- Select policy
create policy portfolio_groups_select_policy
  on portfolio_groups
  for select
  to authenticated
  using (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Insert policy
create policy portfolio_groups_insert_policy
  on portfolio_groups
  for insert
  to authenticated
  with check (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Update policy
create policy portfolio_groups_update_policy
  on portfolio_groups
  for update
  to authenticated
  using (portfolio_id in (select id from portfolios where user_id = auth.uid()))
  with check (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Delete policy
create policy portfolio_groups_delete_policy
  on portfolio_groups
  for delete
  to authenticated
  using (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Create RLS policies for positions table
-- Select policy
create policy positions_select_policy
  on positions
  for select
  to authenticated
  using (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Insert policy
create policy positions_insert_policy
  on positions
  for insert
  to authenticated
  with check (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Update policy
create policy positions_update_policy
  on positions
  for update
  to authenticated
  using (portfolio_id in (select id from portfolios where user_id = auth.uid()))
  with check (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Delete policy
create policy positions_delete_policy
  on positions
  for delete
  to authenticated
  using (portfolio_id in (select id from portfolios where user_id = auth.uid()));

-- Create RLS policies for position_groups table
-- Select policy
create policy position_groups_select_policy
  on position_groups
  for select
  to authenticated
  using (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Insert policy
create policy position_groups_insert_policy
  on position_groups
  for insert
  to authenticated
  with check (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Delete policy
create policy position_groups_delete_policy
  on position_groups
  for delete
  to authenticated
  using (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Create RLS policies for transactions table
-- Select policy
create policy transactions_select_policy
  on transactions
  for select
  to authenticated
  using (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Insert policy
create policy transactions_insert_policy
  on transactions
  for insert
  to authenticated
  with check (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Update policy
create policy transactions_update_policy
  on transactions
  for update
  to authenticated
  using (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  )
  with check (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Delete policy
create policy transactions_delete_policy
  on transactions
  for delete
  to authenticated
  using (
    position_id in (
      select id from positions where portfolio_id in (
        select id from portfolios where user_id = auth.uid()
      )
    )
  );

-- Create RLS policies for portfolio_coins table
-- Select policy
create policy portfolio_coins_select_policy
  on portfolio_coins
  for select
  to authenticated
  using (
    portfolio_id in (
      select id from portfolios where user_id = auth.uid()
    )
  );

-- Insert policy
create policy portfolio_coins_insert_policy
  on portfolio_coins
  for insert
  to authenticated
  with check (
    portfolio_id in (
      select id from portfolios where user_id = auth.uid()
    )
  );

-- Update policy
create policy portfolio_coins_update_policy
  on portfolio_coins
  for update
  to authenticated
  using (
    portfolio_id in (
      select id from portfolios where user_id = auth.uid()
    )
  )
  with check (
    portfolio_id in (
      select id from portfolios where user_id = auth.uid()
    )
  );

-- Delete policy
create policy portfolio_coins_delete_policy
  on portfolio_coins
  for delete
  to authenticated
  using (
    portfolio_id in (
      select id from portfolios where user_id = auth.uid()
    )
  );

-- Create RLS policies for price_alerts table
-- Select policy
create policy price_alerts_select_policy
  on price_alerts
  for select
  to authenticated
  using (user_id = auth.uid());

-- Insert policy
create policy price_alerts_insert_policy
  on price_alerts
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Update policy
create policy price_alerts_update_policy
  on price_alerts
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Delete policy
create policy price_alerts_delete_policy
  on price_alerts
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Create RLS policies for audit_logs table - only allow select for authenticated users on their own data
create policy audit_logs_select_policy
  on audit_logs
  for select
  to authenticated
  using (user_id = auth.uid()); 