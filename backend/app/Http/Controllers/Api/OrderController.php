<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $orders = $this->orderService->index();
        return OrderResource::collection($orders);
    }

    public function show(string $id): OrderResource
    {
        $order = $this->orderService->findById($id);
        return new OrderResource($order);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->store($request->validated());

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => new OrderResource($order->load('items'))
        ], 201);
    }

    public function update(UpdateOrderRequest $request, string $id): JsonResponse
    {
        $order = $this->orderService->findById($id);
        $order = $this->orderService->update($order, $request->validated());

        return response()->json([
            'message' => 'Order updated successfully.',
            'data' => new OrderResource($order->load('items')),
        ], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $order = $this->orderService->findById($id);
        $this->orderService->delete($order);

        return response()->json([
            'message' => 'Order deleted successfully.',
        ], 200);
    }
}
