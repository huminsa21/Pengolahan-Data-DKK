<?php

namespace App\Http\Requests;

use App\Models\Penduduk;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKelahiranRequest extends FormRequest
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
            'nama_bayi' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', Rule::in(['L', 'P'])],
            'tempat_lahir' => ['required', 'string', 'max:255'],
            'tanggal_lahir' => ['required', 'date'],
            'waktu_lahir' => ['nullable', 'date_format:H:i'],
            'ayah_id' => ['nullable', 'exists:penduduk,id'],
            'ibu_id' => ['nullable', 'exists:penduduk,id'],
            'pelapor_tipe' => ['required', Rule::in($this->pelaporTypes())],
            'pelapor_id' => ['nullable', 'required_if:pelapor_tipe,PENDUDUK', 'exists:penduduk,id'],
            'pelapor_nama' => ['nullable', 'required_unless:pelapor_tipe,PENDUDUK', 'string', 'max:255'],
            'pelapor_kontak' => ['nullable', 'string', 'max:255'],
            'nama_ayah' => ['nullable', 'string', 'max:255'],
            'nama_ibu' => ['nullable', 'string', 'max:255'],
            'alamat' => ['required', 'string'],
            'keterangan' => ['nullable', 'string'],
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
                $ayah = $this->filled('ayah_id')
                    ? Penduduk::query()->select(['id', 'dusun_id', 'jenis_kelamin'])->find($this->input('ayah_id'))
                    : null;
                $ibu = $this->filled('ibu_id')
                    ? Penduduk::query()->select(['id', 'dusun_id', 'jenis_kelamin'])->find($this->input('ibu_id'))
                    : null;

                if ($ayah && ! in_array($ayah->jenis_kelamin, ['L', 'LAKI-LAKI'], true)) {
                    $validator->errors()->add('ayah_id', 'Ayah harus penduduk berjenis kelamin laki-laki.');
                }

                if ($ibu && ! in_array($ibu->jenis_kelamin, ['P', 'PEREMPUAN'], true)) {
                    $validator->errors()->add('ibu_id', 'Ibu harus penduduk berjenis kelamin perempuan.');
                }

                if ($ayah && $ibu && $ayah->dusun_id && $ibu->dusun_id && $ayah->dusun_id !== $ibu->dusun_id) {
                    $validator->errors()->add('ibu_id', 'Ayah dan ibu harus berasal dari dusun yang sama.');
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
