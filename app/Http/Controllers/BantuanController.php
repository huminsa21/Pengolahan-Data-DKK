<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBantuanRequest;
use App\Http\Requests\UpdateBantuanRequest;
use App\Models\Bantuan;
use App\Models\Penduduk;
use App\Services\BantuanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BantuanController extends Controller
{
    public function __construct(private readonly BantuanService $bantuanService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'tahun', 'is_published']);

        $bantuan = Bantuan::query()
            ->withCount('penerimaBantuan')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('kode_bantuan', 'like', "%{$search}%")
                        ->orWhere('nama_bantuan', 'like', "%{$search}%")
                        ->orWhere('jenis_bantuan', 'like', "%{$search}%")
                        ->orWhere('sumber_bantuan', 'like', "%{$search}%")
                        ->orWhere('tahun', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['tahun'] ?? null, fn ($query, string $tahun) => $query->where('tahun', $tahun))
            ->when(($filters['is_published'] ?? '') !== '', fn ($query) => $query->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOL)))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('bantuan/index', [
            'bantuan' => $bantuan,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'tahun' => $filters['tahun'] ?? '',
                'is_published' => $filters['is_published'] ?? '',
            ],
            'filterOptions' => [
                'tahun' => Bantuan::query()
                    ->whereNotNull('tahun')
                    ->distinct()
                    ->orderByDesc('tahun')
                    ->pluck('tahun'),
            ],
            'stats' => [
                'total' => Bantuan::count(),
                'aktif' => Bantuan::where('status', 'AKTIF')->count(),
                'nonaktif' => Bantuan::where('status', 'NONAKTIF')->count(),
                'dipublikasikan' => Bantuan::where('is_published', true)->count(),
                'total_penerima' => Bantuan::query()->withCount('penerimaBantuan')->get()->sum('penerima_bantuan_count'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('bantuan/create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(StoreBantuanRequest $request): RedirectResponse
    {
        Bantuan::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Program bantuan berhasil ditambahkan.']);

        return to_route('bantuan.index');
    }

    public function show(Bantuan $bantuan, Request $request): Response
    {
        $penerimaFilters = $request->only(['search', 'status']);

        $penerima = $bantuan->penerimaBantuan()
            ->with('penduduk.wilayahDusun:id,nama_dusun')
            ->when($penerimaFilters['search'] ?? null, function ($query, string $search): void {
                $query->whereHas('penduduk', function ($query) use ($search): void {
                    $query
                        ->where('nik', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('dusun', 'like', "%{$search}%")
                        ->orWhereHas('wilayahDusun', fn ($query) => $query->where('nama_dusun', 'like', "%{$search}%"));
                });
            })
            ->when($penerimaFilters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('bantuan/show', [
            'bantuan' => $bantuan->load('pengumuman:id,judul,status,tanggal_publish')->loadCount('penerimaBantuan'),
            'penerima' => $penerima,
            'filters' => [
                'search' => $penerimaFilters['search'] ?? '',
                'status' => $penerimaFilters['status'] ?? '',
            ],
            'options' => [
                'penduduk' => Penduduk::query()
                    ->with('wilayahDusun:id,nama_dusun')
                    ->select(['id', 'dusun_id', 'nik', 'nama_lengkap', 'dusun', 'rt', 'rw'])
                    ->where('status_penduduk', 'AKTIF')
                    ->orderBy('nama_lengkap')
                    ->get(),
                'status' => ['AKTIF', 'SELESAI', 'DIBATALKAN'],
            ],
        ]);
    }

    public function edit(Bantuan $bantuan): Response
    {
        return Inertia::render('bantuan/edit', [
            'bantuan' => $bantuan,
            'options' => $this->formOptions(),
        ]);
    }

    public function update(UpdateBantuanRequest $request, Bantuan $bantuan): RedirectResponse
    {
        $bantuan->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Program bantuan berhasil diperbarui.']);

        return to_route('bantuan.index');
    }

    public function destroy(Bantuan $bantuan): RedirectResponse
    {
        $bantuan->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Program bantuan berhasil dihapus.']);

        return to_route('bantuan.index');
    }

    public function publish(Bantuan $bantuan, Request $request): RedirectResponse
    {
        $this->bantuanService->publish($bantuan, $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Program bantuan berhasil dipublikasikan.']);

        return back();
    }

    public function unpublish(Bantuan $bantuan): RedirectResponse
    {
        $this->bantuanService->unpublish($bantuan);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publikasi program bantuan berhasil ditarik.']);

        return back();
    }

    /**
     * @return array<string, list<string>>
     */
    private function formOptions(): array
    {
        return [
            'status' => ['AKTIF', 'NONAKTIF'],
        ];
    }
}
