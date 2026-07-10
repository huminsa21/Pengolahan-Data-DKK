<?php

namespace App\Http\Requests;

use App\Models\PerangkatDesa;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerangkatDesaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'penduduk_id' => ['required', 'uuid', 'exists:penduduk,id'],
            'jabatan' => ['required', 'string', Rule::in(PerangkatDesa::JABATAN)],
            'nomor_sk' => ['nullable', 'string', 'max:255'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal_mulai'],
            'status' => ['required', Rule::in(['AKTIF', 'NONAKTIF'])],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if ($this->input('status') !== 'AKTIF') {
                return;
            }

            $exists = PerangkatDesa::query()
                ->where('penduduk_id', $this->input('penduduk_id'))
                ->where('jabatan', $this->input('jabatan'))
                ->where('status', 'AKTIF')
                ->exists();

            if ($exists) {
                $validator->errors()->add('penduduk_id', 'Penduduk ini sudah menjadi perangkat aktif pada jabatan tersebut.');
            }
        });
    }
}
