Plan testów

1. Wprowadzenie i cele testowania
   Celem testowania jest zapewnienie wysokiej jakości aplikacji poprzez weryfikację poprawności działania komponentów oraz ogólnej funkcjonalności aplikacji.
2. Zakres testów
   Testy będą obejmować:
   Testy jednostkowe
   Testy e2e
3. Typy testów do przeprowadzenia
   Testy jednostkowe: Użycie Jest i React Testing Library do testowania komponentów.
   Testy e2e: Użycie Cypress do testowania całego przepływu aplikacji.
4. Scenariusze testowe dla kluczowych funkcjonalności
   Testowanie renderowania komponentów.
   Testowanie interakcji użytkownika z komponentami.
   Testowanie pełnych scenariuszy użytkownika w aplikacji.
5. Środowisko testowe
   Testy będą przeprowadzane w lokalnym środowisku developerskim oraz w środowisku CI/CD na Github Actions.
6. Narzędzia do testowania
   Jest: Do testów jednostkowych.
   React Testing Library: Do testów komponentów React.
   Cypress: Do testów e2e.
7. Harmonogram testów
   Testy będą przeprowadzane równolegle z rozwojem aplikacji, a także przed każdym wdrożeniem do produkcji.
8. Kryteria akceptacji testów
   Wszystkie testy jednostkowe muszą przejść pomyślnie.
   Testy e2e muszą zweryfikować pełne scenariusze użytkownika.
9. Role i odpowiedzialności w procesie testowania
   Inżynier QA: Odpowiedzialny za projektowanie i przeprowadzanie testów.
   Programiści: Odpowiedzialni za pisanie testów jednostkowych dla swoich komponentów.
   Zespół DevOps: Odpowiedzialny za integrację testów w pipeline CI/CD.
10. Procedury raportowania błędów
    Błędy będą raportowane w systemie zarządzania projektami (np. Jira), a każdy błąd będzie zawierał szczegóły dotyczące kroku reprodukcji oraz oczekiwanego wyniku.
