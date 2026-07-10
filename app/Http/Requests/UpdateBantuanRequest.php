<?php

namespace App\Http\Requests;

use App\Models\Bantuan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBantuanRequest extends FormRequest
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
        /** @var Bantuan|null $bantuan */
        $bantuan = $this->route('bantuan');

        return [
            'kode_bantuan' => ['required', 'string', 'max:255', Rule::unique('bantuan', 'kode_bantuan')->ignore($bantuan?->id)],
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
