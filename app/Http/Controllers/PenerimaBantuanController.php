<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePenerimaBantuanRequest;
use App\Http\Requests\UpdatePenerimaBantuanRequest;
use App\Models\Bantuan;
use App\Models\PenerimaBantuan;
use App\Services\BantuanService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class PenerimaBantuanController extends Controller
{
    public function __construct(private readonly BantuanService $bantuanService) {}

    public function index(): RedirectResponse
    {
        return to_route('bantuan.index');
    }

    public function store(StorePenerimaBantuanRequest $request, Bantuan $bantuan): RedirectResponse
    {
        $this->bantuanService->addPenerima($bantuan, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penerima bantuan berhasil ditambahkan.']);

        return back();
    }

    public function update(UpdatePenerimaBantuanRequest $request, PenerimaBantuan $penerimaBantuan): RedirectResponse
    {
        $this->bantuanService->updatePenerima($penerimaBantuan, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penerima bantuan berhasil diperbarui.']);

        return back();
    }

    public function destroy(PenerimaBantuan $penerimaBantuan): RedirectResponse
    {
        $this->bantuanService->removePenerima($penerimaBantuan);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penerima bantuan berhasil dihapus.']);

        return back();
    }
}
