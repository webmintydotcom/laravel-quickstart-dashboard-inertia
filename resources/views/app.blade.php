<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="{{ $appearance }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    />

    <script>
        // Only 'system' needs resolving. 'light' and 'dark' are already correct
        // in the server response, so this script does nothing for them.
        (function () {
            var root = document.documentElement;

            if (root.className !== 'system') {
                return;
            }

            root.className = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        })();
    </script>
    @inertiaHead
    @routes
    @viteReactRefresh
    @vite (['resources/js/app.tsx'])
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
