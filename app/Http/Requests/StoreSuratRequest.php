<?php

namespace App\Http\Requests;

use App\Models\JenisSurat;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreSuratRequest extends FormRequest
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
            'jenis_surat_id' => ['required', 'uuid', 'exists:jenis_surat,id'],
            'penduduk_id' => ['nullable', 'uuid', 'exists:penduduk,id'],
            'tanggal_surat' => ['required', 'date'],
            'keperluan' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['DRAFT', 'SELESAI', 'DIBATALKAN'])],
            'referensi_tipe' => ['nullable', Rule::in(['PENDUDUK', 'KELAHIRAN', 'KEMATIAN', 'PINDAH', 'PENDATANG'])],
            'referensi_id' => ['nullable', 'string', 'max:255'],
            'data_json' => ['nullable', 'array'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $jenisSurat = JenisSurat::find($this->string('jenis_surat_id')->toString());

                if (! $jenisSurat) {
                    return;
                }

                $kodeSurat = $jenisSurat->kode_surat;
                $referensiTipe = $this->string('referensi_tipe')->toString();
                $referensiId = $this->string('referensi_id')->toString();

                if ($kodeSurat === 'DOMISILI' && ! $this->filled('penduduk_id')) {
                    $validator->errors()->add('penduduk_id', 'Penduduk wajib dipilih untuk surat domisili.');
                }

                if ($kodeSurat === 'KELAHIRAN') {
                    $this->validateReference($validator, $referensiTipe, $referensiId, 'KELAHIRAN', 'kelahiran');
                }

                if ($kodeSurat === 'KEMATIAN') {
                    $this->validateReference($validator, $referensiTipe, $referensiId, 'KEMATIAN', 'kematian');
                }

                if ($kodeSurat === 'PINDAH') {
                    $this->validateReference($validator, $referensiTipe, $referensiId, 'PINDAH', 'pindah');
                }

                if ($kodeSurat === 'DATANG' && ! ($referensiTipe === 'PENDATANG' && $this->referenceExists('pendatang', $referensiId)) && ! $this->filled('penduduk_id')) {
                    $validator->errors()->add('referensi_id', 'Pilih data pendatang atau penduduk untuk surat datang.');
                }
            },
        ];
    }

    private function validateReference(Validator $validator, string $actualType, string $actualId, string $expectedType, string $table): void
    {
        if ($actualType !== $expectedType || ! $this->referenceExists($table, $actualId)) {
            $validator->errors()->add('referensi_id', "Referensi {$expectedType} wajib dipilih dan valid.");
        }
    }

    private function referenceExists(string $table, string $id): bool
    {
        if ($id === '') {
            return false;
        }

        return \Illuminate\Support\Facades\DB::table($table)->where('id', $id)->exists();
    }
}
