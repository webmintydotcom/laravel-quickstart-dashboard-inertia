# Laravel + React + Inertia.js Starter Kit

## Introduction

A starter kit for Laravel applications with React, Inertia.js, Shadcn UI, and Tailwind CSS v4. Designed to help you quickly set up a new full-stack Laravel project with a modern development environment.

## Installation

```bash
laravel new my-app --pest --npm --using=webmintydotcom/laravel-quickstart-inertia
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12, PHP 8.4 |
| Frontend | React 19, TypeScript |
| Routing | Inertia.js |
| UI Components | Shadcn UI |
| Styling | Tailwind CSS v4 |
| Build | Vite 7 |
| Testing | Pest, Larastan |

## Included Packages

- [Laravel](#laravel)
  - [Inertia.js](#inertiajs)
  - [Ziggy](#ziggy)
  - [Spatie Laravel Data](#spatie-laravel-data)
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

Version **12** of Laravel is used in this starter kit.

#### Inertia.js

Inertia.js connects the Laravel backend to the React frontend without needing an API. Pages are React components rendered via `Inertia::render()` in your routes and controllers.

[Homepage](https://inertiajs.com/) | [Docs](https://inertiajs.com/how-it-works)

#### Ziggy

Ziggy provides a `route()` helper in JavaScript, so you can use Laravel named routes in your React components.

[Docs](https://github.com/tighten/ziggy)

#### Spatie Laravel Data

Spatie Laravel Data is included to help you create data transfer objects (DTOs) in a simple and elegant way.

[Docs](https://spatie.be/docs/laravel-data/v4/introduction)

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