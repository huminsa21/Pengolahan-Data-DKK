<?php

namespace App\Services;

use App\Models\Kematian;
use App\Models\Penduduk;
use Illuminate\Support\Facades\DB;

class KematianService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Kematian
    {
        return DB::transaction(function () use ($data): Kematian {
            $kematian = Kematian::create($this->normalizePelapor($data));

            $kematian->penduduk()->update(['status_penduduk' => 'MENINGGAL']);

            return $kematian;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Kematian $kematian, array $data): Kematian
    {
        return DB::transaction(function () use ($kematian, $data): Kematian {
            $oldPendudukId = $kematian->penduduk_id;

            $kematian->update($this->normalizePelapor($data));
            $kematian->refresh();

            if ($oldPendudukId !== $kematian->penduduk_id) {
                $this->restorePendudukStatusIfNoActiveKematian($oldPendudukId);
            }

            $kematian->penduduk()->update(['status_penduduk' => 'MENINGGAL']);

            return $kematian;
        });
    }

    public function delete(Kematian $kematian): void
    {
        DB::transaction(function () use ($kematian): void {
            $pendudukId = $kematian->penduduk_id;

            $kematian->delete();

            $this->restorePendudukStatusIfNoActiveKematian($pendudukId);
        });
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

    private function restorePendudukStatusIfNoActiveKematian(string $pendudukId): void
    {
        $hasActiveKematian = Kematian::query()
            ->where('penduduk_id', $pendudukId)
            ->exists();

        if (! $hasActiveKematian) {
            Penduduk::whereKey($pendudukId)->update(['status_penduduk' => 'AKTIF']);
        }
    }
}
