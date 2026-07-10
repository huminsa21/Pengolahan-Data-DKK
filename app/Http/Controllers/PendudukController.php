<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePendudukRequest;
use App\Http\Requests\UpdatePendudukRequest;
use App\Models\Dusun;
use App\Models\Penduduk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendudukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'jenis_kelamin', 'status_penduduk', 'dusun_id']);

        $penduduk = Penduduk::query()
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
                'rt',
                'rw',
                'pekerjaan',
                'status_penduduk',
                'is_kepala_keluarga',
            ])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('nik', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('dusun', 'like', "%{$search}%")
                        ->orWhere('status_penduduk', 'like', "%{$search}%");
                });
            })
            ->when($filters['jenis_kelamin'] ?? null, function ($query, string $jenisKelamin): void {
                $query->whereIn('jenis_kelamin', match ($jenisKelamin) {
                    'L' => ['L', 'LAKI-LAKI'],
                    'P' => ['P', 'PEREMPUAN'],
                    default => [$jenisKelamin],
                });
            })
            ->when($filters['status_penduduk'] ?? null, fn ($query, string $statusPenduduk) => $query->where('status_penduduk', $statusPenduduk))
            ->when($filters['dusun_id'] ?? null, fn ($query, string $dusunId) => $query->where('dusun_id', $dusunId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('penduduk/index', [
            'penduduk' => $penduduk,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'jenis_kelamin' => $filters['jenis_kelamin'] ?? '',
                'status_penduduk' => $filters['status_penduduk'] ?? '',
                'dusun_id' => $filters['dusun_id'] ?? '',
            ],
            'filterOptions' => [
                'dusun' => Dusun::query()
                    ->select(['id', 'nama_dusun'])
                    ->where('is_active', true)
                    ->orderBy('nama_dusun')
                    ->get(),
            ],
            'stats' => [
                'total' => Penduduk::count(),
                'aktif' => Penduduk::where('status_penduduk', 'AKTIF')->count(),
                'pindah' => Penduduk::where('status_penduduk', 'PINDAH')->count(),
                'meninggal' => Penduduk::where('status_penduduk', 'MENINGGAL')->count(),
                'kepala_keluarga' => Penduduk::where('is_kepala_keluarga', true)->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('penduduk/create', [
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePendudukRequest $request): RedirectResponse
    {
        Penduduk::create($this->withLegacyDusunName($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data penduduk berhasil ditambahkan.']);

        return to_route('penduduk.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Penduduk $penduduk): Response
    {
        return Inertia::render('penduduk/show', [
            'penduduk' => $penduduk->load('wilayahDusun:id,nama_dusun'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Penduduk $penduduk): Response
    {
        return Inertia::render('penduduk/edit', [
            'penduduk' => $penduduk,
            'options' => $this->formOptions($penduduk),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePendudukRequest $request, Penduduk $penduduk): RedirectResponse
    {
        $penduduk->update($this->withLegacyDusunName($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data penduduk berhasil diperbarui.']);

        return to_route('penduduk.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penduduk $penduduk): RedirectResponse
    {
        $penduduk->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data penduduk berhasil dihapus.']);

        return to_route('penduduk.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(?Penduduk $penduduk = null): array
    {
        return [
            'dusun' => Dusun::query()
                ->select(['id', 'kode_dusun', 'nama_dusun'])
                ->where(function ($query) use ($penduduk): void {
                    $query
                        ->where('is_active', true)
                        ->when($penduduk?->dusun_id, fn ($query, string $dusunId) => $query->orWhere('id', $dusunId));
                })
                ->orderBy('nama_dusun')
                ->get(),
            'jenis_kelamin' => ['L', 'P'],
            'agama' => ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],
            'status_perkawinan' => ['BELUM KAWIN', 'KAWIN', 'CERAI HIDUP', 'CERAI MATI'],
            'pendidikan' => ['TIDAK SEKOLAH', 'SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'],
            'status_penduduk' => ['AKTIF', 'PINDAH', 'MENINGGAL'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withLegacyDusunName(array $data): array
    {
        if ($data['dusun_id'] ?? null) {
            $data['dusun'] = Dusun::whereKey($data['dusun_id'])->value('nama_dusun');
        }

        return $data;
    }
}
