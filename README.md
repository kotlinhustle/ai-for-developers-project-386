# Календарь звонков

[![hexlet-check](https://github.com/kotlinhustle/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kotlinhustle/ai-for-developers-project-386/actions)

Учебный проект Хекслета: сервис для бронирования календаря.
Программа: https://ru.hexlet.io/programs/ai-for-developers

Текущая версия каркаса — учебная, без бизнес-логики.

## Стек

- **backend/** — Kotlin, Spring Boot 4.1.1, JDK 21, Gradle Kotlin DSL + Gradle Wrapper 9.7.1, Spring Boot Actuator.
- **frontend/** — React 19, TypeScript 6.0, Vite 8.3, react-router 8, ESLint, Vitest + Testing Library.

Зафиксированные версии: Spring Boot `4.1.1`, Kotlin `2.3.21`, Gradle `9.7.1`, React `19.3.0`, Vite `8.3.4`, TypeScript `~6.0.2`, ESLint `10.12.0`, ktlint-gradle `14.2.0`.

Ограничение зависимостей frontend: `react-router` — **единственная новая runtime-зависимость**. Всё тестовое (Vitest, Testing Library, jsdom) — только `devDependencies`.

## Структура

```
.
├── backend/                     # Kotlin + Spring Boot
│   ├── src/main/kotlin/         # код приложения
│   ├── src/main/resources/      # application.properties
│   ├── src/test/kotlin/         # тесты (в т.ч. HealthSmokeTest)
│   └── build.gradle.kts
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/               # HomePage, BookingPage
│   │   └── App.test.tsx         # тесты (Vitest + Testing Library)
│   ├── vite.config.ts           # proxy /api -> backend, конфиг Vitest
│   └── eslint.config.js
├── .github/workflows/           # CI, release-please, проверка заголовков PR
├── release-please-config.json   # настройки релизов
├── .release-please-manifest.json
└── version.txt
```

## Требования

- JDK 21
- Node.js 24 и npm
- (опционально) IntelliJ IDEA

Gradle устанавливать не нужно — используется wrapper из `backend/`.

## Запуск бэкенда

Windows (PowerShell):

```powershell
cd backend
.\gradlew.bat bootRun
```

Linux / macOS:

```bash
cd backend
./gradlew bootRun
```

Проверка:

```bash
curl http://localhost:8080/actuator/health
# {"status":"UP"}
```

## Запуск фронтенда

```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:5173 — на главной странице описано, как работает
сервис, а кнопка «Записаться на звонок» ведёт на `/booking`. Запросы к `/api/*`
проксируются на `http://localhost:8080` (см. `frontend/vite.config.ts`).

## Проверки

Бэкенд (линтер, тесты, сборка):

Windows:

```powershell
cd backend
.\gradlew.bat ktlintCheck test build
```

Linux / macOS:

```bash
cd backend
./gradlew ktlintCheck test build
```

Автоформат Kotlin-кода: замените `ktlintCheck` на `ktlintFormat`.

Фронтенд (линтер, типы, сборка):

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

## CI и релизы

- `.github/workflows/ci.yml` — на `push` и `pull_request` запускает линтеры,
  тесты, проверку типов и сборку обоих проектов.
- `.github/workflows/release-please.yml` — на push в `main` обновляет версию и
  CHANGELOG на основе Conventional Commits.
- `.github/workflows/pr-title.yml` — проверяет, что заголовок PR соответствует
  Conventional Commits.

Версия приложения (`0.1.0`) синхронизирована между `version.txt`,
`.release-please-manifest.json`, `backend/build.gradle.kts` и
`frontend/package.json`. release-please обновляет все эти файлы при релизе.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
