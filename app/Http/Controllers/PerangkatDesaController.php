<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerangkatDesaRequest;
use App\Http\Requests\UpdatePerangkatDesaRequest;
use App\Models\Penduduk;
use App\Models\PerangkatDesa;
use App\Services\PerangkatDesaUserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerangkatDesaController extends Controller
{
    public function __construct(private readonly PerangkatDesaUserService $userService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'jabatan', 'status', 'akun']);

        $perangkatDesa = PerangkatDesa::query()
            ->with(['penduduk:id,nik,nama_lengkap,no_hp,alamat,dusun', 'user.roles'])
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('jabatan', 'like', "%{$search}%")
                        ->orWhere('nomor_sk', 'like', "%{$search}%")
                        ->orWhereHas('penduduk', function ($query) use ($search): void {
                            $query
                                ->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('nik', 'like', "%{$search}%");
                        });
                });
            })
            ->when($filters['jabatan'] ?? null, fn ($query, string $jabatan) => $query->where('jabatan', $jabatan))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['akun'] ?? null, fn ($query, string $akun) => $akun === 'ada' ? $query->whereNotNull('user_id') : $query->whereNull('user_id'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('perangkat-desa/index', [
            'perangkatDesa' => $perangkatDesa,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'jabatan' => $filters['jabatan'] ?? '',
                'status' => $filters['status'] ?? '',
                'akun' => $filters['akun'] ?? '',
            ],
            'options' => $this->options(),
            'stats' => [
                'total' => PerangkatDesa::query()->count(),
                'aktif' => PerangkatDesa::query()->where('status', 'AKTIF')->count(),
                'nonaktif' => PerangkatDesa::query()->where('status', 'NONAKTIF')->count(),
                'punya_akun' => PerangkatDesa::query()->whereNotNull('user_id')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('perangkat-desa/create', [
            'options' => $this->options(),
        ]);
    }

    public function store(StorePerangkatDesaRequest $request): RedirectResponse
    {
        PerangkatDesa::query()->create([
            ...$request->validated(),
            'created_by' => $request->user()?->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Perangkat desa berhasil ditambahkan.']);

        return to_route('perangkat-desa.index');
    }

    public function show(PerangkatDesa $perangkatDesa): Response
    {
        return Inertia::render('perangkat-desa/show', [
            'perangkatDesa' => $perangkatDesa->load(['penduduk.wilayahDusun', 'user.roles', 'createdBy:id,name']),
        ]);
    }

    public function edit(PerangkatDesa $perangkatDesa): Response
    {
        return Inertia::render('perangkat-desa/edit', [
            'perangkatDesa' => $perangkatDesa->load('penduduk:id,nik,nama_lengkap,status_penduduk'),
            'options' => $this->options(),
        ]);
    }

    public function update(UpdatePerangkatDesaRequest $request, PerangkatDesa $perangkatDesa): RedirectResponse
    {
        $perangkatDesa->update($request->validated());

        if ($perangkatDesa->status === 'NONAKTIF' && $perangkatDesa->user_id) {
            $this->userService->disableUser($perangkatDesa);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Perangkat desa berhasil diperbarui.']);

        return to_route('perangkat-desa.index');
    }

    public function destroy(PerangkatDesa $perangkatDesa): RedirectResponse
    {
        $perangkatDesa->forceFill([
            'status' => 'NONAKTIF',
            'tanggal_selesai' => $perangkatDesa->tanggal_selesai ?: now()->toDateString(),
        ])->save();

        if ($perangkatDesa->user_id) {
            $this->userService->disableUser($perangkatDesa);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Perangkat desa dan akun login berhasil dinonaktifkan.']);

        return back();
    }

    public function createUser(PerangkatDesa $perangkatDesa): RedirectResponse
    {
        $this->userService->createUser($perangkatDesa);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Akun login perangkat desa berhasil dibuat. Password default: password']);

        return back();
    }

    public function resetPassword(PerangkatDesa $perangkatDesa): RedirectResponse
    {
        $this->userService->resetPassword($perangkatDesa);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Password berhasil direset menjadi default: password']);

        return back();
    }

    public function disableUser(PerangkatDesa $perangkatDesa): RedirectResponse
    {
        $this->userService->disableUser($perangkatDesa);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Akun login perangkat desa berhasil dinonaktifkan.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function options(): array
    {
        return [
            'jabatan' => PerangkatDesa::JABATAN,
            'status' => ['AKTIF', 'NONAKTIF'],
            'penduduk' => Penduduk::query()
                ->select(['id', 'nik', 'nama_lengkap', 'status_penduduk'])
                ->where('status_penduduk', 'AKTIF')
                ->orderBy('nama_lengkap')
                ->get(),
        ];
    }
}
