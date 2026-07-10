<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePendudukRequest extends FormRequest
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
            'nik' => ['required', 'digits:16', Rule::unique('penduduk', 'nik')],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P', 'LAKI-LAKI', 'PEREMPUAN'])],
            'tempat_lahir' => ['required', 'string', 'max:255'],
            'tanggal_lahir' => ['required', 'date'],
            'agama' => ['required', 'string', 'max:255'],
            'status_perkawinan' => ['required', 'string', 'max:255'],
            'pendidikan' => ['required', 'string', 'max:255'],
            'pekerjaan' => ['required', 'string', 'max:255'],
            'no_hp' => ['nullable', 'string', 'max:255'],
            'alamat' => ['required', 'string'],
            'dusun_id' => ['nullable', 'exists:dusun,id'],
            'dusun' => ['nullable', 'string', 'max:255'],
            'rt' => ['required', 'string', 'max:3'],
            'rw' => ['required', 'string', 'max:3'],
            'desa' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:255'],
            'kabupaten' => ['required', 'string', 'max:255'],
            'provinsi' => ['required', 'string', 'max:255'],
            'no_kk' => ['nullable', 'digits:16'],
            'hubungan_keluarga' => ['nullable', 'string', 'max:255'],
            'is_kepala_keluarga' => ['boolean'],
            'status_penduduk' => ['required', Rule::in(['AKTIF', 'PINDAH', 'MENINGGAL'])],
        ];
    }
}
