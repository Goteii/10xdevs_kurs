<api_analysis>

1. Main Entities from the Database Schema
   users - Managed by Supabase Auth, contains user authentication data
   > This table is managed by Supabase Auth.
   > portfolios - User's cryptocurrency portfolios
   >
   > ```
   > - id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
   > - user_id: UUID, NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE
   > - name: VARCHAR(100), NOT NULL
   > - description: TEXT, NULL
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - deleted_at: TIMESTAMPTZ, NULL
   > - UNIQUE(user_id, name)
   > ```
   >
   > portfolio_groups - Groups for organizing positions within portfolios
   >
   > ```
   > - id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
   > - portfolio_id: UUID, NOT NULL, FOREIGN KEY → portfolios(id) ON DELETE CASCADE
   > - name: VARCHAR(100), NOT NULL
   > - description: TEXT, NULL
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - deleted_at: TIMESTAMPTZ, NULL
   > - UNIQUE(portfolio_id, name)
   > ```
   >
   > positions - Cryptocurrency positions in portfolios
   >
   > ```
   > - id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
   > - portfolio_id: UUID, NOT NULL, FOREIGN KEY → portfolios(id) ON DELETE CASCADE
   > - cryptocurrency_id: VARCHAR(20), NOT NULL
   > - total_amount: DECIMAL(20,8), NOT NULL
   > - average_buy_price: DECIMAL(20,8), NOT NULL
   > - break_even_price: DECIMAL(20,8), NULL
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - deleted_at: TIMESTAMPTZ, NULL
   > - UNIQUE(portfolio_id, cryptocurrency_id)
   > ```
   >
   > position_groups - Junction table for many-to-many relationship between positions and groups
   >
   > ```
   > - position_id: UUID, NOT NULL, FOREIGN KEY → positions(id) ON DELETE CASCADE
   > - group_id: UUID, NOT NULL, FOREIGN KEY → portfolio_groups(id) ON DELETE CASCADE
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - PRIMARY KEY (position_id, group_id)
   > ```
   >
   > transactions - Buy/sell transactions for positions
   >
   > ```
   > - id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
   > - position_id: UUID, NOT NULL, FOREIGN KEY → positions(id) ON DELETE CASCADE
   > - type: VARCHAR(10), NOT NULL, CHECK (type IN ('BUY', 'SELL'))
   > - amount: DECIMAL(20,8), NOT NULL
   > - price: DECIMAL(20,8), NOT NULL
   > - total_value: DECIMAL(20,8), NOT NULL
   > - exchange_id: VARCHAR(50), NOT NULL
   > - transaction_date: TIMESTAMPTZ, NOT NULL
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - deleted_at: TIMESTAMPTZ, NULL
   > ```
   >
   > price_alerts - User alerts for price movements
   >
   > ```
   > - id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
   > - user_id: UUID, NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE
   > - position_id: UUID, NOT NULL, FOREIGN KEY → positions(id) ON DELETE CASCADE
   > - target_price: DECIMAL(20,8), NOT NULL
   > - condition: VARCHAR(10), NOT NULL, CHECK (condition IN ('ABOVE', 'BELOW'))
   > - is_active: BOOLEAN, NOT NULL, DEFAULT true
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > - deleted_at: TIMESTAMPTZ, NULL
   > ```
   >
   > audit_logs - System-wide audit logging
   >
   > ```
   > - id: UUID, PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid()
   > - table_name: VARCHAR(50), NOT NULL
   > - record_id: UUID, NOT NULL
   > - action: VARCHAR(10), NOT NULL, CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
   > - old_data: JSONB, NULL
   > - new_data: JSONB, NULL
   > - user_id: UUID, NULL, FOREIGN KEY → users(id)
   > - created_at: TIMESTAMPTZ, NOT NULL, DEFAULT now()
   > ```
   >
   > portfolio_summary - Materialized view for portfolio summary
   >
   > ```
   > - portfolio_id: string | null
   > - user_id: string | null
   > - portfolio_name: string | null
   > - total_positions: number | null
   > - total_invested: string | null
   > - current_value: string | null
   > ```
2. Key Business Logic Features from PRD
   Portfolio Management - Display list of owned cryptocurrencies with metrics
   > "Displaying list of owned cryptocurrencies, table with metrics:
   >
   > - Asset (cryptocurrency name)
   > - Price (current price)
   > - 24h change (percentage change in the last 24h)
   > - Daily profit (profit/loss from the last 24h)
   > - Total invested (total invested amount)
   > - Average price (average purchase price)
   > - Current profit (current profit/loss)
   > - Break-even calculator"
   >   Exchange Integration - Fetching real-time price data
   >   "- Fetching price data from exchange API
   >
   > * List of available cryptocurrencies
   > * Ability to add new positions to portfolio"
   >   Historical Transaction Import - Importing transaction history
   >   "Import of historical transactions"
   >   Cryptocurrency Grouping - Grouping cryptocurrencies in portfolio
   >   "Grouping cryptocurrencies"
   >   Price Alerts - Notifications about price changes
   >   "Price change notification system"
   >   Break-even Calculator - Calculate how much to sell to recover initial investment
   >   "Calculate how much needs to be sold to recover the invested capital"
   >   Multiple Exchanges Support (future) - Switch between exchanges in case of issues
   >   "Possibility to switch between exchanges in case of problems"
3. Mapping PRD Features to API Endpoints
   Portfolio Management
   Option 1: GET /portfolios/{id} - Get single portfolio with positions and metrics
   Option 2: GET /portfolios/{id}/positions with query params for metrics
   Decision: Use both endpoints. The first for basic portfolio info, the second for detailed position data with metrics. This separation allows for better caching and pagination of positions.
   Exchange Integration
   Option 1: GET /cryptocurrencies - Get list of available cryptocurrencies
   Option 2: GET /exchanges/{id}/cryptocurrencies - Get cryptocurrencies from specific exchange
   Decision: Use option 2 since the PRD mentions possible future support for multiple exchanges, making the API more future-proof.
   Transaction Management
   Option 1: POST /positions/{id}/transactions - Add transaction to position
   Option 2: POST /transactions with position_id in request body
   Decision: Use option 1 as it better represents the resource hierarchy and the RESTful relationship between positions and transactions.
   Historical Transaction Import
   Option 1: POST /portfolios/{id}/import with file upload
   Option 2: POST /import/transactions with portfolio_id in request body
   Decision: Use option 1 as it's more RESTful and clearly indicates which portfolio we're importing into.
   Cryptocurrency Grouping
   Option 1: POST /portfolio-groups/{id}/positions - Add position to group
   Option 2: POST /positions/{id}/groups - Add group to position
   Decision: Use both, as the many-to-many relationship requires bidirectional access. This gives flexibility in how clients manage the relationship.
   Price Alerts
   Option 1: POST /price-alerts with position_id in request body
   Option 2: POST /positions/{id}/price-alerts - Create alert for position
   Decision: Use option 2 as it's more RESTful and clearly indicates the relationship between positions and alerts.
   Break-even Calculator
   Option 1: GET /positions/{id}/break-even - Get break-even calculation for position
   Option 2: Embed break-even calculation in position response
   Decision: Use option 1 to separate this calculation, as it may be computationally expensive and not always needed.
4. Security and Performance Requirements
   Authentication and Authorization
   > The database schema includes: "Row Level Security (RLS) is enabled on all tables to ensure users can only access their own data."
   > This indicates we need proper authentication and authorization in our API. Supabase Auth is used for user management.
   > Data Validation
   > Multiple CHECK constraints are in place for fields like type in transactions and condition in price_alerts.
   > API validation should enforce these constraints before attempting database operations.
   > Soft Delete
   > All main tables have a deleted_at column, indicating soft delete functionality.
   > API should support soft deletion and ensure queries filter out soft-deleted records by default.
   > Performance Requirements
   > From PRD: "API response time < 2 seconds", "System availability > 99.9%", "Data update time < 1 minute"
   > These metrics affect our API design, requiring pagination, efficient queries, and potentially caching.
   > Scalability
   > "Handling minimum 1000 concurrent users", "Handling minimum 10000 transactions daily", "Interface response time < 1 second"
   > These require proper API rate limiting, caching, and efficient database queries.
   > Data Accuracy
   > "100% price data accuracy", "100% calculation correctness", "100% historical data completeness"
   > API must ensure data integrity and proper validation of inputs/outputs.
   > Security
   > "Daily data backups", "Sensitive data encryption", "Secure user data storage"
   > API must handle data securely, with proper encryption for sensitive data.
5. Mapping Business Logic to API Endpoints
   Portfolio Management
   GET /portfolios - List user portfolios
   GET /portfolios/{id} - Get portfolio details
   GET /portfolios/{id}/positions - Get positions with metrics
   POST /portfolios - Create new portfolio
   PUT /portfolios/{id} - Update portfolio
   DELETE /portfolios/{id} - Delete portfolio (soft)
   Exchange Integration
   GET /exchanges - List available exchanges
   GET /exchanges/{id}/cryptocurrencies - List cryptocurrencies from exchange
   GET /exchanges/{id}/prices - Get real-time prices
   GET /exchanges/{id}/prices/{crypto_id} - Get specific cryptocurrency price
   Transaction Management
   GET /positions/{id}/transactions - List transactions for position
   POST /positions/{id}/transactions - Add transaction to position
   PUT /positions/{id}/transactions/{transaction_id} - Update transaction
   DELETE /positions/{id}/transactions/{transaction_id} - Delete transaction (soft)
   Historical Transaction Import
   POST /portfolios/{id}/import - Import transactions from file
   Cryptocurrency Grouping
   GET /portfolio-groups - List portfolio groups
   GET /portfolio-groups/{id} - Get group details with positions
   POST /portfolio-groups - Create new group
   PUT /portfolio-groups/{id} - Update group
   DELETE /portfolio-groups/{id} - Delete group (soft)
   POST /portfolio-groups/{id}/positions - Add position to group
   DELETE /portfolio-groups/{id}/positions/{position_id} - Remove position from group
   Price Alerts
   GET /price-alerts - List user's price alerts
   GET /positions/{id}/price-alerts - Get alerts for position
   POST /positions/{id}/price-alerts - Create alert for position
   PUT /price-alerts/{id} - Update alert
   DELETE /price-alerts/{id} - Delete alert (soft)
   Break-even Calculator
   GET /positions/{id}/break-even - Get break-even calculation
6. Validation Rules from Database Schema
   Portfolios
   name is required and must be unique per user
   Soft delete via deleted_at
   Portfolio Groups
   name is required and must be unique per portfolio
   Soft delete via deleted_at
   Positions
   cryptocurrency_id must be valid and unique per portfolio
   total_amount and average_buy_price are required and must be numeric
   Soft delete via deleted_at
   Transactions
   type must be either 'BUY' or 'SELL'
   amount, price, and total_value are required and must be numeric
   transaction_date is required
   Soft delete via deleted_at
   Price Alerts
   target_price is required and must be numeric
   condition must be either 'ABOVE' or 'BELOW'
   is_active is a boolean
   Soft delete via deleted_at
   </api_analysis>
