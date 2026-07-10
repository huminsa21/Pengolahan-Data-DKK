<?php

namespace App\Services;

use App\Models\Dusun;
use App\Models\Pendatang;
use App\Models\Penduduk;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PendatangService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function createPendatang(array $data): Pendatang
    {
        return DB::transaction(function () use ($data): Pendatang {
            $status = $data['status'];
            $data['status'] = 'PROSES';
            $pendatang = Pendatang::create($this->normalizePelapor($data));

            if ($status === 'DITERIMA') {
                return $this->acceptAsPenduduk($pendatang);
            }

            if ($status === 'DITOLAK') {
                return $this->rejectPendatang($pendatang);
            }

            return $pendatang;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updatePendatang(Pendatang $pendatang, array $data): Pendatang
    {
        return DB::transaction(function () use ($pendatang, $data): Pendatang {
            if ($pendatang->status === 'DITERIMA' && $pendatang->penduduk_id) {
                $data = array_merge($data, $pendatang->only([
                    'nik',
                    'nama_lengkap',
                    'jenis_kelamin',
                    'tempat_lahir',
                    'tanggal_lahir',
                    'agama',
                    'status_perkawinan',
                    'pendidikan',
                    'pekerjaan',
                    'no_hp',
                ]), $data);
            }

            $status = $data['status'];
            $data['status'] = $pendatang->status;
            $pendatang->update($this->normalizePelapor($data));
            $pendatang->refresh();

            if ($status === 'DITERIMA' && $pendatang->status === 'PROSES') {
                return $this->acceptAsPenduduk($pendatang);
            }

            if ($status === 'DITOLAK' && $pendatang->status === 'PROSES') {
                return $this->rejectPendatang($pendatang);
            }

            return $pendatang;
        });
    }

    public function acceptAsPenduduk(Pendatang $pendatang): Pendatang
    {
        return DB::transaction(function () use ($pendatang): Pendatang {
            $pendatang->refresh();

            if ($pendatang->status !== 'PROSES') {
                throw ValidationException::withMessages([
                    'status' => 'Pendatang hanya bisa diterima dari status PROSES.',
                ]);
            }

            if ($pendatang->penduduk_id) {
                $pendatang->update(['status' => 'DITERIMA']);

                return $pendatang->refresh();
            }

            if ($pendatang->nik && Penduduk::where('nik', $pendatang->nik)->exists()) {
                throw ValidationException::withMessages([
                    'nik' => 'NIK sudah terdaftar di data penduduk.',
                ]);
            }

            $dusunName = $pendatang->dusun_id
                ? Dusun::whereKey($pendatang->dusun_id)->value('nama_dusun')
                : null;

            $penduduk = Penduduk::create([
                'nik' => $pendatang->nik ?: fake()->unique()->numerify('################'),
                'nama_lengkap' => $pendatang->nama_lengkap,
                'jenis_kelamin' => $pendatang->jenis_kelamin,
                'tempat_lahir' => $pendatang->tempat_lahir ?: '-',
                'tanggal_lahir' => $pendatang->tanggal_lahir ?: now()->subYears(17)->toDateString(),
                'agama' => $pendatang->agama ?: 'Islam',
                'status_perkawinan' => $pendatang->status_perkawinan ?: 'BELUM KAWIN',
                'pendidikan' => $pendatang->pendidikan ?: 'SMA',
                'pekerjaan' => $pendatang->pekerjaan ?: '-',
                'no_hp' => $pendatang->no_hp,
                'alamat' => $pendatang->alamat_tujuan ?: '-',
                'dusun_id' => $pendatang->dusun_id,
                'dusun' => $dusunName,
                'rt' => $pendatang->rt ?: '000',
                'rw' => $pendatang->rw ?: '000',
                'desa' => 'Desa Sukamaju',
                'kecamatan' => 'Kecamatan Makmur',
                'kabupaten' => 'Kabupaten Sentosa',
                'provinsi' => 'Jawa Tengah',
                'no_kk' => null,
                'hubungan_keluarga' => null,
                'is_kepala_keluarga' => false,
                'status_penduduk' => 'AKTIF',
            ]);

            $pendatang->update([
                'status' => 'DITERIMA',
                'penduduk_id' => $penduduk->id,
            ]);

            return $pendatang->refresh();
        });
    }

    public function rejectPendatang(Pendatang $pendatang): Pendatang
    {
        return DB::transaction(function () use ($pendatang): Pendatang {
            $pendatang->refresh();

            if ($pendatang->status !== 'PROSES') {
                throw ValidationException::withMessages([
                    'status' => 'Pendatang hanya bisa ditolak dari status PROSES.',
                ]);
            }

            $pendatang->update(['status' => 'DITOLAK']);

            return $pendatang->refresh();
        });
    }

    public function deletePendatang(Pendatang $pendatang): void
    {
        DB::transaction(fn () => $pendatang->delete());
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizePelapor(array $data): array
    {
        if (($data['pelapor_tipe'] ?? null) !== 'PENDUDUK') {
            $data['pelapor_id'] = null;

            return $data;
        }

        $pelapor = Penduduk::query()
            ->select(['id', 'nama_lengkap', 'no_hp'])
            ->find($data['pelapor_id']);

        if ($pelapor) {
            $data['pelapor_nama'] = $pelapor->nama_lengkap;
            $data['pelapor_kontak'] = $pelapor->no_hp ?: ($data['pelapor_kontak'] ?? null);
        }

        return $data;
    }
}
