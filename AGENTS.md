# AGENTS.md

Учебный каркас веб-приложения «Календарь звонков»: backend (Kotlin + Spring Boot)
и frontend (React + TypeScript + Vite). Бизнес-логики пока нет.

## Структура

```
backend/                       Kotlin + Spring Boot 4.1.1, JDK 21, Gradle Wrapper 9.7.1
  build.gradle.kts             зависимости, ktlint, версия (x-release-please-version)
  src/main/kotlin/             код приложения
  src/main/resources/          application.properties
  src/test/kotlin/             тесты, включая HealthSmokeTest (random port, /actuator/health)
frontend/                      React 19 + TypeScript 6.0 + Vite 8.3
  vite.config.ts               proxy /api -> http://localhost:8080
  eslint.config.js             ESLint flat config
  src/                         код приложения
.github/workflows/
  ci.yml                       push + pull_request: линтеры, тесты, типы, сборка
  release-please.yml           push в main: версия и CHANGELOG
  pr-title.yml                 проверка заголовка PR (Conventional Commits)
  hexlet-check.yml             НЕ ТРОГАТЬ (генерируется Хекслетом)
release-please-config.json     настройки релизов
.release-please-manifest.json  текущая версия
version.txt                    текущая версия (simple release type)
```

Версия `0.1.0` синхронизирована между `version.txt`, `.release-please-manifest.json`,
`backend/build.gradle.kts` (строка с `// x-release-please-version`) и
`frontend/package.json`. При релизе release-please обновляет все четыре файла.

## Проверенные команды

Бэкенд (Windows PowerShell):

```powershell
cd backend
.\gradlew.bat ktlintCheck test build
```

Бэкенд (Linux / macOS):

```bash
cd backend
./gradlew ktlintCheck test build
```

- Автоформат Kotlin: `.\gradlew.bat ktlintFormat` (или `./gradlew ktlintFormat`).
- Запуск: `.\gradlew.bat bootRun` (или `./gradlew bootRun`), health: `http://localhost:8080/actuator/health`.

Фронтенд:

```bash
cd frontend
npm ci            # или npm install при первом запуске
npm run lint
npm run typecheck
npm run build
```

- Запуск dev-сервера: `npm run dev` (http://localhost:5173).

Все команды из этого файла проверены локально.

## Формат коммитов

Используются [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

- `type`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- `scope` (опционально): `backend`, `frontend`, `ci`, `release` и т.п.
- Описание — в повелительном наклонении, на английском.

Примеры:

```
feat(backend): add health smoke test
fix(frontend): handle backend unavailable state
ci: run frontend typecheck on pull requests
```

release-please формирует версии и CHANGELOG именно из этих сообщений,
а `.github/workflows/pr-title.yml` проверяет заголовки PR.

## Правила для агентов

- Не удалять и не редактировать `.github/workflows/hexlet-check.yml`.
- Не коммитить `node_modules/`, `build/`, `dist/`.
- После изменений в backend запускать `ktlintCheck` (или `ktlintFormat`), после изменений во frontend — `lint` и `typecheck`.
