<?php

namespace App\Services;

use App\Models\Bantuan;
use App\Models\PenerimaBantuan;
use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BantuanService
{
    public function publish(Bantuan $bantuan, User $user): Bantuan
    {
        return DB::transaction(function () use ($bantuan, $user): Bantuan {
            $bantuan->loadCount('penerimaBantuan');

            $pengumuman = $bantuan->pengumuman ?: Pengumuman::create([
                'judul' => "Pengumuman Penerima Bantuan: {$bantuan->nama_bantuan}",
                'isi' => $this->pengumumanIsi($bantuan),
                'tanggal_publish' => now(),
                'status' => 'PUBLISHED',
                'created_by' => $user->id,
            ]);

            $pengumuman->update([
                'judul' => "Pengumuman Penerima Bantuan: {$bantuan->nama_bantuan}",
                'isi' => $this->pengumumanIsi($bantuan),
                'tanggal_publish' => now(),
                'status' => 'PUBLISHED',
                'created_by' => $pengumuman->created_by ?: $user->id,
            ]);

            $bantuan->update([
                'is_published' => true,
                'published_at' => now(),
                'pengumuman_id' => $pengumuman->id,
            ]);

            return $bantuan->refresh();
        });
    }

    public function unpublish(Bantuan $bantuan): Bantuan
    {
        return DB::transaction(function () use ($bantuan): Bantuan {
            if ($bantuan->pengumuman) {
                $bantuan->pengumuman->update(['status' => 'ARCHIVED']);
            }

            $bantuan->update([
                'is_published' => false,
                'published_at' => null,
            ]);

            return $bantuan->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addPenerima(Bantuan $bantuan, array $data): PenerimaBantuan
    {
        return $bantuan->penerimaBantuan()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updatePenerima(PenerimaBantuan $penerima, array $data): PenerimaBantuan
    {
        $penerima->update($data);

        return $penerima->refresh();
    }

    public function removePenerima(PenerimaBantuan $penerima): void
    {
        $penerima->delete();
    }

    private function pengumumanIsi(Bantuan $bantuan): string
    {
        return collect([
            "Program bantuan: {$bantuan->nama_bantuan}",
            "Jenis: {$bantuan->jenis_bantuan}",
            "Sumber: {$bantuan->sumber_bantuan}",
            'Tahun: '.($bantuan->tahun ?: '-'),
            'Jumlah penerima: '.$bantuan->penerima_bantuan_count,
            '',
            $bantuan->deskripsi ?: 'Tidak ada deskripsi tambahan.',
        ])->implode(PHP_EOL);
    }
}
