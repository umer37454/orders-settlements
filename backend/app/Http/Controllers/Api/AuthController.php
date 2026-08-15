<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request)
    {
        $response = $this->authService->register($request->validated());

        return response()->json([
            'message' => $response['message'],
            'user' => new UserResource($response['user']),
            'token' => $response['token'],
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $response = $this->authService->login($request->validated());

        return response()->json([
            'message' => $response['message'],
            'user' => new UserResource($response['user']),
            'token' => $response['token'],
        ]);
    }

    public function logout(Request $request)
    {
        $response = $this->authService->logout($request->user());
        return response()->json($response);
    }
}
