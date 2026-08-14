<?php

namespace App\Services;

use App\Models\Order;
use App\Repositories\Order\OrderRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository
    ) {}

    public function index()
    {
        return $this->orderRepository->paginate();
    }

    public function findById(string $id): Order
    {
        $order = $this->orderRepository->findById($id);

        if (!$order) {
            abort(404, 'Order not found.');
        }

        return $order;
    }

    private function calculateTotal(Order $order): float
    {
        return (float) $order->items()
            ->sum(DB::raw('quantity * unit_price'));
    }

    public function store(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = $this->orderRepository->create([
                'user_id' => Auth::id(),
                'customer_name' => $data['customer_name'],
                'due_date' => $data['due_date'],
                'total' => 0,
            ]);

            $order->items()->createMany($data['items']);

            $total = $this->calculateTotal($order);

            $this->orderRepository->update($order, [
                'total' => $total,
            ]);

            return $order;
        });
    }

    private function syncItems(Order $order, array $items): void
    {
        $existingItems = $order->items()
            ->get()
            ->keyBy('id');

        $requestItemIds = [];

        foreach ($items as $item) {
            if (!empty($item['id'])) {
                $existingItem = $existingItems->get($item['id']);

                abort_if(!$existingItem, 404, 'Order item not found.');

                $existingItem->update([
                    'description' => $item['description'],
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                ]);

                $requestItemIds[] = $existingItem->id;

                continue;
            }

            $newItem = $order->items()->create([
                'description' => $item['description'],
                'quantity'    => $item['quantity'],
                'unit_price'  => $item['unit_price'],
            ]);

            $requestItemIds[] = $newItem->id;
        }

        $order->items()
            ->whereNotIn('id', $requestItemIds)
            ->delete();
    }

    public function update(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $this->syncItems($order, $data['items']);
            $total = $this->calculateTotal($order);

            $this->orderRepository->update($order, [
                'customer_name' => $data['customer_name'],
                'due_date'      => $data['due_date'],
                'total'         => $total,
            ]);

            return $order;
        });
    }

    public function delete(Order $order): void
    {
        $this->orderRepository->delete($order);
    }
}
