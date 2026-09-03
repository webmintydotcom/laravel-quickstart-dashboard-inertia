<?php

declare(strict_types=1);

use App\Http\Controllers\AvatarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('auth')->group(function (): void {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/settings', [SettingsController::class, 'edit'])->name('settings');
    Route::patch('/settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');

    Route::post('/profile/avatar', [AvatarController::class, 'store'])->name('profile.avatar.store');
    Route::delete('/profile/avatar', [AvatarController::class, 'destroy'])->name('profile.avatar.destroy');

    Route::delete('/profile', [ProfileController::class, 'destroy'])->middleware('throttle:6,1')->name('profile.destroy');
    Route::delete('/profile/sessions', [SessionController::class, 'destroy'])->middleware('throttle:6,1')->name('profile.sessions.destroy');
});
