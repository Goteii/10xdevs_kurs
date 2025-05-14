# Prompt dla generatora Proof of Concept - Crypto Confession

## Cel PoC

Stworzenie minimalnej wersji aplikacji do zarządzania portfelem kryptowalut, która pozwoli zweryfikować podstawową funkcjonalność zarządzania kryptowalutami.

## Zakres PoC

Skupiamy się wyłącznie na następujących funkcjonalnościach:

1. Wyświetlanie listy posiadanych kryptowalut w tabeli z kolumnami:
   - Asset (nazwa kryptowaluty)
   - Price (aktualna cena)
   - Total invested (całkowita zainwestowana kwota)
   - Average price (średnia cena zakupu)
   - Current profit (aktualny zysk/strata)
2. Pobieranie danych o cenach z API giełdy
3. Dodawanie nowych pozycji do portfolio (wybór coina, cena, ilość)

## Stack technologiczny

- Frontend: Astro + React + TypeScript + Tailwind + Shadcn/ui
- Backend: Supabase (PostgreSQL + Backend-as-a-Service)
- Hosting: DigitalOcean (Docker)

## Plan pracy

Przed przystąpieniem do implementacji, proszę o przedstawienie i akceptację następujących elementów:

1. Architektura rozwiązania:

   - Struktura bazy danych
   - Schemat API
   - Struktura komponentów frontendowych

2. Wybór API giełdy:

   - Propozycja konkretnego API
   - Przykładowe endpointy
   - Limity i ograniczenia

3. Plan implementacji:
   - Lista kroków
   - Szacowany czas
   - Potencjalne ryzyka

## Kryteria akceptacji PoC

1. Aplikacja pozwala na:
   - Wyświetlanie listy kryptowalut w tabeli
   - Dodawanie nowych pozycji
   - Automatyczne obliczanie zysków/strat
2. Dane są pobierane z API giełdy
3. Interfejs jest responsywny i intuicyjny
4. Aplikacja działa w środowisku produkcyjnym

## Wykluczone funkcjonalności

- Import historycznych transakcji
- Grupowanie kryptowalut
- System powiadomień
- Break-even calculator
- Przełączanie między giełdami
- Zaawansowane metryki (24h change, daily profit)

## Prośba o akceptację

Przed przystąpieniem do implementacji, proszę o przedstawienie planu pracy i uzyskanie akceptacji. Po akceptacji, generator powinien:

1. Stworzyć strukturę projektu
2. Zaimplementować podstawowe komponenty
3. Zintegrować API giełdy
4. Dodać logikę biznesową
5. Wdrożyć aplikację

Każdy krok powinien być omówiony i zaakceptowany przed przejściem do następnego.
