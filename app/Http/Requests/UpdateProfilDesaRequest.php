<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateProfilDesaRequest extends FormRequest
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
            'nama_desa' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:255'],
            'kabupaten' => ['required', 'string', 'max:255'],
            'provinsi' => ['required', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'kode_pos' => ['nullable', 'string', 'max:20'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'nama_kepala_desa' => ['nullable', 'string', 'max:255'],
            'nip_kepala_desa' => ['nullable', 'string', 'max:50'],
            'visi' => ['nullable', 'string'],
            'misi' => ['nullable', 'string'],
            'sejarah' => ['nullable', 'string'],
            'jam_pelayanan' => ['nullable', 'string', 'max:255'],
            'maps_embed' => ['nullable', 'string'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'youtube' => ['nullable', 'string', 'max:255'],
            'background_type' => ['nullable', Rule::in(['IMAGE', 'COLOR', 'GRADIENT'])],
            'background_color' => ['nullable', 'string', 'max:50'],
            'background_overlay_opacity' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'logo' => ['nullable', File::image()->types(['png', 'jpg', 'jpeg'])->max(2048)],
            'background_image' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(3072)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'background_image.uploaded' => 'Background gagal diupload. Ukuran file kemungkinan melewati batas upload server PHP.',
            'background_image.max' => 'Ukuran background maksimal 3MB.',
            'background_image.image' => 'Background harus berupa gambar.',
            'background_image.mimes' => 'Format background harus jpg, jpeg, png, atau webp.',
        ];
    }
}
