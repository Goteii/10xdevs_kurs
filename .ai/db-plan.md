# Database Schema for Crypto Confession

## 1. Lista tabel z ich kolumnami, typami danych i ograniczeniami

### users

This table is managed by Supabase Auth.

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- email: VARCHAR(255), UNIQUE, NOT NULL
- username: VARCHAR(50), UNIQUE, NOT NULL
- password_hash: VARCHAR(255), NOT NULL
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- deleted_at: TIMESTAMPTZ, NULL

---

### portfolios

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- user_id: UUID, NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE
- name: VARCHAR(100), NOT NULL
- description: TEXT, NULL
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- deleted_at: TIMESTAMPTZ, NULL
- UNIQUE(user_id, name)

---

### portfolio_groups

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- portfolio_id: UUID, NOT NULL, FOREIGN KEY → portfolios(id) ON DELETE CASCADE
- name: VARCHAR(100), NOT NULL
- description: TEXT, NULL
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- deleted_at: TIMESTAMPTZ, NULL
- UNIQUE(portfolio_id, name)

---

### positions

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- portfolio_id: UUID, NOT NULL, FOREIGN KEY → portfolios(id) ON DELETE CASCADE
- cryptocurrency_id: VARCHAR(20), NOT NULL
- total_amount: DECIMAL(20,8), NOT NULL
- average_buy_price: DECIMAL(20,8), NOT NULL
- break_even_price: DECIMAL(20,8), NULL
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- deleted_at: TIMESTAMPTZ, NULL
- UNIQUE(portfolio_id, cryptocurrency_id)

---

### position_groups (łącząca N:M)

- position_id: UUID, NOT NULL, FOREIGN KEY → positions(id) ON DELETE CASCADE
- group_id: UUID, NOT NULL, FOREIGN KEY → portfolio_groups(id) ON DELETE CASCADE
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- PRIMARY KEY (position_id, group_id)

---

### transactions

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- position_id: UUID, NOT NULL, FOREIGN KEY → positions(id) ON DELETE CASCADE
- type: VARCHAR(10), NOT NULL, CHECK (type IN ('BUY', 'SELL'))
- amount: DECIMAL(20,8), NOT NULL
- price: DECIMAL(20,8), NOT NULL
- total_value: DECIMAL(20,8), NOT NULL
- exchange_id: VARCHAR(50), NOT NULL
- transaction_date: TIMESTAMPTZ, NOT NULL
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- deleted_at: TIMESTAMPTZ, NULL

---

### price_alerts

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- user_id: UUID, NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE
- position_id: UUID, NOT NULL, FOREIGN KEY → positions(id) ON DELETE CASCADE
- target_price: DECIMAL(20,8), NOT NULL
- condition: VARCHAR(10), NOT NULL, CHECK (condition IN ('ABOVE', 'BELOW'))
- is_active: BOOLEAN, NOT NULL, DEFAULT true
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- deleted_at: TIMESTAMPTZ, NULL

---

### audit_logs

- id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
- table_name: VARCHAR(50), NOT NULL
- record_id: UUID, NOT NULL
- action: VARCHAR(10), NOT NULL, CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
- old_data: JSONB, NULL
- new_data: JSONB, NULL
- user_id: UUID, NULL, FOREIGN KEY → users(id)
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()

---

## 2. Relacje między tabelami

- users 1:N portfolios
- users 1:N price_alerts
- portfolios 1:N portfolio_groups
- portfolios 1:N positions
- portfolio_groups N:M positions (przez position_groups)
- positions 1:N transactions
- positions N:M portfolio_groups (przez position_groups)
- positions 1:N price_alerts
- transactions N:1 positions

## 3. Indeksy

- users: email (UNIQUE), username (UNIQUE)
- portfolios: user_id, name (UNIQUE per user)
- portfolio_groups: portfolio_id, name (UNIQUE per portfolio)
- positions: portfolio_id, cryptocurrency_id (UNIQUE per portfolio), cryptocurrency_id
- transactions: position_id, transaction_date, exchange_id
- price_alerts: user_id, position_id, is_active
- audit_logs: table_name, record_id, created_at

## 4. Zasady PostgreSQL (RLS)

- Włączyć RLS na wszystkich tabelach powiązanych z użytkownikiem (users, portfolios, portfolio_groups, positions, position_groups, transactions, price_alerts)
- Przykładowe polityki:
  - users: id = auth.uid()
  - portfolios: user_id = auth.uid()
  - portfolio_groups: portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  - positions: portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  - position_groups: position_id IN (SELECT id FROM positions WHERE portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()))
  - transactions: position_id IN (SELECT id FROM positions WHERE portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid()))
  - price_alerts: user_id = auth.uid()

## 5. Wszelkie dodatkowe uwagi lub wyjaśnienia dotyczące decyzji projektowych

- Soft delete przez kolumnę deleted_at (NULL = aktywny rekord)
- Wszystkie wartości finansowe jako DECIMAL(20,8) dla precyzji
- Timestamps jako TIMESTAMPTZ (jedna strefa czasowa)
- Audit log dla wszystkich operacji INSERT/UPDATE/DELETE
- Materializowane widoki do agregacji portfela (np. portfolio_summary)
- Przygotowanie pod obsługę wielu giełd (exchange_id w transakcjach)
- Wersjonowanie danych przez audit_logs
- Indeksy na najczęściej wyszukiwanych kolumnach
- Foreign key constraints z ON DELETE CASCADE dla spójności
- CHECK constraints dla typów i statusów
- Triggery do aktualizacji updated_at i logowania audytu
