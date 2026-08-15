<?php

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (Throwable $e, Request $request) {

            if (!$request->is('api/*')) {
                return null;
            }

            $status = $e instanceof HttpExceptionInterface
                ? $e->getStatusCode()
                : 500;

            $isDbError = $e instanceof QueryException;

            if ($status >= 500 || $isDbError) {
                Log::error($e->getMessage(), [
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => Auth::id(),
                    'exception' => get_class($e),
                    'trace' => $e->getTraceAsString(),
                ]);
            }

            // DB error ho ya 500+ ho, to hamesha generic message bhejo
            $message = ($status >= 500 || $isDbError)
                ? 'Something went wrong.'
                : $e->getMessage();

            return response()->json([
                'success' => false,
                'message' => $message,
            ], $isDbError ? 500 : $status);
        });
    })->create();
