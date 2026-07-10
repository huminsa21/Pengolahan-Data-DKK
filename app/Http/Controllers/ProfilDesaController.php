<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfilDesaRequest;
use App\Models\PerangkatDesa;
use App\Models\ProfilDesa;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfilDesaController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('profil-desa/show', [
            'profilDesa' => ProfilDesa::current()->toBrandingArray(),
        ]);
    }

    public function edit(): Response
    {
        return Inertia::render('profil-desa/edit', [
            'profilDesa' => ProfilDesa::current()->toBrandingArray(),
            'kepalaDesaOptions' => PerangkatDesa::query()
                ->with('penduduk:id,nik,nama_lengkap')
                ->where('jabatan', 'Kepala Desa')
                ->where('status', 'AKTIF')
                ->latest('tanggal_mulai')
                ->get()
                ->map(fn (PerangkatDesa $perangkatDesa): array => [
                    'id' => $perangkatDesa->id,
                    'nama_lengkap' => $perangkatDesa->penduduk?->nama_lengkap ?? '',
                    'nik' => $perangkatDesa->penduduk?->nik ?? '',
                    'nomor_sk' => $perangkatDesa->nomor_sk,
                ])
                ->values(),
        ]);
    }

    public function update(UpdateProfilDesaRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['logo', 'background_image']);
        $profilDesa = ProfilDesa::query()->first() ?? new ProfilDesa;

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
            $data['logo_path'] = 'storage/'.$logoPath;
        }

        if ($request->hasFile('background_image')) {
            $backgroundPath = $request->file('background_image')->store('backgrounds', 'public');
            $data['background_path'] = 'storage/'.$backgroundPath;
        }

        $profilDesa->fill($data)->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profil desa berhasil diperbarui.']);

        return to_route('profil-desa.show');
    }
}
