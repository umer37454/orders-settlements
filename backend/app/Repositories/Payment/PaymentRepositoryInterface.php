<?php

namespace App\Repositories\Payment;

use App\Models\Payment;

interface PaymentRepositoryInterface
{
    public function create(array $data): Payment;
}
