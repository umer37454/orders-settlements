<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $paidAmount = $this->payments->sum('amount');

        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'due_date' => $this->due_date,
            'total' => $this->total,
            'status' => $this->status,
            'paid_amount' => $this->paid_amount,
            'remaining_amount' => $this->remaining_amount,

            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
