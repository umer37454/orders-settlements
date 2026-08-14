<?php

namespace App\Repositories\Order;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderRepository implements OrderRepositoryInterface
{
    public function create(array $data): Order
    {
        return Order::create($data);
    }

    public function update(Order $order, array $data): bool
    {
        return $order->update($data);
    }

    public function paginate(int $perPage = 10)
    {
        return Order::with(['items', 'payments'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate($perPage);
    }

    public function findById(string $id): ?Order
    {
        return Order::where('user_id', Auth::id())
            ->with(['items', 'payments'])
            ->find($id);
    }

    public function delete(Order $order): bool
    {
        return $order->delete();
    }
}
