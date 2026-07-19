# Stückelung des Betrages in Euro (Fullstack)

Dieses Projekt ist eine Fullstack-Anwendung zur Berechnung von Euro-Stückelungen und Differenz-Analysen.
Die Berechnungslogik kann wahlweise **vollständig im Frontend** (Client-Side) oder **über das Backend** (Server-Side) ausgeführt werden.

Die API-Kommunikation ist durch **OpenAPI / Swagger** vollautomatisiert und typsicher generiert.

---

## Tech Stack & Architektur

### Backend
* **Spring Boot 3.x** & Java
* **Swagger / Springdoc OpenAPI:** Automatische API-Dokumentation und Bereitstellung der OpenAPI-Spezifikation.
* **Testing:** Robuste Absicherung durch **JUnit 5** Unit-Tests sowie **Integrationstests**.

### Frontend
* **Angular 21** & TypeScript / SCSS
* **OpenAPI Generator:** Automatisch generierte API-Schnittstellen (Services und Modelle) statt manuell geschriebener HTTP-Requests.
* **UI & Styling:** **Angular Material** für interaktive Komponenten kombiniert mit **Bootstrap** für ein responsives Grid-Layout.
* **Lokalisierung (i18n):** Vollständig auf die deutsche Schreibweise (Komma als Trennzeichen, Euro-Symbol ``€``) angepasste Zahlendarstellung und Eingabevalidierung.
* **Testing:** Isolierte **Unit-Tests** für Pipes, Komponenten und Services.

---

## Besondere Features

* **Vollständige OpenAPI-Integration:** Automatisch generierte API-Clients und Modelle für eine typsichere Kommunikation zwischen Frontend und Backend.
* **Flexible Berechnungslogik:** Möglichkeit, die Berechnungen entweder im Frontend oder im Backend durchzuführen, je nach Anwendungsfall.
* **Responsive Design:** Optimiert für verschiedene Bildschirmgrößen und Geräte, dank Angular Material und Bootstrap.
* **Lokalisierung:** Anpassung der Zahlendarstellung und Eingabevalidierung an die deutsche Schreibweise (Komma als Dezimaltrennzeichen, Euro-Symbol ``€``).
* **Umfassende Tests:** Robuste Unit- und Integrationstests sowohl im Frontend als auch im Backend, um die Qualität und Stabilität der Anwendung sicherzustellen.

---

## Projekt starten

### 1. Backend starten (Spring Boot)
Das Backend muss zuerst gestartet werden, damit die OpenAPI-Spezifikation bereitsteht.

1.1 Navigiere in das Backend-Verzeichnis:

```bash
cd backend
```

1.2 Baue das Projekt und starte den Spring Boot Server:

```bash
./mvnw spring-boot:run
```

1.3 Das Backend läuft standardmäßig unter http://localhost:8056/api.

1.4 Die Swagger UI (API-Dokumentation) ist unter http://localhost:8056/api/swagger verfügbar.

### 2. Frontend starten (Angular)

2.1 Navigiere in das Frontend-Verzeichnis:

```bash
cd frontend
```

2.2 Installiere die Abhängigkeiten:

```bash
npm install
```

2.3 **(Optional)** Falls du die OpenAPI-Schnittstellen nach Backend-Änderungen neu generieren möchtest:

* JSON-Spezifikation vom laufenden Backend unter http://localhost:8056/v3/api-docs abrufen.
* Den Inhalt in die Wurzel der Frontend-Ordner (``/frontend``) als ``swagger.json`` kopieren.
* Die OpenAPI-Client-Generierung ausführen:

```bash
npm run generate-api
```

2.4 Starte die Angular-Anwendung:

```bash
npm start # oder: ng serve
```

2.5 Die Anwendung ist standardmäßig unter http://localhost:4200 erreichbar.

---

## Testing

### Backend Tests

Um die Backend-Tests (**JUnit & Integrationstests**) auszuführen, navigiere in das Backend-Verzeichnis (``/backend``)
und führe den folgenden Befehl aus:

```bash
./mvnw test
```

### Frontend Tests

Die Frontend-Tests werden mit **Vitest** und **Jasmine** durchgeführt.
Um die Tests auszuführen, navigiere in das Frontend-Verzeichnis (``/frontend``) und führe den folgenden Befehl aus:

```bash
npm test # oder: ng test
```

### E2E-Tests (Playwright)

Die End-to-End-Tests werden mit **Playwright** durchgeführt.

Falls noch nicht geschehen, installiere die Playwright-Abhängigkeiten in Frontend-Verzeichnis (``/frontend``) mit dem folgenden Befehl:

```bash
npm install
npx playwright install
```

Um die E2E-Tests auszuführen, navigiere in das Frontend-Verzeichnis (``/frontend``) und führe den folgenden Befehl aus:

```bash
npx playwright test # Im Headless-Modus (Hintergrund) ausführen

npx playwright test --ui # Tests mit der Playwright UI-Oberfläche öffnen

npx playwright test --debug # Tests im Debug-Modus (Schritt-für-Schritt) öffnen
```


