# Dokument wymagań produktu (PRD) - crypto confession

## 1. Przegląd produktu

Crypto Confession to aplikacja MVP służąca do zarządzania portfelem kryptowalut. Głównym celem jest dostarczenie użytkownikom narzędzia do śledzenia ich inwestycji w kryptowaluty, monitorowania zysków i strat oraz podejmowania świadomych decyzji inwestycyjnych.

### 1.1 Cel produktu

- Umożliwienie użytkownikom efektywnego zarządzania portfelem kryptowalut
- Dostarczenie przejrzystego interfejsu do monitorowania inwestycji
- Automatyzacja obliczeń zysków i strat
- Wsparcie w podejmowaniu decyzji inwestycyjnych

### 1.2 Grupa docelowa

- Inwestorzy kryptowalutowi
- Traderzy
- Osoby zarządzające własnym portfelem kryptowalut

## 2. Problem użytkownika

### 2.1 Główne problemy

- Brak możliwości efektywnego śledzenia zakupionych kryptowalut
- Trudności w obliczaniu zysków i strat
- Brak przejrzystego widoku na całość portfela
- Czasochłonność ręcznego monitorowania cen

### 2.2 Rozwiązanie

- Automatyczne śledzenie cen kryptowalut
- Przejrzysty interfejs z tabelą portfolio
- Automatyczne obliczenia zysków i strat
- Narzędzia wspomagające podejmowanie decyzji

## 3. Wymagania funkcjonalne

### 3.1 Zarządzanie portfolio

- Wyświetlanie listy posiadanych kryptowalut
- Tabela z metrykami:
  - Asset (nazwa kryptowaluty)
  - Price (aktualna cena)
  - 24h change (zmiana procentowa w ciągu 24h)
  - Daily profit (zysk/strata z ostatnich 24h)
  - Total invested (całkowita zainwestowana kwota)
  - Average price (średnia cena zakupu)
  - Current profit (aktualny zysk/strata)
  - Break-even calculator

### 3.2 Integracja z giełdą

- Pobieranie danych o cenach w czasie rzeczywistym
- Lista dostępnych kryptowalut
- Możliwość dodawania nowych pozycji do portfolio

### 3.3 Funkcje dodatkowe

- Import historycznych transakcji
- Grupowanie kryptowalut
- System powiadomień o zmianach cen
- Możliwość przełączania między giełdami w przypadku problemów

## 4. Granice produktu

### 4.1 Co jest w zakresie MVP

- Obsługa jednej giełdy
- Podstawowe funkcje zarządzania portfolio
- Real-time aktualizacje cen
- Podstawowe obliczenia zysków i strat

### 4.2 Co NIE jest w zakresie MVP

- Obsługa wielu giełd jednocześnie
- Obsługa kryptowalut spoza giełdy
- Zaawansowane narzędzia analityczne
- Automatyczne handlowanie

## 5. Historyjki użytkowników

### US-001: Dodawanie nowej kryptowaluty do portfolio

Tytuł: Dodawanie nowej pozycji do portfolio
Opis: Jako użytkownik chcę dodać nową kryptowalutę do mojego portfolio, aby śledzić moje inwestycje.
Kryteria akceptacji:

- Użytkownik może wybrać kryptowalutę z listy dostępnych
- Użytkownik może wprowadzić cenę zakupu
- Użytkownik może wprowadzić ilość
- Nowa pozycja pojawia się w tabeli portfolio
- Wszystkie metryki są automatycznie obliczane

### US-002: Monitorowanie zysków i strat

Tytuł: Śledzenie wyników inwestycji
Opis: Jako użytkownik chcę monitorować zyski i straty moich inwestycji, aby podejmować świadome decyzje.
Kryteria akceptacji:

- Tabela wyświetla aktualne ceny
- Pokazane są zmiany procentowe w ciągu 24h
- Obliczany jest dzienny zysk/strata
- Obliczany jest całkowity zysk/strata od zakupu
- Wszystkie wartości są aktualizowane w czasie rzeczywistym

### US-003: Obliczanie break-even point

Tytuł: Kalkulacja punktu zwrotnego
Opis: Jako użytkownik chcę wiedzieć, ile muszę sprzedać, aby odzyskać zainwestowany kapitał.
Kryteria akceptacji:

- System oblicza wymaganą ilość do sprzedaży
- Uwzględniona jest średnia cena zakupu
- Uwzględniona jest aktualna cena
- Wynik jest wyrażony w jednostkach kryptowaluty
- Wynik jest wyrażony w wartości fiat

### US-004: Grupowanie kryptowalut

Tytuł: Organizacja portfolio
Opis: Jako użytkownik chcę grupować moje kryptowaluty, aby lepiej organizować portfolio.
Kryteria akceptacji:

- Użytkownik może tworzyć grupy
- Użytkownik może przypisywać kryptowaluty do grup
- Możliwe jest filtrowanie po grupach
- Grupy mogą być edytowane i usuwane
- Metryki są obliczane zarówno dla grup jak i pojedynczych pozycji

### US-005: Powiadomienia o zmianach cen

Tytuł: Alerty cenowe
Opis: Jako użytkownik chcę otrzymywać powiadomienia o znaczących zmianach cen, aby szybko reagować na rynkowe zmiany.
Kryteria akceptacji:

- Użytkownik może włączyć/wyłączyć powiadomienia
- Użytkownik może ustawić progi procentowe
- Powiadomienia są wysyłane w czasie rzeczywistym
- Powiadomienia zawierają istotne informacje o zmianie
- System powiadomień jest niezawodny

## 6. Metryki sukcesu

### 6.1 Wydajność systemu

- Czas odpowiedzi API < 2 sekundy
- Dostępność systemu > 99.9%
- Dokładność obliczeń 100%
- Czas aktualizacji danych < 1 minuta

### 6.2 Skalowalność

- Obsługa minimum 1000 równoczesnych użytkowników
- Obsługa minimum 10000 transakcji dziennie
- Czas odpowiedzi interfejsu < 1 sekunda

### 6.3 Jakość danych

- Dokładność danych cenowych 100%
- Poprawność obliczeń 100%
- Kompletność danych historycznych 100%

### 6.4 Bezpieczeństwo

- Codzienny backup danych
- Szyfrowanie danych wrażliwych
- Bezpieczne przechowywanie danych użytkownika
