<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    protected function status(): Attribute
    {
        return Attribute::make(
            get: function () {
                $paidAmount = $this->payments->sum('amount');
                $dueDate = Carbon::parse($this->due_date);

                if ($paidAmount >= $this->total) {
                    return 'paid';
                }

                if ($dueDate->isToday()) {
                    return 'due';
                }

                if ($paidAmount > 0) {
                    if ($dueDate->isPast()) {
                        return 'overdue';
                    }

                    return 'partially_paid';
                }

                if ($dueDate->isPast()) {
                    return 'overdue';
                }

                return 'pending';
            }
        );
    }

    protected function paidAmount(): Attribute
    {
        return Attribute::make(
            get: fn() => number_format(
                $this->payments->sum('amount'),
                2,
                '.',
                ''
            ),
        );
    }

    protected function remainingAmount(): Attribute
    {
        return Attribute::make(
            get: fn() => number_format(
                max(
                    0,
                    $this->total - $this->payments->sum('amount')
                ),
                2,
                '.',
                ''
            ),
        );
    }
}
