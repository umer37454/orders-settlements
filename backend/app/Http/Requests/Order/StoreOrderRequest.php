<?php

namespace App\Http\Requests\Order;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'due_date' => ['required', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required.',
            'customer_name.string'   => 'Customer name must be a valid text.',
            'customer_name.max'      => 'Customer name cannot exceed 255 characters.',

            'due_date.required' => 'Due date is required.',
            'due_date.date'     => 'Due date must be a valid date.',

            'items.required' => 'At least one item is required.',
            'items.array'    => 'Items must be a valid list.',
            'items.min'      => 'At least one item is required.',

            'items.*.description.required' => 'Description is required for item #:position.',
            'items.*.description.string'   => 'Description must be valid text for item #:position.',
            'items.*.description.max'      => 'Description cannot exceed 255 characters for item #:position.',

            'items.*.quantity.required' => 'Quantity is required for item #:position.',
            'items.*.quantity.integer'  => 'Quantity must be a whole number for item #:position.',
            'items.*.quantity.min'      => 'Quantity must be at least 1 for item #:position.',

            'items.*.unit_price.required' => 'Unit price is required for item #:position.',
            'items.*.unit_price.numeric'  => 'Unit price must be a valid number for item #:position.',
            'items.*.unit_price.min'      => 'Unit price cannot be negative for item #:position.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'customer_name' => 'Customer Name',
            'due_date'       => 'Due Date',
        ];
    }
}
