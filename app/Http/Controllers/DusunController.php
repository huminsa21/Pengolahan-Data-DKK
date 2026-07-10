<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDusunRequest;
use App\Http\Requests\UpdateDusunRequest;
use App\Models\Dusun;
use App\Models\Penduduk;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DusunController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $dusun = Dusun::query()
            ->withCount('penduduk')
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('kode_dusun', 'like', "%{$search}%")
                        ->orWhere('nama_dusun', 'like', "%{$search}%")
                        ->orWhere('kepala_dusun', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dusun/index', [
            'dusun' => $dusun,
            'filters' => ['search' => $search],
            'stats' => [
                'total' => Dusun::count(),
                'aktif' => Dusun::where('is_active', true)->count(),
                'nonaktif' => Dusun::where('is_active', false)->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('dusun/create', [
            'pendudukOptions' => $this->pendudukOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDusunRequest $request): RedirectResponse
    {
        Dusun::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data dusun berhasil ditambahkan.']);

        return to_route('dusun.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dusun $dusun): Response
    {
        return Inertia::render('dusun/show', [
            'dusun' => $dusun->loadCount('penduduk'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dusun $dusun): Response
    {
        return Inertia::render('dusun/edit', [
            'dusun' => $dusun,
            'pendudukOptions' => $this->pendudukOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDusunRequest $request, Dusun $dusun): RedirectResponse
    {
        $dusun->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data dusun berhasil diperbarui.']);

        return to_route('dusun.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dusun $dusun): RedirectResponse
    {
        $dusun->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data dusun berhasil dihapus.']);

        return to_route('dusun.index');
    }

    /**
     * @return Collection<int, Penduduk>
     */
    private function pendudukOptions(): Collection
    {
        return Penduduk::query()
            ->select(['id', 'nik', 'nama_lengkap', 'no_hp'])
            ->orderBy('nama_lengkap')
            ->get();
    }
}
