<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Payment\PaymentRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        private readonly PaymentRepositoryInterface $paymentRepository,
        private readonly OrderRepositoryInterface $orderRepository
    ) {}

    public function store(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $order = $this->findOrder($data['order_id']);

            $this->validatePaymentAmount(
                $order,
                $data['amount']
            );

            return $this->paymentRepository->create([
                'order_id'     => $order->id,
                'amount'       => $data['amount'],
                'payment_date' => $data['payment_date'],
            ]);
        });
    }

    private function findOrder(string $id): Order
    {
        $order = $this->orderRepository->findById($id);
        abort_if(!$order, 404, 'Order not found.');

        return $order;
    }

    private function validatePaymentAmount(Order $order, float $amount): void
    {
        $paidAmount = $order->payments()->sum('amount');
        $remainingAmount = $order->total - $paidAmount;

        abort_if(
            $amount > $remainingAmount,
            422,
            'Payment amount exceeds the remaining balance.'
        );
    }
}
