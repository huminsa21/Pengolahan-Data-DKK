<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKematianRequest;
use App\Http\Requests\UpdateKematianRequest;
use App\Models\Dusun;
use App\Models\Kematian;
use App\Models\Penduduk;
use App\Services\KematianService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KematianController extends Controller
{
    public function __construct(private KematianService $kematianService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only([
            'search',
            'jenis_kelamin',
            'dusun_id',
            'tanggal_dari',
            'tanggal_sampai',
            'pelapor_tipe',
        ]);

        $kematian = Kematian::query()
            ->with([
                'penduduk:id,dusun_id,nik,nama_lengkap,jenis_kelamin,tempat_lahir,tanggal_lahir,dusun,alamat,status_penduduk',
                'penduduk.wilayahDusun:id,nama_dusun',
                'pelaporPenduduk:id,nik,nama_lengkap,no_hp',
            ])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('sebab_meninggal', 'like', "%{$search}%")
                        ->orWhere('pelapor_nama', 'like', "%{$search}%")
                        ->orWhereHas('penduduk', function ($query) use ($search): void {
                            $query
                                ->where('nik', 'like', "%{$search}%")
                                ->orWhere('nama_lengkap', 'like', "%{$search}%");
                        })
                        ->orWhereHas('pelaporPenduduk', fn ($query) => $query->where('nama_lengkap', 'like', "%{$search}%"));
                });
            })
            ->when($filters['jenis_kelamin'] ?? null, function ($query, string $jenisKelamin): void {
                $query->whereHas('penduduk', function ($query) use ($jenisKelamin): void {
                    $query->whereIn('jenis_kelamin', match ($jenisKelamin) {
                        'L' => ['L', 'LAKI-LAKI'],
                        'P' => ['P', 'PEREMPUAN'],
                        default => [$jenisKelamin],
                    });
                });
            })
            ->when($filters['dusun_id'] ?? null, fn ($query, string $dusunId) => $query->whereHas('penduduk', fn ($query) => $query->where('dusun_id', $dusunId)))
            ->when($filters['tanggal_dari'] ?? null, fn ($query, string $tanggalDari) => $query->whereDate('tanggal_meninggal', '>=', $tanggalDari))
            ->when($filters['tanggal_sampai'] ?? null, fn ($query, string $tanggalSampai) => $query->whereDate('tanggal_meninggal', '<=', $tanggalSampai))
            ->when($filters['pelapor_tipe'] ?? null, fn ($query, string $pelaporTipe) => $query->where('pelapor_tipe', $pelaporTipe))
            ->latest('tanggal_meninggal')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('kematian/index', [
            'kematian' => $kematian,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'jenis_kelamin' => $filters['jenis_kelamin'] ?? '',
                'dusun_id' => $filters['dusun_id'] ?? '',
                'tanggal_dari' => $filters['tanggal_dari'] ?? '',
                'tanggal_sampai' => $filters['tanggal_sampai'] ?? '',
                'pelapor_tipe' => $filters['pelapor_tipe'] ?? '',
            ],
            'filterOptions' => [
                'dusun' => $this->dusunOptions(),
                'pelapor_tipe' => $this->pelaporTypes(),
            ],
            'stats' => [
                'total' => Kematian::count(),
                'bulan_ini' => Kematian::whereBetween('tanggal_meninggal', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'tahun_ini' => Kematian::whereYear('tanggal_meninggal', now()->year)->count(),
                'laki_laki' => Kematian::whereHas('penduduk', fn ($query) => $query->whereIn('jenis_kelamin', ['L', 'LAKI-LAKI']))->count(),
                'perempuan' => Kematian::whereHas('penduduk', fn ($query) => $query->whereIn('jenis_kelamin', ['P', 'PEREMPUAN']))->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('kematian/create', [
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKematianRequest $request): RedirectResponse
    {
        $this->kematianService->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data kematian berhasil ditambahkan.']);

        return to_route('kematian.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kematian $kematian): Response
    {
        return Inertia::render('kematian/show', [
            'kematian' => $kematian->load([
                'penduduk:id,dusun_id,nik,nama_lengkap,jenis_kelamin,tempat_lahir,tanggal_lahir,dusun,alamat,status_penduduk',
                'penduduk.wilayahDusun:id,nama_dusun',
                'pelaporPenduduk:id,nik,nama_lengkap,no_hp',
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kematian $kematian): Response
    {
        return Inertia::render('kematian/edit', [
            'kematian' => $kematian->load([
                'penduduk:id,dusun_id,nik,nama_lengkap,jenis_kelamin,tempat_lahir,tanggal_lahir,dusun,alamat,status_penduduk',
                'penduduk.wilayahDusun:id,nama_dusun',
            ]),
            'options' => $this->formOptions($kematian),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKematianRequest $request, Kematian $kematian): RedirectResponse
    {
        $this->kematianService->update($kematian, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data kematian berhasil diperbarui.']);

        return to_route('kematian.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kematian $kematian): RedirectResponse
    {
        $this->kematianService->delete($kematian);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data kematian berhasil dihapus.']);

        return to_route('kematian.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(?Kematian $kematian = null): array
    {
        return [
            'penduduk' => Penduduk::query()
                ->with('wilayahDusun:id,nama_dusun')
                ->select([
                    'id',
                    'dusun_id',
                    'nik',
                    'nama_lengkap',
                    'jenis_kelamin',
                    'tempat_lahir',
                    'tanggal_lahir',
                    'dusun',
                    'alamat',
                    'status_penduduk',
                ])
                ->where(function ($query) use ($kematian): void {
                    $query
                        ->where('status_penduduk', 'AKTIF')
                        ->when($kematian?->penduduk_id, fn ($query, string $pendudukId) => $query->orWhere('id', $pendudukId));
                })
                ->whereDoesntHave('dataKematian', function ($query) use ($kematian): void {
                    $query->when($kematian?->id, fn ($query, string $kematianId) => $query->where('id', '<>', $kematianId));
                })
                ->orderBy('nama_lengkap')
                ->get(),
            'pelapor_penduduk' => Penduduk::query()
                ->select(['id', 'nik', 'nama_lengkap', 'no_hp'])
                ->orderBy('nama_lengkap')
                ->get(),
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
