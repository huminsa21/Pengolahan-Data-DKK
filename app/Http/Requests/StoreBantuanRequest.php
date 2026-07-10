<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBantuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kode_bantuan' => ['required', 'string', 'max:255', 'unique:bantuan,kode_bantuan'],
            'nama_bantuan' => ['required', 'string', 'max:255'],
            'jenis_bantuan' => ['required', 'string', 'max:255'],
            'sumber_bantuan' => ['required', 'string', 'max:255'],
            'tahun' => ['nullable', 'integer', 'digits:4'],
            'deskripsi' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['AKTIF', 'NONAKTIF'])],
            'tampilkan_penerima' => ['boolean'],
        ];
    }
}
