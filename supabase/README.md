# Supabase Setup for Crypto Confession

This directory contains configuration and migration files for the Supabase backend of the Crypto Confession application.

## Setup Instructions

### Local Development

1. Install the Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Start the local Supabase instance:

   ```bash
   supabase start
   ```

3. Apply migrations:

   ```bash
   supabase db reset
   ```

4. Get the local URL and anon key:

   ```bash
   supabase status
   ```

5. Create a `.env` file in the root directory with the following content:
   ```
   PUBLIC_SUPABASE_URL=your_local_supabase_url
   PUBLIC_SUPABASE_KEY=your_local_supabase_anon_key
   ```

### Creating New Migrations

1. Make sure your local Supabase instance is running
2. Create a new migration file:
   ```bash
   supabase migration new your_migration_name
   ```
3. Edit the generated file in `supabase/migrations/`
4. Apply the migration:
   ```bash
   supabase db reset
   ```

## Database Schema Overview

The database schema includes the following tables:

- **portfolios**: User portfolios
- **portfolio_groups**: Groups for organizing positions within portfolios
- **positions**: Cryptocurrency positions in portfolios
- **position_groups**: Junction table for many-to-many relationship between positions and groups
- **transactions**: Buy/sell transactions for positions
- **price_alerts**: User alerts for price movements
- **audit_logs**: System-wide audit logging

## Data Security

Row Level Security (RLS) is enabled on all tables to ensure users can only access their own data. Each table has separate policies for SELECT, INSERT, UPDATE, and DELETE operations.

## Materialized Views

- **portfolio_summary**: Provides aggregated data about portfolios including total positions, total invested amount, and current value.

## Backup Strategy

Daily backups are required as specified in the project requirements. In production, this should be configured using Supabase's backup functionality or a custom backup solution.
