<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKematianRequest extends FormRequest
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
            'penduduk_id' => [
                'required',
                'exists:penduduk,id',
                Rule::unique('kematian', 'penduduk_id')->whereNull('deleted_at'),
            ],
            'tanggal_meninggal' => ['required', 'date'],
            'tempat_meninggal' => ['nullable', 'string', 'max:255'],
            'sebab_meninggal' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'pelapor_tipe' => ['required', Rule::in($this->pelaporTypes())],
            'pelapor_id' => ['nullable', 'required_if:pelapor_tipe,PENDUDUK', 'exists:penduduk,id'],
            'pelapor_nama' => ['nullable', 'required_unless:pelapor_tipe,PENDUDUK', 'string', 'max:255'],
            'pelapor_kontak' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return list<string>
     */
    private function pelaporTypes(): array
    {
        return [
            'PENDUDUK',
            'KELUARGA',
            'KEPALA_DUSUN',
            'RT',
            'RW',
            'BIDAN',
            'PERANGKAT_DESA',
            'LAINNYA',
        ];
    }
}
