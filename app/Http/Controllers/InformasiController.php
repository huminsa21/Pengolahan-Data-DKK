<?php

namespace App\Http\Controllers;

use App\Models\Bantuan;
use App\Models\Pengumuman;
use App\Models\ProfilDesa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InformasiController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('informasi/index', [
            'pengumuman' => Pengumuman::query()
                ->select(['id', 'judul', 'isi', 'tanggal_publish'])
                ->where('status', 'PUBLISHED')
                ->latest('tanggal_publish')
                ->paginate(9),
        ]);
    }

    public function bantuanIndex(Request $request): Response
    {
        $search = $request->string('search')->toString();

        return Inertia::render('informasi/bantuan/index', [
            'bantuan' => Bantuan::query()
                ->select(['id', 'kode_bantuan', 'nama_bantuan', 'jenis_bantuan', 'sumber_bantuan', 'tahun', 'deskripsi', 'published_at'])
                ->withCount('penerimaBantuan')
                ->where('is_published', true)
                ->when($search, function ($query, string $search): void {
                    $query->where(function ($query) use ($search): void {
                        $query
                            ->where('nama_bantuan', 'like', "%{$search}%")
                            ->orWhere('jenis_bantuan', 'like', "%{$search}%")
                            ->orWhere('sumber_bantuan', 'like', "%{$search}%");
                    });
                })
                ->latest('published_at')
                ->paginate(9)
                ->withQueryString(),
            'filters' => ['search' => $search],
        ]);
    }

    public function bantuanShow(Bantuan $bantuan): Response
    {
        abort_unless($bantuan->is_published, 404);

        $bantuan->loadCount('penerimaBantuan');

        $bantuan->load([
            'penerimaBantuan' => fn ($query) => $query
                ->select(['id', 'bantuan_id', 'penduduk_id', 'status'])
                ->with([
                    'penduduk:id,dusun_id,nik,nama_lengkap,dusun,rt,rw',
                    'penduduk.wilayahDusun:id,nama_dusun',
                ])
                ->whereIn('status', ['AKTIF', 'SELESAI'])
                ->orderBy('status'),
        ]);

        $payload = $bantuan->toArray();
        $payload['penerima_bantuan'] = $bantuan->penerimaBantuan
            ->map(fn ($penerima): array => [
                'id' => $penerima->id,
                'status' => $penerima->status,
                'penduduk' => [
                    'id' => $penerima->penduduk->id,
                    'nik' => $this->maskNik($penerima->penduduk->nik),
                    'nama_lengkap' => $penerima->penduduk->nama_lengkap,
                    'dusun' => $penerima->penduduk->dusun,
                    'rt' => $penerima->penduduk->rt,
                    'rw' => $penerima->penduduk->rw,
                    'wilayah_dusun' => $penerima->penduduk->wilayahDusun?->only(['id', 'nama_dusun']),
                ],
            ])
            ->values();

        return Inertia::render('informasi/bantuan/show', [
            'bantuan' => $payload,
        ]);
    }

    public function profilDesa(): Response
    {
        return Inertia::render('informasi/profil-desa', [
            'profilDesa' => ProfilDesa::current()->toBrandingArray(),
        ]);
    }

    private function maskNik(?string $nik): ?string
    {
        if ($nik === null) {
            return null;
        }

        if (mb_strlen($nik) <= 8) {
            return '********';
        }

        return mb_substr($nik, 0, 4).'********'.mb_substr($nik, -4);
    }
}
