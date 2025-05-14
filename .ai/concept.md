# Aplikacja - crypto confession (MVP)

### Główny problem

Brak możliwością zarządzania kryptowalutami, wyświetlanie co i za ile sie kupiło, sprawdzanie ile sie zarobiło przy sprzedaży, generalnie zarządzanie swoim portfelem

### Najmniejszy zestaw funkcjonalności

- Wyświetlanie listy coinów jakie posiadamy w tym tabela z kolumnami:
  - asset,
  - price z ostatnich 24h (jaki procent wzrósł/spadł od nowego dnia),
  - nowa dniówka profit,
  - total invested,
  - avg.price,
  - current profit(od momentu zakupu)
  - obliczanie ile powinno się sprzedać jeśli chcemy wyciągnąć wkład własny
- pobieranie danych z api giełdy na temat ceny
- wybieranie coinów z listy wszystkich dostępnych na giełdzie i dodawanie do portfolio po danej cenie oraz quantity

### Co NIE wchodzi w zakres MVP

- obsługa wielu giełd,
- obsługa coinów z poza giełd

### Kryteria sukcesu

- wyświetlenie listy coinów
- poprawne pobieranie danych z giełdy

answers:
1.1 tak
1.2 dane aktualizowane realtime
1.3 mogą potrzebowac, opcja powinna byc mozliwa do wyłączenia/włączenia
2.1:
_ asset,
_ price z ostatnich 24h (jaki procent wzrósł/spadł od nowego dnia),
_ nowa dniówka profit,
_ total invested,
_ avg.price,
_ current profit(od momentu zakupu) \* obliczanie ile powinno się sprzedać jeśli chcemy wyciągnąć wkład własny
2.2 tak
2.3 jak najmniejsze
3.1 tak powinni mieć mozliwosc grupowania
3.2 kliknięcie w button, wybranie tickera z listy dostepnych, wpisanie ceny, wpisanie quantity
3.3 sortowanie na pewno tak, filtrowanie może byc potrzebne ale niekoniecznie na teraz
4.3 zaproponuj wyliczenie średniej ceny zakupu mając na uwadze quantity oraz cene zakupu
5.1 powinna być mozliwosc podpięcia się do innej giełdy jeśli jest jakis problem
5.2 uzywac jednej strefy czasowej
6.1 jak najszybciej
6.2 trzeba mieć na uwadze mozliwosc duzej ilosci uzytkowników, powinno byc jak najbardziej skalowalne
6.3 codzienny backup danych bazy

Jesteś doświadczonym menedżerem produktu, którego zadaniem jest stworzenie kompleksowego dokumentu wymagań produktu (PRD) w oparciu o poniższe opisy:

<project_description>

# Aplikacja - crypto confession (MVP)

### Główny problem

Brak możliwością zarządzania kryptowalutami, wyświetlanie co i za ile sie kupiło, sprawdzanie ile sie zarobiło przy sprzedaży, generalnie zarządzanie swoim portfelem

### Najmniejszy zestaw funkcjonalności

- Wyświetlanie listy coinów jakie posiadamy w tym tabela z kolumnami:
  - asset,
  - price z ostatnich 24h (jaki procent wzrósł/spadł od nowego dnia),
  - nowa dniówka profit,
  - total invested,
  - avg.price,
  - current profit(od momentu zakupu)
  - obliczanie ile powinno się sprzedać jeśli chcemy wyciągnąć wkład własny
- pobieranie danych z api giełdy na temat ceny
- wybieranie coinów z listy wszystkich dostępnych na giełdzie i dodawanie do portfolio po danej cenie oraz quantity

### Co NIE wchodzi w zakres MVP

- obsługa wielu giełd,
- obsługa coinów z poza giełd

### Kryteria sukcesu

- wyświetlenie listy coinów
- poprawne pobieranie danych z giełdy
  </project_description>

<project_details>
<conversation_summary>
<decisions>
Funkcjonalność importu historycznych transakcji zostanie zaimplementowana
Dane będą aktualizowane w czasie rzeczywistym
System powiadomień będzie opcjonalny (możliwość włączenia/wyłączenia)
Wszystkie wymienione metryki w tabeli portfolio są priorytetowe
Break-even calculator jest funkcją priorytetową w MVP
Dokładność obliczeń powinna być maksymalna
Grupowanie coinów w portfolio zostanie zaimplementowane
Proces dodawania coina: button -> wybór tickera -> cena -> quantity
Sortowanie w tabeli jest wymagane, filtrowanie opcjonalne
Implementacja możliwości przełączania między giełdami w przypadku problemów
Użycie jednej strefy czasowej dla wszystkich operacji
Priorytet szybkiego wdrożenia MVP
Wysoka skalowalność systemu
Codzienny backup bazy danych
</decisions>
<matched_recommendations>
Implementacja systemu cache'owania danych API z możliwością ręcznej aktualizacji
System powiadomień o znaczących zmianach cen z możliwością konfiguracji
Responsywny interfejs z możliwością dostosowania widoku
Wyszukiwarka coinów z autocomplete
System monitoringu dostępności API z możliwością przełączania między giełdami
Implementacja wersjonowania API i mechanizmu migracji
System backupu danych użytkownika
Implementacja testów automatycznych
</matched_recommendations>
<prd_planning_summary>
Główne wymagania funkcjonalne:
Portfolio management z listą coinów i szczegółowymi metrykami
Real-time price updates z API giełdy
Import historycznych transakcji
Break-even calculator
Grupowanie coinów w portfolio
System powiadomień (opcjonalny)
Możliwość przełączania między giełdami
Kluczowe historie użytkownika:
Użytkownik chce dodać nowy coin do portfolio
Użytkownik chce monitorować zysk/stratę
Użytkownik chce obliczyć break-even point
Użytkownik chce grupować swoje coiny
Użytkownik chce otrzymywać powiadomienia o zmianach cen
Kryteria sukcesu:
Poprawne wyświetlanie wszystkich metryk w tabeli
Dokładne obliczenia zysku/straty
Szybkie aktualizacje danych w czasie rzeczywistym
Skalowalność systemu
Niezawodność systemu backupu
Metryki sukcesu:
Czas odpowiedzi API
Dokładność obliczeń
Dostępność systemu
Skalowalność pod obciążeniem
</prd_planning_summary>
<unresolved_issues>
Konkretne progi dla powiadomień o zmianach cen
Szczegółowa strategia cache'owania danych API
Dokładne wymagania dotyczące skalowalności (liczba użytkowników, transakcji)
Szczegóły implementacji systemu backupu
Konkretne metryki wydajności API giełdy
Strategia migracji między giełdami
</unresolved_issues>
</conversation_summary>
</project_details>

Wykonaj następujące kroki, aby stworzyć kompleksowy i dobrze zorganizowany dokument:

1. Podziel PRD na następujące sekcje:
   a. Przegląd projektu
   b. Problem użytkownika
   c. Wymagania funkcjonalne
   d. Granice projektu
   e. Historie użytkownika
   f. Metryki sukcesu

2. W każdej sekcji należy podać szczegółowe i istotne informacje w oparciu o opis projektu i odpowiedzi na pytania wyjaśniające. Upewnij się, że:

   - Używasz jasnego i zwięzłego języka
   - W razie potrzeby podajesz konkretne szczegóły i dane
   - Zachowujesz spójność w całym dokumencie
   - Odnosisz się do wszystkich punktów wymienionych w każdej sekcji

3. Podczas tworzenia historyjek użytkownika i kryteriów akceptacji
   - Wymień WSZYSTKIE niezbędne historyjki użytkownika, w tym scenariusze podstawowe, alternatywne i skrajne.
   - Przypisz unikalny identyfikator wymagań (np. US-001) do każdej historyjki użytkownika w celu bezpośredniej identyfikowalności.
   - Uwzględnij co najmniej jedną historię użytkownika specjalnie dla bezpiecznego dostępu lub uwierzytelniania, jeśli aplikacja wymaga identyfikacji użytkownika lub ograniczeń dostępu.
   - Upewnij się, że żadna potencjalna interakcja użytkownika nie została pominięta.
   - Upewnij się, że każda historia użytkownika jest testowalna.

Użyj następującej struktury dla każdej historii użytkownika:

- ID
- Tytuł
- Opis
- Kryteria akceptacji

4. Po ukończeniu PRD przejrzyj go pod kątem tej listy kontrolnej:

   - Czy każdą historię użytkownika można przetestować?
   - Czy kryteria akceptacji są jasne i konkretne?
   - Czy mamy wystarczająco dużo historyjek użytkownika, aby zbudować w pełni funkcjonalną aplikację?
   - Czy uwzględniliśmy wymagania dotyczące uwierzytelniania i autoryzacji (jeśli dotyczy)?

5. Formatowanie PRD:
   - Zachowaj spójne formatowanie i numerację.
   - Nie używaj pogrubionego formatowania w markdown ( \*\* ).
   - Wymień WSZYSTKIE historyjki użytkownika.
   - Sformatuj PRD w poprawnym markdown.

Przygotuj PRD z następującą strukturą:

```markdown
# Dokument wymagań produktu (PRD) - crypto confession

## 1. Przegląd produktu

## 2. Problem użytkownika

## 3. Wymagania funkcjonalne

## 4. Granice produktu

## 5. Historyjki użytkowników

## 6. Metryki sukcesu
```

Pamiętaj, aby wypełnić każdą sekcję szczegółowymi, istotnymi informacjami w oparciu o opis projektu i nasze pytania wyjaśniające. Upewnij się, że PRD jest wyczerpujący, jasny i zawiera wszystkie istotne informacje potrzebne do dalszej pracy nad produktem.

Ostateczny wynik powinien składać się wyłącznie z PRD zgodnego ze wskazanym formatem w markdown, który zapiszesz w pliku .ai/prd.md

1. wiele portfeli
2. ceny powinny być zapisywanie dla zakupu lub sprzedaży krypto, aktualne ceny powinny byc pobierane z api giełdy
3. tak, ceny transackcji są potrzebne do pozniejszego wyliczania
4. uzytkownik będzie mieć mozliwosc grupowania swoich krypto w portfelu np grupa longTerm w której będą id pozycji z całego potrfela chyba, ze masz inny pomysł
5. doprecyzuj pytanie, alerty powinny być jeśli uzytkownik ustawi taki alert na cenie danego coina
6. uzytkownik podaje tylko swoj email, haslo, username.
7. docelowo na wielu więc powinno być łatwe w rozbudowie
8. jako wartosc w tabeli, w tym generalna cena zakupu danego coina-usredniona i łączna cena sprzedazy
9. przyda sie
10. backupy powinny wykonywac sie codziennie

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania bazy danych dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:

1. Dokument wymagań produktu (PRD)
2. Informacje o stacku technologicznym
3. Historia rozmów zawierająca pytania i odpowiedzi
4. Zalecenia dotyczące modelu

Twoim zadaniem jest:

1. Podsumować historii konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem bazy danych.
2. Dopasowanie zaleceń modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikuj, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotuj szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania dotyczące schematu bazy danych
   b. Kluczowe encje i ich relacje
   c. Ważne kwestie dotyczące bezpieczeństwa i skalowalności
   d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatuj wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>

<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>

<database_planning_summary> [Podsumowanie planowania bazy danych]
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</database_planning_summary>

<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu planowania bazy danych.

Jesteś architektem baz danych, którego zadaniem jest stworzenie schematu bazy danych PostgreSQL na podstawie informacji dostarczonych z sesji planowania, dokumentu wymagań produktu (PRD) i stacku technologicznym. Twoim celem jest zaprojektowanie wydajnej i skalowalnej struktury bazy danych, która spełnia wymagania projektu.

1. <prd>
   {{prd}} <- zamień na referencję do @prd.md
   </prd>

Jest to dokument wymagań produktu, który określa cechy, funkcjonalności i wymagania projektu.

2. <session_notes>
   <conversation_summary>
   <decisions>
   Użytkownicy mogą posiadać wiele portfeli
   Ceny kryptowalut są przechowywane tylko dla transakcji (zakup/sprzedaż), aktualne ceny są pobierane z API giełdy
   Historia transakcji jest wymagana do obliczeń
   Grupowanie kryptowalut odbywa się na poziomie portfela poprzez przypisanie pozycji do grup
   Alerty cenowe są konfigurowane przez użytkownika dla konkretnych kryptowalut
   Dane użytkownika ograniczają się do email, hasło i username
   System powinien być przygotowany na obsługę wielu giełd w przyszłości
   Break-even point jest przechowywany jako wartość w tabeli wraz z uśrednioną ceną zakupu i sprzedaży
   System wersjonowania danych jest wymagany
   Codzienne backupy są wymagane
   </decisions>
   <matched_recommendations>
   Wykorzystanie typów JSONB dla metryk kryptowalut i konfiguracji alertów
   Implementacja RLS dla wszystkich tabel związanych z użytkownikami
   Wykorzystanie triggerów do automatycznego obliczania metryk portfela
   Zastosowanie foreign key constraints z ON DELETE CASCADE
   Implementacja systemu soft delete
   Wykorzystanie materializowanych widoków dla agregacji danych portfela
   Zastosowanie typów ENUM dla statusów powiadomień i typów transakcji
   Wykorzystanie funkcji window dla obliczania zmian procentowych
   </matched_recommendations>
   <database_planning_summary>
   Główne wymagania:
   System wieloportfelowy z możliwością grupowania pozycji
   Przechowywanie historii transakcji z cenami
   Integracja z API giełd w czasie rzeczywistym
   System alertów cenowych
   Wersjonowanie danych i codzienne backupy
   Kluczowe encje i relacje:
   Users (użytkownicy)
   Relacja 1:N z Portfolios
   Relacja 1:N z Alerts
   Portfolios (portfele)
   Relacja N:1 z Users
   Relacja 1:N z PortfolioGroups
   Relacja 1:N z Positions
   Positions (pozycje)
   Relacja N:1 z Portfolios
   Relacja N:M z PortfolioGroups
   Relacja 1:N z Transactions
   Transactions (transakcje)
   Relacja N:1 z Positions
   Przechowywanie cen zakupu/sprzedaży
   PortfolioGroups (grupy)
   Relacja N:1 z Portfolios
   Relacja N:M z Positions
   Alerts (alerty)
   Relacja N:1 z Users
   Relacja N:1 z Positions
   Bezpieczeństwo i skalowalność:
   RLS dla izolacji danych użytkowników
   Przygotowanie na obsługę wielu giełd
   Optymalizacja zapytań przez materializowane widoki
   System wersjonowania dla audytu
   Codzienne backupy
   </database_planning_summary>
   <unresolved_issues>
   Szczegółowa struktura danych dla różnych typów giełd
   Dokładne wymagania dotyczące retencji historycznych danych
   Strategia migracji danych przy dodawaniu nowych giełd
   Szczegółowe wymagania dotyczące wydajności systemu (np. maksymalny czas odpowiedzi)
   Strategia obsługi błędów API giełd
   </unresolved_issues>
   </conversation_summary>
   </session_notes>

Są to notatki z sesji planowania schematu bazy danych. Mogą one zawierać ważne decyzje, rozważania i konkretne wymagania omówione podczas spotkania.

3. <tech_stack>
   {{tech-stack}} <- zamień na referencje do tech-stack.md
   </tech_stack>

Opisuje stack technologiczny, który zostanie wykorzystany w projekcie, co może wpłynąć na decyzje dotyczące projektu bazy danych.

Wykonaj następujące kroki, aby utworzyć schemat bazy danych:

1. Dokładnie przeanalizuj notatki z sesji, identyfikując kluczowe jednostki, atrybuty i relacje omawiane podczas sesji planowania.
2. Przejrzyj PRD, aby upewnić się, że wszystkie wymagane funkcje i funkcjonalności są obsługiwane przez schemat bazy danych.
3. Przeanalizuj stack technologiczny i upewnij się, że projekt bazy danych jest zoptymalizowany pod kątem wybranych technologii.

4. Stworzenie kompleksowego schematu bazy danych, który obejmuje
   a. Tabele z odpowiednimi nazwami kolumn i typami danych
   b. Klucze podstawowe i klucze obce
   c. Indeksy poprawiające wydajność zapytań
   d. Wszelkie niezbędne ograniczenia (np. unikalność, not null)

5. Zdefiniuj relacje między tabelami, określając kardynalność (jeden-do-jednego, jeden-do-wielu, wiele-do-wielu) i wszelkie tabele łączące wymagane dla relacji wiele-do-wielu.

6. Opracowanie zasad PostgreSQL dla zabezpieczeń na poziomie wiersza (RLS), jeśli dotyczy, w oparciu o wymagania określone w notatkach z sesji lub PRD.

7. Upewnij się, że schemat jest zgodny z najlepszymi praktykami projektowania baz danych, w tym normalizacji do odpowiedniego poziomu (zwykle 3NF, chyba że denormalizacja jest uzasadniona ze względu na wydajność).

Ostateczny wynik powinien mieć następującą strukturę:

```markdown
1. Lista tabel z ich kolumnami, typami danych i ograniczeniami
2. Relacje między tabelami
3. Indeksy
4. Zasady PostgreSQL (jeśli dotyczy)
5. Wszelkie dodatkowe uwagi lub wyjaśnienia dotyczące decyzji projektowych
```

W odpowiedzi należy podać tylko ostateczny schemat bazy danych w formacie markdown, który zapiszesz w pliku .ai/db-plan.md bez uwzględniania procesu myślowego lub kroków pośrednich. Upewnij się, że schemat jest kompleksowy, dobrze zorganizowany i gotowy do wykorzystania jako podstawa do tworzenia migracji baz danych.

1. jeden wystarczy dla MVP, lecz musi być łatwo konfigurowalny
2. jako modal
3. wystarczy rozwijalna lista dla MVP
4. podczas dodawania pozycji do portfela uzytkownik powinien sam mógł wpisać date zakupu
5. może byc dodane w pozniejszym czasie
6. wbudowany w aplikacje, powiązany z zewnętrznymi systemami powiadomien
7. część widoku portfela - jako kolumna
8. standardowy widok logowania
9. nie
10. osobna strona

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania architektury UI dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:

1. Dokument wymagań produktu (PRD)
2. Informacje o stacku technologicznym
3. Plan API
4. Historia rozmów zawierająca pytania i odpowiedzi
5. Zalecenia dotyczące architektury UI

Twoim zadaniem jest:

1. Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem architektury UI.
2. Dopasować zalecenia modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikować, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotować szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania dotyczące architektury UI
   b. Kluczowe widoki, ekrany i przepływy użytkownika
   c. Strategię integracji z API i zarządzania stanem
   d. Kwestie dotyczące responsywności, dostępności i bezpieczeństwa
   e. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatować wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>
<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>
<ui_architecture_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu planowania architektury UI i integracji z API.

<conversation_summary>
<decisions>
Jeden portfel na użytkownika w MVP, z możliwością łatwej konfiguracji
Dodawanie nowych pozycji realizowane jako modal
Historia transakcji dostępna jako rozwijana lista w kontekście pozycji
Import historycznych transakcji zintegrowany z procesem dodawania pozycji, z możliwością ręcznego wprowadzania daty zakupu
Grupowanie kryptowalut odłożone na późniejszą iterację
System powiadomień wbudowany w aplikację, z możliwością integracji z zewnętrznymi systemami
Kalkulator break-even zintegrowany jako kolumna w widoku portfela
Standardowy widok logowania
Brak systemu wyszukiwania i filtrowania w MVP
Szczegóły pozycji dostępne jako osobna strona
</decisions>
<matched_recommendations>
Implementacja głównego widoku portfela jako tabeli z wykorzystaniem shadcn/ui
Wykorzystanie React Query do zarządzania stanem i synchronizacji z API
Implementacja wbudowanego systemu powiadomień z WebSocket
Responsywny layout z Tailwind CSS
Integracja z Supabase Auth
Wykorzystanie komponentów shadcn/ui
Implementacja systemu buforowania z React Query
Wykorzystanie React Hook Form do walidacji
System obsługi błędów z toast notifications
Zarządzanie stanem globalnym przez React Context
</matched_recommendations>
<ui_architecture_planning_summary>
Główne wymagania architektury UI:
Jeden portfel na użytkownika z możliwością konfiguracji
Tabelaryczny widok portfela z kalkulatorem break-even
Modal do dodawania nowych pozycji
Osobna strona szczegółów pozycji
Rozwijana lista historii transakcji
Wbudowany system powiadomień
Kluczowe widoki i przepływy:
Widok logowania (standardowy)
Główny widok portfela:
Tabela z pozycjami
Kolumna kalkulatora break-even
Przycisk dodawania nowej pozycji
Modal dodawania pozycji:
Formularz z datą zakupu
Walidacja danych
Strona szczegółów pozycji:
Rozwijana lista transakcji
Szczegółowe metryki
Strategia integracji z API:
React Query do zarządzania stanem i synchronizacji
WebSocket do powiadomień w czasie rzeczywistym
Buforowanie danych dla optymalizacji wydajności
React Hook Form do walidacji formularzy
Responsywność i dostępność:
Tailwind CSS do responsywnego layoutu
Komponenty shadcn/ui zapewniające dostępność
Optymalizacja pod urządzenia mobilne
Bezpieczeństwo:
Integracja z Supabase Auth
Standardowy proces logowania
Zabezpieczenie endpointów API
</ui_architecture_planning_summary>
<unresolved_issues>
Szczegółowa struktura danych powiadomień i ich format
Dokładna specyfikacja metryk wyświetlanych w widoku portfela
Strategia aktualizacji danych w czasie rzeczywistym
Mechanizm obsługi błędów API w kontekście UI
Szczegóły implementacji WebSocket dla powiadomień
</unresolved_issues>
</conversation_summary>
