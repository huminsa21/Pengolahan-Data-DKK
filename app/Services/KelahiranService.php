<?php

namespace App\Services;

use App\Models\Kelahiran;
use App\Models\Penduduk;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class KelahiranService
{
    public function createPendudukFromKelahiran(Kelahiran $kelahiran): Penduduk
    {
        return DB::transaction(function () use ($kelahiran): Penduduk {
            $kelahiran->refresh()->load([
                'ayah.wilayahDusun',
                'ibu.wilayahDusun',
            ]);

            if ($kelahiran->penduduk_id_bayi !== null) {
                throw ValidationException::withMessages([
                    'penduduk_id_bayi' => 'Data bayi ini sudah masuk ke master penduduk.',
                ]);
            }

            if (blank($kelahiran->nama_bayi)) {
                throw ValidationException::withMessages([
                    'nama_bayi' => 'Nama bayi wajib diisi sebelum dikonversi menjadi penduduk.',
                ]);
            }

            if (blank($kelahiran->jenis_kelamin)) {
                throw ValidationException::withMessages([
                    'jenis_kelamin' => 'Jenis kelamin bayi wajib diisi sebelum dikonversi menjadi penduduk.',
                ]);
            }

            if (blank($kelahiran->tanggal_lahir)) {
                throw ValidationException::withMessages([
                    'tanggal_lahir' => 'Tanggal lahir bayi wajib diisi sebelum dikonversi menjadi penduduk.',
                ]);
            }

            $orangTua = $kelahiran->ayah ?: $kelahiran->ibu;

            $penduduk = Penduduk::create([
                'nik' => null,
                'nama_lengkap' => $kelahiran->nama_bayi,
                'jenis_kelamin' => $kelahiran->jenis_kelamin,
                'tempat_lahir' => $kelahiran->tempat_lahir,
                'tanggal_lahir' => $kelahiran->tanggal_lahir,
                'agama' => $orangTua?->agama ?? 'Islam',
                'status_perkawinan' => 'BELUM KAWIN',
                'pendidikan' => 'BELUM SEKOLAH',
                'pekerjaan' => 'BELUM/TIDAK BEKERJA',
                'no_hp' => null,
                'alamat' => $kelahiran->alamat,
                'dusun_id' => $orangTua?->dusun_id,
                'dusun' => $orangTua?->wilayahDusun?->nama_dusun ?? $orangTua?->dusun ?? '-',
                'rt' => $orangTua?->rt ?? '000',
                'rw' => $orangTua?->rw ?? '000',
                'desa' => $orangTua?->desa ?? 'Desa Sukamaju',
                'kecamatan' => $orangTua?->kecamatan ?? 'Kecamatan Makmur',
                'kabupaten' => $orangTua?->kabupaten ?? 'Kabupaten Sentosa',
                'provinsi' => $orangTua?->provinsi ?? 'Jawa Tengah',
                'no_kk' => $orangTua?->no_kk,
                'hubungan_keluarga' => $orangTua ? 'ANAK' : null,
                'is_kepala_keluarga' => false,
                'status_penduduk' => 'AKTIF',
            ]);

            $kelahiran->update([
                'penduduk_id_bayi' => $penduduk->id,
            ]);

            return $penduduk;
        });
    }
}
