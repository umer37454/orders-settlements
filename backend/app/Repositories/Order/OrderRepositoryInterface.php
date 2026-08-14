<?php

namespace App\Repositories\Order;

use App\Models\Order;

interface OrderRepositoryInterface
{
    public function create(array $data): Order;

    public function update(Order $order, array $data): bool;

    public function paginate(int $perPage = 10);

    public function findById(string $id): ?Order;

    public function delete(Order $order): bool;
}
