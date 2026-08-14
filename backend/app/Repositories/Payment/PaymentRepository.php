<?php

namespace App\Repositories\Payment;

use App\Models\Payment;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function create(array $data): Payment
    {
        return Payment::create($data);
    }
}
