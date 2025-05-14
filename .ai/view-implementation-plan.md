# API Endpoint Implementation Plan: Portfolio Management API

## 1. Przegląd punktu końcowego

API do zarządzania portfelami kryptowalut, umożliwiające tworzenie, odczytywanie, aktualizację i usuwanie portfeli oraz zarządzanie pozycjami w portfelach. API wykorzystuje Supabase jako backend-as-a-service, zapewniając bezpieczną autentykację i autoryzację.

## 2. Szczegóły żądania

### Portfolio Endpoints

#### GET /portfolios

- Metoda HTTP: GET
- Parametry:
  - Wymagane: Brak
  - Opcjonalne:
    - search: string (wyszukiwanie po nazwie)
    - sortBy: 'name' | 'createdAt' | 'updatedAt' | 'totalValue'
    - sortOrder: 'asc' | 'desc'
    - page: number
    - pageSize: number
- Przykład żądania:
  ```http
  GET /portfolios?search=main&sortBy=totalValue&sortOrder=desc&page=1&pageSize=10
  ```

#### GET /portfolios/{id}

- Metoda HTTP: GET
- Parametry:
  - Wymagane: id (UUID)
  - Opcjonalne: Brak
- Przykład żądania:
  ```http
  GET /portfolios/123e4567-e89b-12d3-a456-426614174000
  ```

#### POST /portfolios

- Metoda HTTP: POST
- Request Body: CreatePortfolioCommand
  ```typescript
  {
    name: string;
    description?: string | null;
  }
  ```
- Przykład żądania:

  ```http
  POST /portfolios
  Content-Type: application/json

  {
    "name": "Main Portfolio",
    "description": "My primary cryptocurrency portfolio"
  }
  ```

#### PUT /portfolios/{id}

- Metoda HTTP: PUT
- Parametry:
  - Wymagane: id (UUID)
- Request Body: UpdatePortfolioCommand
  ```typescript
  {
    name?: string;
    description?: string | null;
  }
  ```
- Przykład żądania:

  ```http
  PUT /portfolios/123e4567-e89b-12d3-a456-426614174000
  Content-Type: application/json

  {
    "name": "Updated Portfolio Name",
    "description": "Updated description"
  }
  ```

#### DELETE /portfolios/{id}

- Metoda HTTP: DELETE
- Parametry:
  - Wymagane: id (UUID)
- Przykład żądania:
  ```http
  DELETE /portfolios/123e4567-e89b-12d3-a456-426614174000
  ```

### Position Endpoints

#### GET /portfolios/{portfolioId}/positions

- Metoda HTTP: GET
- Parametry:
  - Wymagane: portfolioId (UUID)
  - Opcjonalne:
    - search: string
    - groupId: string
    - sortBy: 'name' | 'totalAmount' | 'currentProfit' | 'totalInvested'
    - sortOrder: 'asc' | 'desc'
    - page: number
    - pageSize: number
- Przykład żądania:
  ```http
  GET /portfolios/123e4567-e89b-12d3-a456-426614174000/positions?groupId=789e4567-e89b-12d3-a456-426614174000&sortBy=currentProfit&sortOrder=desc
  ```

#### POST /portfolios/{portfolioId}/positions

- Metoda HTTP: POST
- Parametry:
  - Wymagane: portfolioId (UUID)
- Request Body: CreatePositionCommand
  ```typescript
  {
    cryptocurrencyId: string;
    totalAmount: number;
    averageBuyPrice: number;
    breakEvenPrice?: number | null;
  }
  ```
- Przykład żądania:

  ```http
  POST /portfolios/123e4567-e89b-12d3-a456-426614174000/positions
  Content-Type: application/json

  {
    "cryptocurrencyId": "BTC",
    "totalAmount": 1.5,
    "averageBuyPrice": 45000.00,
    "breakEvenPrice": 46000.00
  }
  ```

### Transaction Endpoints

#### GET /portfolios/{portfolioId}/transactions

- Metoda HTTP: GET
- Parametry:
  - Wymagane: portfolioId (UUID)
  - Opcjonalne:
    - startDate: string (ISO date)
    - endDate: string (ISO date)
    - type: 'BUY' | 'SELL'
    - sortBy: 'transactionDate' | 'amount' | 'price'
    - sortOrder: 'asc' | 'desc'
    - page: number
    - pageSize: number

#### POST /portfolios/{portfolioId}/transactions

- Metoda HTTP: POST
- Parametry:
  - Wymagane: portfolioId (UUID)
- Request Body: CreateTransactionCommand
  ```typescript
  {
    positionId: string;
    type: "BUY" | "SELL";
    amount: number;
    price: number;
    totalValue: number;
    exchangeId: string;
    transactionDate: string;
  }
  ```

### Price Alert Endpoints

#### GET /portfolios/{portfolioId}/alerts

- Metoda HTTP: GET
- Parametry:
  - Wymagane: portfolioId (UUID)
  - Opcjonalne:
    - isActive: boolean
    - condition: 'ABOVE' | 'BELOW'
    - sortBy: 'targetPrice' | 'createdAt'
    - sortOrder: 'asc' | 'desc'
    - page: number
    - pageSize: number

#### POST /portfolios/{portfolioId}/alerts

- Metoda HTTP: POST
- Parametry:
  - Wymagane: portfolioId (UUID)
- Request Body: CreatePriceAlertCommand
  ```typescript
  {
    positionId: string;
    targetPrice: number;
    condition: "ABOVE" | "BELOW";
  }
  ```

## 3. Wykorzystywane typy

### DTOs

- PortfolioDto
- PortfolioListItemDto
- PortfolioSummaryDto
- PositionDto
- PositionListItemDto
- BreakEvenCalculationDto
- TransactionDto
- TransactionListItemDto
- PriceAlertDto
- PriceAlertListItemDto

### Commands

- CreatePortfolioCommand
- UpdatePortfolioCommand
- CreatePositionCommand
- UpdatePositionCommand
- CreateTransactionCommand
- UpdateTransactionCommand
- CreatePriceAlertCommand

## 4. Szczegóły odpowiedzi

### GET /portfolios

- Status: 200 OK
- Response: PaginatedResponse<PortfolioListItemDto>
- Przykład odpowiedzi:
  ```json
  {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Main Portfolio",
        "description": "My primary cryptocurrency portfolio",
        "summary": {
          "totalPositions": 5,
          "totalInvested": "150000.00",
          "currentValue": "165000.00"
        }
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
  ```

### GET /portfolios/{id}

- Status: 200 OK
- Response: PortfolioDto
- Przykład odpowiedzi:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Main Portfolio",
    "description": "My primary cryptocurrency portfolio",
    "createdAt": "2024-03-15T10:30:00Z",
    "updatedAt": "2024-03-15T10:30:00Z",
    "summary": {
      "totalPositions": 5,
      "totalInvested": "150000.00",
      "currentValue": "165000.00"
    }
  }
  ```

### POST /portfolios

- Status: 201 Created
- Response: PortfolioDto
- Przykład odpowiedzi:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Main Portfolio",
    "description": "My primary cryptocurrency portfolio",
    "createdAt": "2024-03-15T10:30:00Z",
    "updatedAt": "2024-03-15T10:30:00Z",
    "summary": {
      "totalPositions": 0,
      "totalInvested": "0.00",
      "currentValue": "0.00"
    }
  }
  ```

### PUT /portfolios/{id}

- Status: 200 OK
- Response: PortfolioDto
- Przykład odpowiedzi:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Updated Portfolio Name",
    "description": "Updated description",
    "createdAt": "2024-03-15T10:30:00Z",
    "updatedAt": "2024-03-15T11:30:00Z",
    "summary": {
      "totalPositions": 5,
      "totalInvested": "150000.00",
      "currentValue": "165000.00"
    }
  }
  ```

### DELETE /portfolios/{id}

- Status: 204 No Content

### GET /portfolios/{portfolioId}/positions

- Status: 200 OK
- Response: PaginatedResponse<PositionListItemDto>
- Przykład odpowiedzi:
  ```json
  {
    "items": [
      {
        "id": "789e4567-e89b-12d3-a456-426614174000",
        "cryptocurrencyId": "BTC",
        "totalAmount": 1.5,
        "cryptocurrencyName": "Bitcoin",
        "currentPrice": 45000.0,
        "change24h": 2.5,
        "totalInvested": 67500.0,
        "currentProfit": 7500.0
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
  ```

### POST /portfolios/{portfolioId}/positions

- Status: 201 Created
- Response: PositionDto
- Przykład odpowiedzi:
  ```json
  {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "portfolioId": "123e4567-e89b-12d3-a456-426614174000",
    "cryptocurrencyId": "BTC",
    "totalAmount": 1.5,
    "averageBuyPrice": 45000.0,
    "breakEvenPrice": 46000.0,
    "cryptocurrencyName": "Bitcoin",
    "createdAt": "2024-03-15T10:30:00Z",
    "updatedAt": "2024-03-15T10:30:00Z",
    "currentPrice": 45000.0,
    "change24h": 2.5,
    "dailyProfit": 1125.0,
    "totalInvested": 67500.0,
    "currentProfit": 7500.0,
    "groups": []
  }
  ```

## 5. Przepływ danych

1. Autentykacja:

   - Weryfikacja tokenu JWT z Supabase Auth
   - Pobranie userId z tokenu

2. Walidacja:

   - Sprawdzenie poprawności danych wejściowych
   - Weryfikacja uprawnień do zasobu

3. Operacje bazodanowe:

   - Wykonanie zapytań przez Supabase Client
   - Obsługa transakcji dla operacji wieloetapowych

4. Transformacja danych:

   - Mapowanie danych z bazy na DTO
   - Obliczanie metryk i agregacji

5. Logowanie:
   - Zapisywanie operacji w audit_logs
   - Obsługa błędów i wyjątków

## 6. Względy bezpieczeństwa

1. Autentykacja:

   - Wymagany token JWT dla wszystkich endpointów
   - Weryfikacja tokenu przez Supabase Auth

2. Autoryzacja:

   - Sprawdzanie uprawnień do portfeli (user_id)
   - Row Level Security w bazie danych

3. Walidacja danych:

   - Sprawdzanie typów i formatów
   - Walidacja biznesowa (np. unikalność nazwy portfela)

4. Rate limiting:
   - Ograniczenie liczby zapytań na użytkownika
   - Ochrona przed atakami typu brute force

## 7. Obsługa błędów

### Kody błędów

- 400 Bad Request: Nieprawidłowe dane wejściowe
- 401 Unauthorized: Brak lub nieprawidłowy token
- 403 Forbidden: Brak uprawnień do zasobu
- 404 Not Found: Zasób nie istnieje
- 409 Conflict: Konflikt (np. duplikat nazwy portfela)
- 500 Internal Server Error: Błąd serwera

### Struktura błędu

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

## 8. Rozważania dotyczące wydajności

1. Cachowanie:

   - Cachowanie wyników zapytań do bazy
   - Cachowanie metryk i agregacji

2. Optymalizacja zapytań:

   - Używanie indeksów
   - Efektywne join-y
   - Paginacja wyników

3. Asynchroniczne operacje:
   - Asynchroniczne obliczanie metryk
   - Kolejkowanie długotrwałych operacji

## 9. Etapy wdrożenia

1. Przygotowanie środowiska:

   - Konfiguracja Supabase
   - Ustawienie RLS policies
   - Konfiguracja middleware

2. Implementacja podstawowych endpointów:

   - GET /portfolios
   - GET /portfolios/{id}
   - POST /portfolios

3. Implementacja operacji na pozycjach:

   - GET /portfolios/{portfolioId}/positions
   - POST /portfolios/{portfolioId}/positions

4. Implementacja walidacji i obsługi błędów:

   - Middleware walidacji
   - Obsługa wyjątków
   - Logowanie błędów

5. Testy:

   - Testy jednostkowe
   - Testy integracyjne
   - Testy wydajnościowe

6. Dokumentacja:
   - Dokumentacja API
   - Przykłady użycia
   - Instrukcje wdrożenia
