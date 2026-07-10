<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePindahRequest;
use App\Http\Requests\UpdatePindahRequest;
use App\Models\Dusun;
use App\Models\Penduduk;
use App\Models\Pindah;
use App\Services\PindahService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PindahController extends Controller
{
    public function __construct(private PindahService $pindahService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only([
            'search',
            'status',
            'dusun_id',
            'tanggal_dari',
            'tanggal_sampai',
            'pelapor_tipe',
        ]);

        $pindah = Pindah::query()
            ->with([
                'penduduk:id,dusun_id,nik,nama_lengkap,jenis_kelamin,dusun,alamat,status_penduduk',
                'penduduk.wilayahDusun:id,nama_dusun',
                'pelaporPenduduk:id,nik,nama_lengkap,no_hp',
            ])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('desa_tujuan', 'like', "%{$search}%")
                        ->orWhere('kecamatan_tujuan', 'like', "%{$search}%")
                        ->orWhere('kabupaten_tujuan', 'like', "%{$search}%")
                        ->orWhere('pelapor_nama', 'like', "%{$search}%")
                        ->orWhereHas('penduduk', function ($query) use ($search): void {
                            $query
                                ->where('nik', 'like', "%{$search}%")
                                ->orWhere('nama_lengkap', 'like', "%{$search}%");
                        })
                        ->orWhereHas('pelaporPenduduk', fn ($query) => $query->where('nama_lengkap', 'like', "%{$search}%"));
                });
            })
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['dusun_id'] ?? null, fn ($query, string $dusunId) => $query->whereHas('penduduk', fn ($query) => $query->where('dusun_id', $dusunId)))
            ->when($filters['tanggal_dari'] ?? null, fn ($query, string $tanggalDari) => $query->whereDate('tanggal_pindah', '>=', $tanggalDari))
            ->when($filters['tanggal_sampai'] ?? null, fn ($query, string $tanggalSampai) => $query->whereDate('tanggal_pindah', '<=', $tanggalSampai))
            ->when($filters['pelapor_tipe'] ?? null, fn ($query, string $pelaporTipe) => $query->where('pelapor_tipe', $pelaporTipe))
            ->latest('tanggal_pindah')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('pindah/index', [
            'pindah' => $pindah,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'dusun_id' => $filters['dusun_id'] ?? '',
                'tanggal_dari' => $filters['tanggal_dari'] ?? '',
                'tanggal_sampai' => $filters['tanggal_sampai'] ?? '',
                'pelapor_tipe' => $filters['pelapor_tipe'] ?? '',
            ],
            'filterOptions' => [
                'dusun' => $this->dusunOptions(),
                'status' => $this->statusOptions(),
                'pelapor_tipe' => $this->pelaporTypes(),
            ],
            'stats' => [
                'total' => Pindah::count(),
                'proses' => Pindah::where('status', 'PROSES')->count(),
                'selesai' => Pindah::where('status', 'SELESAI')->count(),
                'dibatalkan' => Pindah::where('status', 'DIBATALKAN')->count(),
                'bulan_ini' => Pindah::whereBetween('tanggal_pindah', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('pindah/create', [
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePindahRequest $request): RedirectResponse
    {
        $this->pindahService->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pindah berhasil ditambahkan.']);

        return to_route('pindah.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pindah $pindah): Response
    {
        return Inertia::render('pindah/show', [
            'pindah' => $pindah->load([
                'penduduk:id,dusun_id,nik,nama_lengkap,jenis_kelamin,dusun,alamat,status_penduduk',
                'penduduk.wilayahDusun:id,nama_dusun',
                'pelaporPenduduk:id,nik,nama_lengkap,no_hp',
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pindah $pindah): Response
    {
        return Inertia::render('pindah/edit', [
            'pindah' => $pindah->load([
                'penduduk:id,dusun_id,nik,nama_lengkap,jenis_kelamin,dusun,alamat,status_penduduk',
                'penduduk.wilayahDusun:id,nama_dusun',
            ]),
            'options' => $this->formOptions($pindah),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePindahRequest $request, Pindah $pindah): RedirectResponse
    {
        $this->pindahService->update($pindah, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pindah berhasil diperbarui.']);

        return to_route('pindah.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pindah $pindah): RedirectResponse
    {
        $this->pindahService->delete($pindah);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pindah berhasil dihapus.']);

        return to_route('pindah.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(?Pindah $pindah = null): array
    {
        return [
            'penduduk' => Penduduk::query()
                ->with('wilayahDusun:id,nama_dusun')
                ->select(['id', 'dusun_id', 'nik', 'nama_lengkap', 'jenis_kelamin', 'dusun', 'alamat', 'status_penduduk'])
                ->where(function ($query) use ($pindah): void {
                    $query
                        ->where('status_penduduk', 'AKTIF')
                        ->when($pindah?->penduduk_id, fn ($query, string $pendudukId) => $query->orWhere('id', $pendudukId));
                })
                ->orderBy('nama_lengkap')
                ->get(),
            'pelapor_penduduk' => Penduduk::query()
                ->select(['id', 'nik', 'nama_lengkap', 'no_hp'])
                ->orderBy('nama_lengkap')
                ->get(),
            'status' => $this->statusOptions(),
            'pelapor_tipe' => $this->pelaporTypes(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function dusunOptions(): array
    {
        return Dusun::query()
            ->select(['id', 'nama_dusun'])
            ->where('is_active', true)
            ->orderBy('nama_dusun')
            ->get()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function statusOptions(): array
    {
        return ['PROSES', 'SELESAI', 'DIBATALKAN'];
    }

    /**
     * @return list<string>
     */
    private function pelaporTypes(): array
    {
        return [
            'PENDUDUK',
            'KELUARGA',
            'KEPALA_DUSUN',
            'RT',
            'RW',
            'BIDAN',
            'PERANGKAT_DESA',
            'LAINNYA',
        ];
    }
}
