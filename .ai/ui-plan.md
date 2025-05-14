# Architektura UI dla Crypto Confession

## 1. Przegląd struktury UI

Aplikacja opiera się na jednym głównym widoku portfela, który służy jako centrum zarządzania inwestycjami. Interfejs jest zaprojektowany z naciskiem na przejrzystość i łatwość użycia, z szybkim dostępem do najważniejszych funkcji. Struktura jest płaska, z minimalną liczbą poziomów nawigacji, co ułatwia użytkownikom orientację w aplikacji.

## 2. Lista widoków

### 2.1 Widok logowania
- **Ścieżka**: /login
- **Główny cel**: Autoryzacja użytkownika
- **Kluczowe informacje**:
  - Formularz logowania
  - Informacje o błędach
- **Kluczowe komponenty**:
  - Formularz logowania
  - Komunikat o błędach
- **UX i bezpieczeństwo**:
  - Walidacja formularza
  - Obsługa błędów autoryzacji
  - Bezpieczne przechowywanie tokenów

### 2.2 Główny widok portfela
- **Ścieżka**: /portfolio
- **Główny cel**: Zarządzanie portfelem kryptowalut
- **Kluczowe informacje**:
  - Tabela pozycji
  - Metryki portfela
  - Kalkulator break-even
- **Kluczowe komponenty**:
  - Tabela pozycji
  - Przycisk dodawania pozycji
  - Wskaźniki metryk
- **UX i dostępność**:
  - Responsywna tabela
  - Sortowanie kolumn
  - Czytelne metryki
  - Obsługa klawiatury

### 2.3 Modal dodawania pozycji
- **Ścieżka**: /portfolio/add
- **Główny cel**: Dodawanie nowej pozycji
- **Kluczowe informacje**:
  - Formularz dodawania
  - Historia transakcji
- **Kluczowe komponenty**:
  - Formularz
  - Lista transakcji
- **UX i dostępność**:
  - Walidacja w czasie rzeczywistym
  - Podpowiedzi
  - Obsługa błędów

### 2.4 Strona szczegółów pozycji
- **Ścieżka**: /portfolio/position/[id]
- **Główny cel**: Szczegółowy widok pozycji
- **Kluczowe informacje**:
  - Szczegóły pozycji
  - Historia transakcji
  - Metryki
- **Kluczowe komponenty**:
  - Karta szczegółów
  - Lista transakcji
  - Wykresy
- **UX i dostępność**:
  - Responsywny layout
  - Interaktywne wykresy
  - Czytelne metryki

## 3. Mapa podróży użytkownika

1. Logowanie do aplikacji
2. Przejście do głównego widoku portfela
3. Przeglądanie pozycji w portfelu
4. Dodawanie nowej pozycji przez modal
5. Przeglądanie szczegółów pozycji
6. Monitorowanie powiadomień

## 4. Układ i struktura nawigacji

- Górny pasek nawigacyjny:
  - Logo
  - Przycisk dodawania pozycji
  - Powiadomienia
  - Profil użytkownika
- Główny widok portfela jako centrum aplikacji
- Modal dodawania pozycji jako nakładka
- Strona szczegółów pozycji jako osobny widok

## 5. Kluczowe komponenty

### 5.1 Tabela portfela
- Sortowanie kolumn
- Filtrowanie
- Responsywność
- Kalkulator break-even

### 5.2 System powiadomień
- Toast notifications
- Centrum powiadomień
- Real-time updates

### 5.3 Formularze
- Walidacja
- Obsługa błędów
- Podpowiedzi
- Automatyczne zapisywanie

### 5.4 Metryki i wskaźniki
- Czytelne wyświetlanie
- Automatyczne aktualizacje
- Interaktywne wykresy