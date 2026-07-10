<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKelahiranRequest;
use App\Http\Requests\UpdateKelahiranRequest;
use App\Models\Kelahiran;
use App\Models\Penduduk;
use App\Services\KelahiranService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelahiranController extends Controller
{
    public function __construct(private readonly KelahiranService $kelahiranService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'jenis_kelamin', 'tanggal_dari', 'tanggal_sampai']);

        $kelahiran = Kelahiran::query()
            ->with([
                'ayah:id,nama_lengkap,nik',
                'bayiPenduduk:id,nama_lengkap,nik,status_penduduk',
                'ibu:id,nama_lengkap,nik',
                'pelaporPenduduk:id,nama_lengkap,nik,no_hp',
            ])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('nama_bayi', 'like', "%{$search}%")
                        ->orWhere('nama_ayah', 'like', "%{$search}%")
                        ->orWhere('nama_ibu', 'like', "%{$search}%")
                        ->orWhere('pelapor_nama', 'like', "%{$search}%")
                        ->orWhere('keterangan', 'like', "%{$search}%")
                        ->orWhereHas('ayah', fn ($query) => $query->where('nama_lengkap', 'like', "%{$search}%"))
                        ->orWhereHas('ibu', fn ($query) => $query->where('nama_lengkap', 'like', "%{$search}%"))
                        ->orWhereHas('pelaporPenduduk', fn ($query) => $query->where('nama_lengkap', 'like', "%{$search}%"));
                });
            })
            ->when($filters['jenis_kelamin'] ?? null, fn ($query, string $jenisKelamin) => $query->where('jenis_kelamin', $jenisKelamin))
            ->when($filters['tanggal_dari'] ?? null, fn ($query, string $tanggalDari) => $query->whereDate('tanggal_lahir', '>=', $tanggalDari))
            ->when($filters['tanggal_sampai'] ?? null, fn ($query, string $tanggalSampai) => $query->whereDate('tanggal_lahir', '<=', $tanggalSampai))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('kelahiran/index', [
            'kelahiran' => $kelahiran,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'jenis_kelamin' => $filters['jenis_kelamin'] ?? '',
                'tanggal_dari' => $filters['tanggal_dari'] ?? '',
                'tanggal_sampai' => $filters['tanggal_sampai'] ?? '',
            ],
            'stats' => [
                'total' => Kelahiran::count(),
                'laki_laki' => Kelahiran::where('jenis_kelamin', 'L')->count(),
                'perempuan' => Kelahiran::where('jenis_kelamin', 'P')->count(),
                'bulan_ini' => Kelahiran::whereBetween('tanggal_lahir', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('kelahiran/create', [
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKelahiranRequest $request): RedirectResponse
    {
        Kelahiran::create($this->normalizePelapor($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data kelahiran berhasil ditambahkan.']);

        return to_route('kelahiran.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelahiran $kelahiran): Response
    {
        return Inertia::render('kelahiran/show', [
            'kelahiran' => $kelahiran->load([
                'ayah:id,nama_lengkap,nik',
                'bayiPenduduk:id,nama_lengkap,nik,status_penduduk',
                'ibu:id,nama_lengkap,nik',
                'pelaporPenduduk:id,nama_lengkap,nik,no_hp',
            ]),
        ]);
    }

    public function createPenduduk(Kelahiran $kelahiran): RedirectResponse
    {
        $penduduk = $this->kelahiranService->createPendudukFromKelahiran($kelahiran);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Bayi berhasil dimasukkan ke data penduduk.']);

        return to_route('penduduk.show', $penduduk);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kelahiran $kelahiran): Response
    {
        return Inertia::render('kelahiran/edit', [
            'kelahiran' => $kelahiran,
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKelahiranRequest $request, Kelahiran $kelahiran): RedirectResponse
    {
        $kelahiran->update($this->normalizePelapor($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data kelahiran berhasil diperbarui.']);

        return to_route('kelahiran.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelahiran $kelahiran): RedirectResponse
    {
        $kelahiran->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data kelahiran berhasil dihapus.']);

        return to_route('kelahiran.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'penduduk' => Penduduk::query()
                ->select(['id', 'dusun_id', 'nik', 'nama_lengkap', 'jenis_kelamin', 'no_hp'])
                ->orderBy('nama_lengkap')
                ->get(),
            'jenis_kelamin' => ['L', 'P'],
            'pelapor_tipe' => [
                'PENDUDUK',
                'KELUARGA',
                'KEPALA_DUSUN',
                'RT',
                'RW',
                'BIDAN',
                'PERANGKAT_DESA',
                'LAINNYA',
            ],
        ];
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
