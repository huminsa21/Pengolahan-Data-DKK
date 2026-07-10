<?php

namespace App\Http\Requests;

use App\Models\PenerimaBantuan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePenerimaBantuanRequest extends FormRequest
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
        /** @var PenerimaBantuan|null $penerimaBantuan */
        $penerimaBantuan = $this->route('penerimaBantuan');

        return [
            'penduduk_id' => [
                'required',
                'exists:penduduk,id',
                Rule::unique('penerima_bantuan', 'penduduk_id')
                    ->where('bantuan_id', $penerimaBantuan?->bantuan_id)
                    ->ignore($penerimaBantuan?->id),
            ],
            'tanggal_terima' => ['nullable', 'date'],
            'nominal' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['AKTIF', 'SELESAI', 'DIBATALKAN'])],
            'keterangan' => ['nullable', 'string'],
        ];
    }
}
