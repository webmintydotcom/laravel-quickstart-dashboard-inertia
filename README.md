# Laravel + React + Inertia.js + Dashboard Starter Kit

## Introduction

A starter kit for Laravel applications with React, Inertia.js, Shadcn UI, and Tailwind CSS v4. 
Designed to help you quickly set up a new full-stack Laravel project with a modern development environment.

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
- [Frontend](#frontend)
  - [React](#react)
  - [Shadcn UI](#shadcn-ui)
  - [Tailwind CSS](#tailwind-css)
- [Debugging](#debugging)
  - [Spatie Laravel Ray](#spatie-laravel-ray)
- [Testing](#testing)
  - [Pest](#pest)
    - [Spatie Pest Expectations](#spatie-pest-expectations)
    - [Pest Plugin - Faker](#pest-plugin---faker)
    - [Pest Plugin - Laravel](#pest-plugin---laravel)
    - [Pest Plugin - Type Coverage](#pest-plugin---type-coverage)
  - [Larastan](#larastan)
  - [Pint](#pint)
  - [Rector](#rector)
- [Formatting](#formatting)
  - [Prettier](#prettier)
    - [Prettier Plugin - Tailwind CSS](#prettier-plugin---tailwind-css)
    - [Prettier Plugin - Blade](#prettier-plugin---blade)

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

Fortify is the authentication backend. There are no auth controllers in this starter kit. Fortify registers the routes, and this app supplies the React screens and the actions behind them. Only two of Fortify's features are enabled in `config/fortify.php`: registration and password reset. Everything else it ships (email verification, two-factor authentication, passkeys, profile and password updates) is deliberately switched off, and you enable one by adding it back to the `features` array.

That leaves `/login`, `/register`, `/forgot-password`, `/reset-password/{token}` and `/user/confirm-password`, rendered by the Inertia pages in `resources/js/Pages/Auth/`. The views are bound in `app/Providers/FortifyServiceProvider.php` and the create-user and reset-password actions live in `app/Actions/Fortify/`. A successful login, registration or password confirmation lands on `/dashboard`.

Password reset needs real mail configuration in production. `.env.example` ships `MAIL_MAILER=log`, so reset links are written to `storage/logs/laravel.log` locally instead of being delivered.

[Docs](https://laravel.com/docs/12.x/fortify)

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

#### Larastan

Larastan is included to help you catch type errors in your Laravel applications using PHPStan.

[Docs](https://github.com/larastan/larastan)

#### Pint

Pint is included to help you format your Laravel code according to the Webminty coding standard.

[Docs](https://laravel.com/docs/12.x/pint)

#### Laravel Rector

Rector is included to help you refactor and upgrade your Laravel codebase automatically.

[Docs](https://github.com/driftingly/rector-laravel)

### Formatting

#### Prettier

Prettier is included to help you format your code consistently across your project.

[Homepage](https://prettier.io/) | [Docs](https://prettier.io/docs/en/index.html)

##### Prettier Plugin - Tailwind CSS

[Docs](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

##### Prettier Plugin - Blade

[Docs](https://github.com/stillat/blade-parser-typescript)

## Application Shell

The authenticated app (sidebar, top bar, and pages like Settings) ships as a starting shell, not a finished product.

- **Navigation** is a single list edited in `resources/js/components/app-shell/navigation.ts`. Add, remove, or reorder entries there rather than hunting through the sidebar and mobile drawer components separately.
- **Appearance** (light/dark/system) lives on the authenticated user's record, so it follows them across devices. It's also mirrored into an `appearance` cookie on save, purely so the very first server-rendered response can paint the right theme before Inertia props are available - without that mirror, the page would flash the wrong theme on load. The cookie is `httpOnly` and read only on the server; no JavaScript touches it. It's exempt from Laravel's cookie encryption in `bootstrap/app.php`, sharing that exemption list with the `sidebar_collapsed` cookie below, which JavaScript genuinely does read and write.
- **Sidebar collapse** is stored in a cookie rather than `localStorage`. This starter has SSR wired up, and `localStorage` isn't available during a server render - a cookie is, so the collapsed/expanded state can be read on the very first render instead of flashing open and then collapsing.
- **Originality is still your job.** This shell (layout, components, and defaults) is intentionally generic so it can serve any product. A real product built on this starter still needs its own product promise and a signature visual device that makes it feel like something, not a starter kit - see DESIGN.md §4.

### Profile Page

`/profile` (`resources/js/Pages/Profile.tsx`) gives the signed-in user five independent forms, each backed by its own controller and validated into its own named Laravel error bag: profile information (name/email, via Fortify), password, avatar, browser sessions, and account deletion. Each form's `useForm()` call passes its bag name only as the `errorBag` request option on that form's submit call, so a validation error from one form never renders under another form's field - this only works because every submit call names its bag explicitly. Never pass that bag name (or anything else) as a leading string argument to `useForm()` itself: in @inertiajs/react that argument is a history remember key, which mirrors the form's state into `window.history.replaceState` on every keystroke, and three of these forms hold a plaintext password.

Avatars are resized to a 256px square WebP (`app/Actions/Profile/StoreAvatar.php`) and stored on the `public` disk. That disk is only browser-reachable through the `storage` symlink, which `php artisan storage:link` creates - already wired into `composer.json`'s `post-create-project-cmd`, so a fresh `laravel new --using=...` install has it from the start. If avatars 404 in an existing checkout, run `php artisan storage:link` yourself.

The browser sessions list and "Log out other devices" both depend on `SESSION_DRIVER=database` - they read from and delete rows in the `sessions` table. With any other driver the list renders empty and the logout button evicts nobody, though it still reports success.

Two features Fortify ships are still switched off and are not part of this page: email verification and two-factor authentication. Both are cycle 2b work - enabling them means adding a "Verify email" prompt and a two-factor section here.

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