<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJenisSuratRequest;
use App\Http\Requests\UpdateJenisSuratRequest;
use App\Models\JenisSurat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JenisSuratController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $jenisSurat = JenisSurat::query()
            ->withCount('surat')
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('kode_surat', 'like', "%{$search}%")
                        ->orWhere('nama_surat', 'like', "%{$search}%");
                });
            })
            ->orderBy('kode_surat')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('jenis-surat/index', [
            'jenisSurat' => $jenisSurat,
            'filters' => ['search' => $search],
            'stats' => [
                'total' => JenisSurat::count(),
                'aktif' => JenisSurat::where('is_active', true)->count(),
                'nonaktif' => JenisSurat::where('is_active', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('jenis-surat/create');
    }

    public function store(StoreJenisSuratRequest $request): RedirectResponse
    {
        JenisSurat::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Jenis surat berhasil ditambahkan.']);

        return to_route('jenis-surat.index');
    }

    public function show(JenisSurat $jenisSurat): Response
    {
        return Inertia::render('jenis-surat/show', [
            'jenisSurat' => $jenisSurat->loadCount('surat'),
        ]);
    }

    public function edit(JenisSurat $jenisSurat): Response
    {
        return Inertia::render('jenis-surat/edit', [
            'jenisSurat' => $jenisSurat->loadCount('surat'),
        ]);
    }

    public function update(UpdateJenisSuratRequest $request, JenisSurat $jenisSurat): RedirectResponse
    {
        $jenisSurat->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Jenis surat berhasil diperbarui.']);

        return to_route('jenis-surat.index');
    }

    public function destroy(JenisSurat $jenisSurat): RedirectResponse
    {
        if ($jenisSurat->surat()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Jenis surat tidak dapat dihapus karena sudah digunakan.']);

            return back();
        }

        $jenisSurat->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Jenis surat berhasil dihapus.']);

        return to_route('jenis-surat.index');
    }
}
