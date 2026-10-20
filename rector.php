<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use RectorLaravel\Rector\MethodCall\ContainerBindConcreteWithClosureOnlyRector;
use Rector\TypeDeclaration\Rector\ArrowFunction\AddArrowFunctionReturnTypeRector;

return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/app',
        __DIR__.'/database',
        __DIR__.'/public',
        __DIR__.'/tests',
    ])
    ->withComposerBased(laravel: true)
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        typeDeclarations: true,
        privatization: true,
        earlyReturn: true,
    )
    ->withSkip([
        // Infers a single return type for a closure that returns a union of response contracts.
        ContainerBindConcreteWithClosureOnlyRector::class,
        // Infers Pest's internal Mixins\Expectation, which is not what expect() returns.
        AddArrowFunctionReturnTypeRector::class => [__DIR__.'/tests'],
    ])
    ->withPhpSets();
