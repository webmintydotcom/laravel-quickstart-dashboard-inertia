# Laravel + React + Inertia.js + Dashboard Starter Kit

## Introduction

A starter kit for Laravel applications with React, Inertia.js, Shadcn UI, and Tailwind CSS v4.
Designed to help you quickly set up a new full-stack Laravel project with a modern development environment.

Out of the box it ships Fortify-backed authentication screens, an authenticated app shell (sidebar, top bar,
light/dark/system appearance), a Settings page, a Profile page, and two removable demo pages: a dashboard that
shows every panel state a data-driven page needs, and a vehicle list, detail and edit flow that shows real
server-side search, filtering, sorting and pagination. See [Application Shell](#application-shell) for the details.

## Installation

```bash
laravel new my-app --pest --npm --using=webmintydotcom/laravel-quickstart-dashboard-inertia
```

## Tech Stack

| Layer | Technology           |
|-------|----------------------|
| Backend | Laravel 13, PHP 8.4  |
| Frontend | React 19, TypeScript |
| Routing | Inertia.js           |
| Auth | Laravel Fortify      |
| UI Components | Shadcn UI            |
| Styling | Tailwind CSS v4      |
| Build | Vite 8               |
| Testing | Pest, Larastan       |

## Included Packages

- [Laravel](#laravel)
  - [Inertia.js](#inertiajs)
  - [Ziggy](#ziggy)
  - [Spatie Laravel Data](#spatie-laravel-data)
  - [Laravel Fortify](#laravel-fortify)
  - [Intervention Image](#intervention-image)
  - [Laravel Person Name](#laravel-person-name)
  - [Hashids](#hashids)
- [Frontend](#frontend)
  - [React](#react)
  - [Shadcn UI](#shadcn-ui)
  - [Tailwind CSS](#tailwind-css)
  - [Toast Notifications](#toast-notifications)
- [Debugging](#debugging)
  - [Spatie Laravel Ray](#spatie-laravel-ray)
- [Testing](#testing)
  - [Pest](#pest)
    - [Spatie Pest Expectations](#spatie-pest-expectations)
    - [Pest Plugin - Faker](#pest-plugin---faker)
    - [Pest Plugin - Laravel](#pest-plugin---laravel)
    - [Pest Plugin - Type Coverage](#pest-plugin---type-coverage)
    - [Pest Plugin - Browser](#pest-plugin---browser)
  - [Laravel Pao](#laravel-pao)
  - [Larastan](#larastan)
  - [Pint](#pint)
  - [Rector Laravel](#rector-laravel)
- [Formatting](#formatting)
  - [Prettier](#prettier)
    - [Prettier Plugin - Tailwind CSS](#prettier-plugin---tailwind-css)
    - [Prettier Plugin - Blade](#prettier-plugin---blade)
- [AI Tooling](#ai-tooling)
  - [Laravel Boost Guidelines](#laravel-boost-guidelines)

### Laravel

Version **13** of Laravel is used in this starter kit.

#### Inertia.js

Inertia.js connects the Laravel backend to the React frontend without needing an API. Pages are React components rendered via `Inertia::render()` in your routes and controllers.

[Homepage](https://inertiajs.com/) | [Docs](https://inertiajs.com/how-it-works)

#### Ziggy

Ziggy provides a `route()` helper in JavaScript, so you can use Laravel named routes in your React components.

[Docs](https://github.com/tighten/ziggy)

#### Spatie Laravel Data

Spatie Laravel Data is included to help you create data transfer objects (DTOs) in a simple and elegant way.

[Docs](https://spatie.be/docs/laravel-data/v4/introduction)

#### Laravel Fortify

Fortify is the authentication backend. There are no auth controllers in this starter kit. Fortify registers the routes, and this app supplies the React screens and the actions behind them. Four of Fortify's features are enabled in `config/fortify.php`: registration, password reset, profile information updates and password updates. Everything else it ships (email verification, two-factor authentication, passkeys) is deliberately switched off, and you enable one by adding it back to the `features` array.

That gives you `/login`, `/register`, `/forgot-password`, `/reset-password/{token}` and `/user/confirm-password`, rendered by the Inertia pages in `resources/js/Pages/Auth/`, plus the `PUT /user/profile-information` and `PUT /user/password` endpoints that the [Profile page](#profile-page) submits to. The views are bound in `app/Providers/FortifyServiceProvider.php` and the actions behind each feature (create user, reset password, update profile information, update password) live in `app/Actions/Fortify/`. A successful login, registration or password confirmation lands on `/dashboard`.

Password reset needs real mail configuration in production. `.env.example` ships `MAIL_MAILER=log`, so reset links are written to `storage/logs/laravel.log` locally instead of being delivered.

[Docs](https://laravel.com/framework/docs/13.x/fortify)

#### Intervention Image

Intervention Image does the server-side avatar resizing in `app/Actions/Profile/StoreAvatar.php` (see [Profile Page](#profile-page)).

[Homepage](https://image.intervention.io/) | [Docs](https://image.intervention.io/v4)

#### Laravel Person Name

A validation rule (`ValidPersonName`) for first and last names, applied by the Fortify create-user and update-profile actions.

[Docs](https://github.com/webmintydotcom/laravel-person-name)

#### Hashids

A Hashids bridge for Laravel, included for obfuscating sequential ids in URLs. Nothing in the starter kit uses it yet; it is installed and configured so it is ready when you need it.

[Docs](https://github.com/vinkla/laravel-hashids)

### Frontend

#### React

React 19 with TypeScript. Entry point is `resources/js/app.tsx` with SSR support via `resources/js/ssr.tsx`.

[Docs](https://react.dev/)

#### Shadcn UI

Pre-configured with `components.json` pointing to `resources/js/components/ui/`. Includes all required dependencies (Radix UI, class-variance-authority, clsx, tailwind-merge, Lucide icons).

[Homepage](https://ui.shadcn.com/) | [Docs](https://ui.shadcn.com/docs)

#### Tailwind CSS

Tailwind CSS v4 with the Vite plugin. Configured with Shadcn's full oklch color palette and dark mode support.

[Homepage](https://tailwindcss.com/) | [Docs](https://tailwindcss.com/docs/installation)

#### Toast Notifications

`goey-toast` powers the flash-message toaster (`resources/js/components/flash-toaster.tsx`). It declares
`framer-motion` as a non-optional peer dependency (floor `>=10.0.0`), so `framer-motion` is installed either
way; it is listed directly in `package.json` at `^13.2.0` so the resolved version is one we choose rather
than one that drifts to goey-toast's much older floor. Nothing in `resources/js` imports `framer-motion`
directly, so do not remove it thinking it is unused.

[Homepage](https://goey-toast.vercel.app) | [Docs](https://github.com/anl331/goey-toast)

### Debugging

#### Spatie Laravel Ray

Spatie Laravel Ray is included to help you debug your Laravel applications with ease.

[Homepage](https://myray.app/) | [Docs](https://myray.app/docs/getting-started/introduction)

### Testing

#### Pest

Pest is included to help you write expressive and elegant tests for your Laravel applications.

[Homepage](https://pestphp.com/) | [Docs](https://pestphp.com/docs/installation)

##### Spatie Pest Expectations

[Docs](https://github.com/spatie/pest-expectations)

##### Pest Plugin - Faker

[Docs](https://pestphp.com/docs/plugins#faker)

##### Pest Plugin - Laravel

[Docs](https://pestphp.com/docs/plugins#laravel)

##### Pest Plugin - Type Coverage

[Docs](https://pestphp.com/docs/type-coverage)

##### Pest Plugin - Browser

Browser testing through Playwright. `tests/Pest.php` already binds the `Browser` directory to the Laravel test case, so create `tests/Browser/` and start writing `visit()` tests. `playwright` is in `devDependencies`; run `npx playwright install` once before the first browser test.

[Docs](https://pestphp.com/docs/browser-testing)

#### Laravel Pao

Pao reformats Pest and PHPStan output into a compact form that is easier for AI coding agents to read.

[Docs](https://github.com/laravel/pao)

#### Larastan

Larastan is included to help you catch type errors in your Laravel applications using PHPStan.

[Docs](https://github.com/larastan/larastan)

#### Pint

Pint is included to help you format your Laravel code according to the Webminty coding standard.

[Docs](https://laravel.com/framework/docs/13.x/pint)

#### Rector Laravel

Rector, with the Laravel rule set, is included to help you refactor and upgrade your codebase automatically.

[Docs](https://github.com/driftingly/rector-laravel)

### Formatting

#### Prettier

Prettier is included to help you format your code consistently across your project.

[Homepage](https://prettier.io/) | [Docs](https://prettier.io/docs/en/index.html)

##### Prettier Plugin - Tailwind CSS

[Docs](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

##### Prettier Plugin - Blade

[Docs](https://github.com/stillat/blade-parser-typescript)

### AI Tooling

#### Laravel Boost Guidelines

Webminty's Laravel and PHP coding guidelines, packaged for [Laravel Boost](https://github.com/laravel/boost) so AI coding agents working in this repository follow the same conventions the human contributors do.

[Docs](https://webminty.com)

## Development

`composer run dev` starts the PHP server, queue listener, log tail and Vite together. `composer run dev:ssr` does the same with the Inertia SSR server instead of the Vite dev server (it builds the SSR bundle first).

| Task | Command |
|------|---------|
| Tests | `vendor/bin/pest` |
| Static analysis | `vendor/bin/phpstan` |
| PHP formatting | `vendor/bin/pint` |
| Rector | `vendor/bin/rector` |
| TypeScript check | `npm run typecheck` |
| Prettier | `npm run format` (or `format:check`) |
| Production build | `npm run build` (add `:ssr` for the SSR bundle) |

## Application Shell

The authenticated app (sidebar, top bar, and pages like Settings) ships as a starting shell, not a finished product.

- **Navigation** is a single list edited in `resources/js/components/app-shell/navigation.ts`. Add, remove, or reorder entries there rather than hunting through the sidebar and mobile drawer components separately.
- **Appearance** (light/dark/system) lives on the authenticated user's record, so it follows them across devices. It's also mirrored into an `appearance` cookie on save, purely so the very first server-rendered response can paint the right theme before Inertia props are available - without that mirror, the page would flash the wrong theme on load. The cookie is `httpOnly` and read only on the server; no JavaScript touches it. It's exempt from Laravel's cookie encryption in `bootstrap/app.php`, sharing that exemption list with the `sidebar_collapsed` cookie below, which JavaScript genuinely does read and write.
- **Sidebar collapse** is stored in a cookie rather than `localStorage`. This starter has SSR wired up, and `localStorage` isn't available during a server render - a cookie is, so the collapsed/expanded state can be read on the very first render instead of flashing open and then collapsing.
- **Originality is still your job.** This shell (layout, components, and defaults) is intentionally generic so it can serve any product. A real product built on this starter still needs its own product promise and a signature visual device that makes it feel like something, not a starter kit.

### Profile Page

`/profile` (`resources/js/Pages/Profile.tsx`) gives the signed-in user five independent forms, each backed by its own controller and validated into its own named Laravel error bag: profile information (name/email) and password (both submitted to Fortify's own endpoints), avatar, browser sessions, and account deletion. Each form's `useForm()` call passes its bag name only as the `errorBag` request option on that form's submit call, so a validation error from one form never renders under another form's field - this only works because every submit call names its bag explicitly. Never pass that bag name (or anything else) as a leading string argument to `useForm()` itself: in @inertiajs/react that argument is a history remember key, which mirrors the form's state into `window.history.replaceState` on every keystroke, and three of these forms hold a plaintext password.

Avatars are resized to a 256px square WebP (`app/Actions/Profile/StoreAvatar.php`) and stored on the `public` disk. That disk is only browser-reachable through the `storage` symlink, which `php artisan storage:link` creates - already wired into `composer.json`'s `post-create-project-cmd`, so a fresh `laravel new --using=...` install has it from the start. If avatars 404 in an existing checkout, run `php artisan storage:link` yourself.

The browser sessions list and "Log out other devices" both depend on `SESSION_DRIVER=database` - they read from and delete rows in the `sessions` table. With any other driver the list renders empty and the logout button evicts nobody, though it still reports success.

Two features Fortify ships are still switched off and are not part of this page: email verification and two-factor authentication. Both are cycle 2b work - enabling them means adding a "Verify email" prompt and a two-factor section here.

### Demo Pages

Two of this starter's routes render a worked example rather than a blank page, so a cloned application has real
layouts, states, and content density to hold itself to instead of starting from nothing. Both are fiction -
fixed sample data, not features meant to ship - and both are built to be deleted together.

- **`/dashboard`** - a customer-onboarding pipeline: metrics, a chart, an attention queue and a table. The page
  shape a dashboard needs.
- **`/vehicles`** - a fleet of 45 vehicles, listed, viewed and edited. The page shape almost every dashboard
  application actually needs next: a list with real server-side search, filtering, sorting and pagination; a
  detail view; and a form that validates and saves.

The two use deliberately unrelated vocabularies. That is the honest signal that both are disposable examples
rather than two halves of a half-built product.

#### States

Every dashboard panel reads its state from a `?state=` query switch:

- `populated` (default) - every panel ready with sample data.
- `empty` - every panel in its empty, first-run state.
- `loading` - every panel showing its skeleton.
- `partial` - the chart panel is unavailable while everything else stays ready. Demonstrates that one stalled
  panel shouldn't block the rest of the page.
- `error` - everything ready except the chart, which shows a load failure and a retry action.

The vehicle list carries the same switch, with the two states a list has: `?state=empty` for a fleet with
nothing in it yet, and `?state=loading` for the skeleton. The detail and edit pages have none - they always
have a record, so an empty state there would be invented rather than demonstrated. Filtering to nothing is a
third, different state, and the list says so in different words with a way to undo it: try `/vehicles?q=zzzz`.

An unrecognised value falls back to the populated state rather than erroring.

#### Data

The dashboard's numbers come from a deterministic PHP provider with no database behind it. The vehicles are a
real table, `demo_vehicles`, because an edit form that appears to save but changes nothing teaches the wrong
thing, and search, sorting and pagination are only worth copying if they are the real server-side
implementations.

That table is created **and populated** by a migration inside `app/Demo/`, loaded by
`App\Demo\DemoServiceProvider`. A migration that seeds is unusual on purpose: it means a fresh clone is
populated by `php artisan migrate` alone, every test starts from the same 45 rows, and removing the demo never
has to touch `database/seeders/DatabaseSeeder.php`. The cost is that those rows exist in every test's database,
including tests that have nothing to do with vehicles.

#### Removing both

```bash
rm -rf app/Demo resources/js/Pages/Demo tests/Feature/Demo
```

`chart.js` is a dependency only the demo uses (via `resources/js/Pages/Demo/chart.tsx`); it can be uninstalled
in the same pass with `npm uninstall chart.js`.

Then three one-line edits:

1. In `bootstrap/providers.php`, delete the `App\Demo\DemoServiceProvider::class` entry.
2. In `routes/web.php`, point the `dashboard` route back at the fallback controller that already sits in the
   tree unrouted for exactly this, restore its import, and delete the four `vehicles.*` routes:

   ```php
   Route::get('/dashboard', DashboardController::class)->name('dashboard');
   ```

   The route's `name('dashboard')` does not change, so the Dashboard entry in
   `resources/js/components/app-shell/navigation.ts` needs no edit - it links by route name, not by component.
3. In `resources/js/components/app-shell/navigation.ts`, delete the `Vehicles` entry and the now-unused `Car`
   icon import.

One thing the contract cannot do for you: deleting the migration does not drop `demo_vehicles` from a database
that has already run it. A fresh clone never creates the table. An existing install drops it by hand.

A test suite enforces the rest as the starter grows. The isolation test under the demo's own test directory
fails the build the moment anything outside those three directories references the demo namespace, so a stray
import can't quietly widen the removal surface. `routes/web.php` and `bootstrap/providers.php` are its only two
exceptions, both named explicitly. Laravel's generated provider manifest under `bootstrap/cache/` is also
exempt from the scan, because it is build output that regenerates itself and is never committed - a reader who
greps for the demo's name and finds a hit in `bootstrap/cache/services.php` should not conclude the removal
contract is broken. The navigation entry is the one piece no scan can catch - it links by route name and
contains nothing that looks like the demo - so it has a test of its own that disappears along with the demo.

This contract was executed for real - directories deleted, provider and routes and navigation stripped, full
suite and production build run - as part of building this work, to prove it rather than just assert it.

#### What is not part of the demo

`table`, `skeleton`, `badge`, `select`, `switch` and `textarea` in `components/ui/` are general-purpose
primitives used elsewhere too, and are not part of the removal. Neither is `components/form-field.tsx`, which
the vehicle form uses and the profile and auth pages use too.

The demo's own components live under its page directory rather than the shared `components/` tree - a
deliberate deviation - specifically so that deleting the demo never means picking components back out of a
shared folder.

#### What the tests don't cover

There are no browser tests in this repository, and the vehicle list has two behaviours that only a browser
exercises: the debounce on the search box (the server-side result of a search is tested; the fact that typing
issues one request rather than one per keystroke is not), and the click behaviour of a sortable column header
(the sorted result is tested; the header's own state is not). `?state=loading` proves the skeleton branch
renders - not that it appears at the right moment during a real in-flight visit.

## Additional Configurations

Changes to the default Laravel files are included in this starter kit to improve performance and developer experience.

### app/Providers/AppServiceProvider.php

```php
Model::preventLazyLoading();

if ($this->app->isProduction()) {
    Model::handleLazyLoadingViolationUsing(function ($model, $relation) {
        $class = get_class($model);

        info("Attempted to lazy load [{$relation}] on model [{$class}].");
    });
    DB::prohibitDestructiveCommands();
} else {
    Model::preventAccessingMissingAttributes();
    Model::preventSilentlyDiscardingAttributes();
    Model::shouldBeStrict();
}

Vite::usePrefetchStrategy('aggressive');
```

Thank you
[Webminty](https://webminty.com) Team