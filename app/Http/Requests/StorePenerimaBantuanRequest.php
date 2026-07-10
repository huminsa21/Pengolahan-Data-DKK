<?php

namespace App\Http\Requests;

use App\Models\Bantuan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePenerimaBantuanRequest extends FormRequest
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
            'penduduk_id' => [
                'required',
                'exists:penduduk,id',
                Rule::unique('penerima_bantuan', 'penduduk_id')->where('bantuan_id', $bantuan?->id),
            ],
            'tanggal_terima' => ['nullable', 'date'],
            'nominal' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['AKTIF', 'SELESAI', 'DIBATALKAN'])],
            'keterangan' => ['nullable', 'string'],
        ];
    }
}
