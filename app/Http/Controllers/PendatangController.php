<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePendatangRequest;
use App\Http\Requests\UpdatePendatangRequest;
use App\Models\Dusun;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Services\PendatangService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendatangController extends Controller
{
    public function __construct(private PendatangService $pendatangService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'jenis_kelamin', 'tanggal_dari', 'tanggal_sampai', 'pelapor_tipe']);

        $pendatang = Pendatang::query()
            ->with(['penduduk:id,nik,nama_lengkap', 'dusun:id,nama_dusun', 'pelaporPenduduk:id,nik,nama_lengkap,no_hp'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('nik', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('desa_asal', 'like', "%{$search}%")
                        ->orWhere('kecamatan_asal', 'like', "%{$search}%")
                        ->orWhere('kabupaten_asal', 'like', "%{$search}%")
                        ->orWhere('pelapor_nama', 'like', "%{$search}%")
                        ->orWhereHas('pelaporPenduduk', fn ($query) => $query->where('nama_lengkap', 'like', "%{$search}%"));
                });
            })
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['jenis_kelamin'] ?? null, fn ($query, string $jenisKelamin) => $query->where('jenis_kelamin', $jenisKelamin))
            ->when($filters['tanggal_dari'] ?? null, fn ($query, string $tanggalDari) => $query->whereDate('tanggal_datang', '>=', $tanggalDari))
            ->when($filters['tanggal_sampai'] ?? null, fn ($query, string $tanggalSampai) => $query->whereDate('tanggal_datang', '<=', $tanggalSampai))
            ->when($filters['pelapor_tipe'] ?? null, fn ($query, string $pelaporTipe) => $query->where('pelapor_tipe', $pelaporTipe))
            ->latest('tanggal_datang')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('pendatang/index', [
            'pendatang' => $pendatang,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
                'jenis_kelamin' => $filters['jenis_kelamin'] ?? '',
                'tanggal_dari' => $filters['tanggal_dari'] ?? '',
                'tanggal_sampai' => $filters['tanggal_sampai'] ?? '',
                'pelapor_tipe' => $filters['pelapor_tipe'] ?? '',
            ],
            'filterOptions' => [
                'status' => $this->statusOptions(),
                'jenis_kelamin' => ['L', 'P'],
                'pelapor_tipe' => $this->pelaporTypes(),
            ],
            'stats' => [
                'total' => Pendatang::count(),
                'proses' => Pendatang::where('status', 'PROSES')->count(),
                'diterima' => Pendatang::where('status', 'DITERIMA')->count(),
                'ditolak' => Pendatang::where('status', 'DITOLAK')->count(),
                'bulan_ini' => Pendatang::whereBetween('tanggal_datang', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pendatang/create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(StorePendatangRequest $request): RedirectResponse
    {
        $this->pendatangService->createPendatang($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pendatang berhasil ditambahkan.']);

        return to_route('pendatang.index');
    }

    public function show(Pendatang $pendatang): Response
    {
        return Inertia::render('pendatang/show', [
            'pendatang' => $pendatang->load(['penduduk:id,nik,nama_lengkap', 'dusun:id,nama_dusun', 'pelaporPenduduk:id,nik,nama_lengkap,no_hp']),
        ]);
    }

    public function edit(Pendatang $pendatang): Response
    {
        return Inertia::render('pendatang/edit', [
            'pendatang' => $pendatang->load(['penduduk:id,nik,nama_lengkap', 'dusun:id,nama_dusun']),
            'options' => $this->formOptions(),
        ]);
    }

    public function update(UpdatePendatangRequest $request, Pendatang $pendatang): RedirectResponse
    {
        $this->pendatangService->updatePendatang($pendatang, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pendatang berhasil diperbarui.']);

        return to_route('pendatang.index');
    }

    public function destroy(Pendatang $pendatang): RedirectResponse
    {
        $wasAccepted = $pendatang->status === 'DITERIMA' && $pendatang->penduduk_id;
        $this->pendatangService->deletePendatang($pendatang);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $wasAccepted
                ? 'Data pendatang dihapus. Data penduduk yang sudah dibuat tetap tersimpan.'
                : 'Data pendatang berhasil dihapus.',
        ]);

        return to_route('pendatang.index');
    }

    public function accept(Pendatang $pendatang): RedirectResponse
    {
        $this->pendatangService->acceptAsPenduduk($pendatang);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pendatang berhasil diterima sebagai penduduk.']);

        return to_route('pendatang.index');
    }

    public function reject(Pendatang $pendatang): RedirectResponse
    {
        $this->pendatangService->rejectPendatang($pendatang);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pendatang berhasil ditolak.']);

        return to_route('pendatang.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'dusun' => Dusun::query()
                ->select(['id', 'nama_dusun'])
                ->where('is_active', true)
                ->orderBy('nama_dusun')
                ->get(),
            'pelapor_penduduk' => Penduduk::query()
                ->select(['id', 'nik', 'nama_lengkap', 'no_hp'])
                ->orderBy('nama_lengkap')
                ->get(),
            'jenis_kelamin' => ['L', 'P'],
            'agama' => ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],
            'status_perkawinan' => ['BELUM KAWIN', 'KAWIN', 'CERAI HIDUP', 'CERAI MATI'],
            'pendidikan' => ['TIDAK SEKOLAH', 'SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'],
            'status' => $this->statusOptions(),
            'pelapor_tipe' => $this->pelaporTypes(),
        ];
    }

    /**
     * @return list<string>
     */
    private function statusOptions(): array
    {
        return ['PROSES', 'DITERIMA', 'DITOLAK'];
    }

    /**
     * @return list<string>
     */
    private function pelaporTypes(): array
    {
        return ['PENDUDUK', 'KELUARGA', 'KEPALA_DUSUN', 'RT', 'RW', 'BIDAN', 'PERANGKAT_DESA', 'LAINNYA'];
    }
}
