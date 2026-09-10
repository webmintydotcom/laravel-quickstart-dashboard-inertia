<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    // Registered by the removable demo. See the README's demo section - deleting
    // this line is step 2 of the removal contract.
    App\Demo\DemoServiceProvider::class,
];
