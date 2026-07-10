<?php

namespace App\Services;

use App\Models\Kematian;
use App\Models\Penduduk;
use App\Models\Pindah;
use Illuminate\Support\Facades\DB;

class PindahService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Pindah
    {
        return DB::transaction(function () use ($data): Pindah {
            $pindah = Pindah::create($this->normalizePelapor($data));

            $this->syncPendudukStatus($pindah->penduduk_id);

            return $pindah;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Pindah $pindah, array $data): Pindah
    {
        return DB::transaction(function () use ($pindah, $data): Pindah {
            $oldPendudukId = $pindah->penduduk_id;

            $pindah->update($this->normalizePelapor($data));
            $pindah->refresh();

            $this->syncPendudukStatus($oldPendudukId);
            $this->syncPendudukStatus($pindah->penduduk_id);

            return $pindah;
        });
    }

    public function delete(Pindah $pindah): void
    {
        DB::transaction(function () use ($pindah): void {
            $pendudukId = $pindah->penduduk_id;

            $pindah->delete();

            $this->syncPendudukStatus($pendudukId);
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

    private function syncPendudukStatus(string $pendudukId): void
    {
        if (Kematian::query()->where('penduduk_id', $pendudukId)->exists()) {
            Penduduk::whereKey($pendudukId)->update(['status_penduduk' => 'MENINGGAL']);

            return;
        }

        $hasCompletedMove = Pindah::query()
            ->where('penduduk_id', $pendudukId)
            ->where('status', 'SELESAI')
            ->exists();

        Penduduk::whereKey($pendudukId)->update([
            'status_penduduk' => $hasCompletedMove ? 'PINDAH' : 'AKTIF',
        ]);
    }
}
