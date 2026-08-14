<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService
    ) {}

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->store(
            $request->validated()
        );

        return response()->json([
            'message' => 'Payment recorded successfully.',
            'data' => new PaymentResource($payment),
        ], 201);
    }
}
