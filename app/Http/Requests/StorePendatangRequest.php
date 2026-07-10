<?php

namespace App\Http\Requests;

use App\Models\Penduduk;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePendatangRequest extends FormRequest
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
            'nik' => ['nullable', 'digits:16'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'tanggal_lahir' => ['nullable', 'date'],
            'agama' => ['nullable', 'string', 'max:255'],
            'status_perkawinan' => ['nullable', 'string', 'max:255'],
            'pendidikan' => ['nullable', 'string', 'max:255'],
            'pekerjaan' => ['nullable', 'string', 'max:255'],
            'no_hp' => ['nullable', 'string', 'max:255'],
            'alamat_asal' => ['nullable', 'string'],
            'desa_asal' => ['nullable', 'string', 'max:255'],
            'kecamatan_asal' => ['nullable', 'string', 'max:255'],
            'kabupaten_asal' => ['nullable', 'string', 'max:255'],
            'provinsi_asal' => ['nullable', 'string', 'max:255'],
            'dusun_id' => ['nullable', 'exists:dusun,id'],
            'alamat_tujuan' => ['nullable', 'string'],
            'rt' => ['nullable', 'string', 'max:3'],
            'rw' => ['nullable', 'string', 'max:3'],
            'tanggal_datang' => ['required', 'date'],
            'alasan_datang' => ['nullable', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['PROSES', 'DITERIMA', 'DITOLAK'])],
            'pelapor_tipe' => ['required', Rule::in($this->pelaporTypes())],
            'pelapor_id' => ['nullable', 'required_if:pelapor_tipe,PENDUDUK', 'exists:penduduk,id'],
            'pelapor_nama' => ['nullable', 'required_unless:pelapor_tipe,PENDUDUK', 'string', 'max:255'],
            'pelapor_kontak' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function ($validator): void {
                if ($this->input('status') === 'DITERIMA' && $this->filled('nik') && Penduduk::where('nik', $this->input('nik'))->exists()) {
                    $validator->errors()->add('nik', 'NIK sudah terdaftar di data penduduk.');
                }
            },
        ];
    }

    /**
     * @return list<string>
     */
    private function pelaporTypes(): array
    {
        return ['PENDUDUK', 'KELUARGA', 'KEPALA_DUSUN', 'RT', 'RW', 'BIDAN', 'PERANGKAT_DESA', 'LAINNYA'];
    }
}
