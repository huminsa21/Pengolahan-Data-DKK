<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDusunRequest extends FormRequest
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
            'kode_dusun' => ['nullable', 'string', 'max:255', Rule::unique('dusun', 'kode_dusun')],
            'nama_dusun' => ['required', 'string', 'max:255'],
            'kepala_dusun' => ['nullable', 'string', 'max:255'],
            'no_hp_kepala_dusun' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
