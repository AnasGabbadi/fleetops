<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    public function register() {}

    public function boot()
    {
        Route::middleware(['api', 'auth:sanctum'])
            ->prefix('int/v1')
            ->group(function () {
            Route::post('maintenance-requests',
                [\App\Http\Controllers\Internal\v1\MaintenanceRequestController::class, 'createRecord']
            );
        });
    
        Route::middleware(['api', 'auth:sanctum'])
            ->prefix('int/v1')
            ->group(function () {
            Route::post('maintenance-requests',
                [\App\Http\Controllers\Internal\v1\MaintenanceRequestController::class, 'createRecord']
            );
            Route::get('maintenance-requests',
                [\App\Http\Controllers\Internal\v1\MaintenanceRequestController::class, 'queryRecords']
            );
        });
    }
}
