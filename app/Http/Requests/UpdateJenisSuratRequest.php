<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJenisSuratRequest extends FormRequest
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
            'kode_surat' => ['required', 'string', 'max:50', 'alpha_dash:ascii', Rule::unique('jenis_surat', 'kode_surat')->ignore($this->route('jenis_surat')?->id)],
            'nama_surat' => ['required', 'string', 'max:255'],
            'template_surat' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
