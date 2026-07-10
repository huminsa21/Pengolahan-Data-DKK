<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratRequest;
use App\Http\Requests\UpdateSuratRequest;
use App\Models\JenisSurat;
use App\Models\Kelahiran;
use App\Models\Kematian;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\Pindah;
use App\Models\Surat;
use App\Services\SuratService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class SuratController extends Controller
{
    public function __construct(private readonly SuratService $suratService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'jenis_surat_id', 'status', 'tanggal_dari', 'tanggal_sampai']);

        $surat = Surat::query()
            ->with(['jenisSurat:id,kode_surat,nama_surat', 'penduduk:id,nik,nama_lengkap', 'pembuat:id,name'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('nomor_surat', 'like', "%{$search}%")
                        ->orWhere('keperluan', 'like', "%{$search}%")
                        ->orWhereHas('penduduk', function ($query) use ($search): void {
                            $query
                                ->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('nik', 'like', "%{$search}%");
                        })
                        ->orWhereHas('jenisSurat', function ($query) use ($search): void {
                            $query
                                ->where('kode_surat', 'like', "%{$search}%")
                                ->orWhere('nama_surat', 'like', "%{$search}%");
                        });
                });
            })
            ->when($filters['jenis_surat_id'] ?? null, fn ($query, string $jenisSuratId) => $query->where('jenis_surat_id', $jenisSuratId))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['tanggal_dari'] ?? null, fn ($query, string $date) => $query->whereDate('tanggal_surat', '>=', $date))
            ->when($filters['tanggal_sampai'] ?? null, fn ($query, string $date) => $query->whereDate('tanggal_surat', '<=', $date))
            ->latest('tanggal_surat')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('surat/index', [
            'surat' => $surat,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'jenis_surat_id' => $filters['jenis_surat_id'] ?? '',
                'status' => $filters['status'] ?? '',
                'tanggal_dari' => $filters['tanggal_dari'] ?? '',
                'tanggal_sampai' => $filters['tanggal_sampai'] ?? '',
            ],
            'options' => [
                'jenisSurat' => $this->jenisSuratOptions(),
                'status' => ['DRAFT', 'SELESAI', 'DIBATALKAN'],
            ],
            'stats' => [
                'total' => Surat::count(),
                'draft' => Surat::where('status', 'DRAFT')->count(),
                'selesai' => Surat::where('status', 'SELESAI')->count(),
                'dibatalkan' => Surat::where('status', 'DIBATALKAN')->count(),
                'bulan_ini' => Surat::whereMonth('tanggal_surat', now()->month)->whereYear('tanggal_surat', now()->year)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('surat/create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(StoreSuratRequest $request): RedirectResponse
    {
        $surat = $this->suratService->createDraft([
            ...$request->validated(),
            'dibuat_oleh' => $request->user()->id,
        ]);

        if ($request->validated('status') === 'SELESAI') {
            $this->suratService->complete($surat);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Surat berhasil disimpan.']);

        return to_route('surat.index');
    }

    public function show(Surat $surat): Response
    {
        return Inertia::render('surat/show', [
            'surat' => $surat->load(['jenisSurat', 'penduduk.wilayahDusun', 'pembuat']),
            'reference' => $this->referencePayload($surat),
        ]);
    }

    public function edit(Surat $surat): Response
    {
        return Inertia::render('surat/edit', [
            'surat' => $surat->load(['jenisSurat', 'penduduk']),
            'options' => $this->formOptions(),
        ]);
    }

    public function update(UpdateSuratRequest $request, Surat $surat): RedirectResponse
    {
        $this->suratService->updateDraft($surat, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Draft surat berhasil diperbarui.']);

        return to_route('surat.index');
    }

    public function destroy(Surat $surat): RedirectResponse
    {
        if (! $surat->isDraft()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Hanya draft surat yang dapat dihapus.']);

            return back();
        }

        $surat->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Draft surat berhasil dihapus.']);

        return to_route('surat.index');
    }

    public function complete(Surat $surat): RedirectResponse
    {
        $completed = $this->suratService->complete($surat);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Surat berhasil diselesaikan dengan nomor {$completed->nomor_surat}."]);

        return back();
    }

    public function cancel(Surat $surat): RedirectResponse
    {
        $this->suratService->cancel($surat);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Surat berhasil dibatalkan.']);

        return back();
    }

    public function preview(Surat $surat): HttpResponse
    {
        return $this->suratService->previewPdf($surat);
    }

    public function download(Surat $surat): HttpResponse
    {
        return $this->suratService->downloadPdf($surat);
    }

    private function jenisSuratOptions()
    {
        return JenisSurat::query()
            ->select(['id', 'kode_surat', 'nama_surat'])
            ->where('is_active', true)
            ->orderBy('kode_surat')
            ->get();
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'jenisSurat' => $this->jenisSuratOptions(),
            'penduduk' => Penduduk::query()
                ->select([
                    'id',
                    'nik',
                    'nama_lengkap',
                    'jenis_kelamin',
                    'tempat_lahir',
                    'tanggal_lahir',
                    'pekerjaan',
                    'alamat',
                    'dusun',
                    'rt',
                    'rw',
                    'desa',
                    'kecamatan',
                    'kabupaten',
                ])
                ->where('status_penduduk', 'AKTIF')
                ->orderBy('nama_lengkap')
                ->get(),
            'kelahiran' => Kelahiran::query()
                ->select(['id', 'nama_bayi', 'tanggal_lahir', 'ayah_id', 'ibu_id'])
                ->with(['ayah:id,nama_lengkap', 'ibu:id,nama_lengkap'])
                ->latest('tanggal_lahir')
                ->limit(100)
                ->get(),
            'kematian' => Kematian::query()
                ->select(['id', 'penduduk_id', 'tanggal_meninggal', 'sebab_meninggal'])
                ->with('penduduk:id,nik,nama_lengkap,tanggal_lahir')
                ->latest('tanggal_meninggal')
                ->limit(100)
                ->get(),
            'pindah' => Pindah::query()
                ->select(['id', 'penduduk_id', 'tanggal_pindah', 'desa_tujuan', 'kecamatan_tujuan', 'kabupaten_tujuan'])
                ->with('penduduk:id,nik,nama_lengkap,tanggal_lahir')
                ->latest('tanggal_pindah')
                ->limit(100)
                ->get(),
            'pendatang' => Pendatang::query()
                ->select(['id', 'penduduk_id', 'nik', 'nama_lengkap', 'tanggal_lahir', 'tanggal_datang', 'desa_asal'])
                ->with('penduduk:id,nik,nama_lengkap,tanggal_lahir')
                ->latest('tanggal_datang')
                ->limit(100)
                ->get(),
            'status' => ['DRAFT', 'SELESAI'],
            'referensiTipe' => ['PENDUDUK', 'KELAHIRAN', 'KEMATIAN', 'PINDAH', 'PENDATANG'],
        ];
    }

    private function referencePayload(Surat $surat): mixed
    {
        return match ($surat->referensi_tipe) {
            'KELAHIRAN' => Kelahiran::query()->with(['ayah:id,nama_lengkap', 'ibu:id,nama_lengkap', 'pelaporPenduduk:id,nama_lengkap'])->find($surat->referensi_id),
            'KEMATIAN' => Kematian::query()->with(['penduduk:id,nik,nama_lengkap,tanggal_lahir', 'pelaporPenduduk:id,nama_lengkap'])->find($surat->referensi_id),
            'PINDAH' => Pindah::query()->with('penduduk:id,nik,nama_lengkap,tanggal_lahir')->find($surat->referensi_id),
            'PENDATANG' => Pendatang::query()->with('penduduk:id,nik,nama_lengkap,tanggal_lahir')->find($surat->referensi_id),
            default => null,
        };
    }
}
