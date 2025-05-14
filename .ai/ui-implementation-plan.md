<implementation_breakdown>
Analizując dostarczone dokumenty, skupię się na implementacji widoku portfela, który jest centralnym elementem aplikacji.
Kluczowe wymagania z PRD:
Wyświetlanie listy kryptowalut
Metryki: cena, zmiana 24h, zysk dzienny, całkowita inwestycja, średnia cena, aktualny zysk
Kalkulator break-even
Real-time aktualizacje cen
User Stories:
US-001: Dodawanie pozycji (modal)
US-002: Monitorowanie zysków/strat (tabela)
US-003: Break-even (kolumna w tabeli)
Endpointy API:
GET /portfolios/{id}/positions - główne dane
GET /exchanges/{id}/prices - ceny real-time
GET /positions/{id}/break-even - kalkulacje
Typy:
PositionDto - główny typ dla pozycji
PositionListItemDto - uproszczony typ dla tabeli
BreakEvenCalculationDto - kalkulacje
Stack technologiczny:
Astro + React
Tailwind CSS
shadcn/ui
React Query
Główne komponenty:
PortfolioTable
Tabela z pozycjami
Sortowanie
Kalkulator break-even
AddPositionModal
Formularz dodawania
Walidacja
PositionMetrics
Metryki portfela
Real-time updates
Zarządzanie stanem:
React Query dla danych
WebSocket dla cen
Context dla stanu UI
Walidacja:
Wymagane pola
Format liczb
Daty transakcji
Obsługa błędów:
Toast notifications
Fallback UI
Retry logic
Przejdę teraz do tworzenia szczegółowego planu implementacji.
</implementation_breakdown>

# Plan implementacji widoku Portfolio

## 1. Przegląd
Widok portfela jest centralnym elementem aplikacji, służącym do zarządzania inwestycjami w kryptowaluty. Zapewnia przejrzysty interfejs do monitorowania pozycji, zysków i strat oraz kalkulacji break-even. Widok jest zoptymalizowany pod kątem wydajności i responsywności.

## 2. Routing widoku
- Ścieżka: `/portfolio`
- Layout: `src/layouts/PortfolioLayout.astro`
- Strona: `src/pages/portfolio/index.astro`

## 3. Struktura komponentów
PortfolioView
├── PortfolioHeader
│ ├── PortfolioMetrics
│ └── AddPositionButton
├── PortfolioTable
│ ├── TableHeader
│ ├── TableRow
│ └── BreakEvenColumn
└── AddPositionModal
├── CryptocurrencySelect
├── TransactionForm
└── ValidationSummary

## 4. Szczegóły komponentów

### PortfolioHeader
- Opis: Nagłówek widoku z metrykami i przyciskiem dodawania
- Główne elementy:
  - PortfolioMetrics (komponent)
  - AddPositionButton (komponent)
- Obsługiwane interakcje:
  - Kliknięcie przycisku dodawania
  - Aktualizacja metryk w czasie rzeczywistym
- Typy:
  - PortfolioSummaryDto
- Propsy:
  - portfolioId: string
  - onAddPosition: () => void

### PortfolioTable
- Opis: Tabela z pozycjami i kalkulatorem break-even
- Główne elementy:
  - TableHeader (komponent)
  - TableRow (komponent)
  - BreakEvenColumn (komponent)
- Obsługiwane interakcje:
  - Sortowanie kolumn
  - Kliknięcie wiersza (szczegóły)
  - Kalkulacja break-even
- Typy:
  - PositionListItemDto[]
  - BreakEvenCalculationDto
- Propsy:
  - positions: PositionListItemDto[]
  - onSort: (column: string) => void
  - onRowClick: (positionId: string) => void

### AddPositionModal
- Opis: Modal do dodawania nowej pozycji
- Główne elementy:
  - CryptocurrencySelect (komponent)
  - TransactionForm (komponent)
  - ValidationSummary (komponent)
- Obsługiwane interakcje:
  - Wybór kryptowaluty
  - Wprowadzanie danych transakcji
  - Walidacja formularza
- Typy:
  - CreatePositionCommand
  - CryptocurrencyDto[]
- Propsy:
  - isOpen: boolean
  - onClose: () => void
  - onSubmit: (data: CreatePositionCommand) => void

## 5. Typy

### PositionListItemDto
```typescript
interface PositionListItemDto {
  id: string;
  cryptocurrencyId: string;
  cryptocurrencyName?: string;
  totalAmount: number;
  currentPrice?: number;
  change24h?: number;
  totalInvested?: number;
  currentProfit?: number;
}
```

### BreakEvenCalculationDto
```typescript
interface BreakEvenCalculationDto {
  positionId: string;
  cryptocurrencyId: string;
  initialInvestment: number;
  currentValue: number;
  amountToSell: number;
  priceToSell: number;
}
```

## 6. Zarządzanie stanem

### Custom Hooks
```typescript
const usePortfolioData = (portfolioId: string) => {
  // React Query dla danych portfela
  // WebSocket dla cen real-time
  // Cache i optymalizacja
}

const useBreakEvenCalculation = (positionId: string) => {
  // Kalkulacje break-even
  // Cache wyników
}
```

## 7. Integracja API

### Endpointy
- GET /portfolios/{id}/positions
  - Typ odpowiedzi: PositionListItemDto[]
  - Odświeżanie: co 30 sekund
- GET /exchanges/{id}/prices
  - Typ odpowiedzi: PriceDto[]
  - WebSocket dla real-time
- GET /positions/{id}/break-even
  - Typ odpowiedzi: BreakEvenCalculationDto
  - Cache: 5 minut

## 8. Interakcje użytkownika

1. Dodawanie pozycji:
   - Kliknięcie przycisku
   - Wybór kryptowaluty
   - Wprowadzenie danych
   - Walidacja
   - Zapis

2. Przeglądanie portfela:
   - Sortowanie kolumn
   - Filtrowanie
   - Szczegóły pozycji

3. Kalkulacja break-even:
   - Automatyczna kalkulacja
   - Wyświetlanie wyników
   - Aktualizacja przy zmianie cen

## 9. Warunki i walidacja

### Formularz dodawania pozycji
- Wymagane pola:
  - Kryptowaluta
  - Ilość (liczba dodatnia)
  - Cena zakupu (liczba dodatnia)
  - Data transakcji (nie później niż dziś)
- Walidacja formatu:
  - Liczby z 8 miejscami po przecinku
  - Daty w formacie ISO

### Tabela portfela
- Sortowanie:
  - Po nazwie
  - Po wartości
  - Po zysku/stracie
- Filtrowanie:
  - Po kryptowalucie
  - Po zakresie dat

## 10. Obsługa błędów

### Scenariusze błędów
1. Błąd ładowania danych:
   - Retry logic
   - Fallback UI
   - Komunikat błędu

2. Błąd WebSocket:
   - Automatyczne połączenie
   - Fallback do polling
   - Indykator statusu

3. Błąd walidacji:
   - Toast notification
   - Podświetlenie pól
   - Podsumowanie błędów

## 11. Kroki implementacji

1. Przygotowanie struktury:
   - Utworzenie komponentów
   - Konfiguracja routingu
   - Setup React Query

2. Implementacja tabeli:
   - Podstawowa struktura
   - Sortowanie
   - Break-even

3. Implementacja modalu:
   - Formularz
   - Walidacja
   - Integracja z API

4. Real-time updates:
   - WebSocket setup
   - Aktualizacje cen
   - Kalkulacje

5. Testy i optymalizacja:
   - Testy komponentów
   - Testy integracyjne
   - Optymalizacja wydajności