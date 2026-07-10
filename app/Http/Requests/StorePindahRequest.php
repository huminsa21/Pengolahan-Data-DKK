<?php

namespace App\Http\Requests;

use App\Models\Penduduk;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePindahRequest extends FormRequest
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
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'tanggal_pindah' => ['required', 'date'],
            'alamat_tujuan' => ['nullable', 'string'],
            'desa_tujuan' => ['nullable', 'string', 'max:255'],
            'kecamatan_tujuan' => ['nullable', 'string', 'max:255'],
            'kabupaten_tujuan' => ['nullable', 'string', 'max:255'],
            'provinsi_tujuan' => ['nullable', 'string', 'max:255'],
            'alasan_pindah' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['PROSES', 'SELESAI', 'DIBATALKAN'])],
            'keterangan' => ['nullable', 'string'],
            'pelapor_tipe' => ['required', Rule::in($this->pelaporTypes())],
            'pelapor_id' => ['nullable', 'required_if:pelapor_tipe,PENDUDUK', 'exists:penduduk,id'],
            'pelapor_nama' => ['nullable', 'required_unless:pelapor_tipe,PENDUDUK', 'string', 'max:255'],
            'pelapor_kontak' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Get the after validation callables for the request.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function ($validator): void {
                $penduduk = Penduduk::query()
                    ->select(['id', 'status_penduduk'])
                    ->find($this->input('penduduk_id'));

                if ($penduduk && $penduduk->status_penduduk !== 'AKTIF') {
                    $validator->errors()->add('penduduk_id', 'Penduduk yang dipilih harus berstatus AKTIF.');
                }
            },
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
