<?php

namespace App\Http\Controllers;

use App\Exports\LaporanSpreadsheetExport;
use App\Models\ProfilDesa;
use App\Services\LaporanService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(LaporanService $laporanService): Response
    {
        return Inertia::render('laporan/index', [
            'reportTypes' => $laporanService->typeCards(),
        ]);
    }

    public function show(Request $request, LaporanService $laporanService, string $jenis): Response
    {
        return Inertia::render('laporan/show', [
            'report' => $laporanService->preview($jenis, $request->query()),
            'filterOptions' => $laporanService->filterOptions(),
        ]);
    }

    public function pdf(Request $request, LaporanService $laporanService, string $jenis): HttpResponse
    {
        $meta = $laporanService->meta($jenis);
        $filters = $laporanService->normalizeFilters($request->query());
        $columns = $laporanService->columns($jenis);
        $rows = $laporanService->rowsForExport($jenis, $filters);

        $pdf = Pdf::loadView('pdf.laporan.index', [
            'profilDesa' => ProfilDesa::current(),
            'title' => $meta['title'],
            'filters' => $filters,
            'columns' => $columns,
            'rows' => $rows,
            'printedAt' => now()->translatedFormat('d F Y H:i'),
            'printedBy' => $request->user()?->name ?? '-',
        ])->setPaper('a4', 'landscape');

        return $pdf->download($this->filename($jenis, 'pdf'));
    }

    public function excel(Request $request, LaporanService $laporanService, string $jenis): HttpResponse
    {
        $meta = $laporanService->meta($jenis);
        $filters = $laporanService->normalizeFilters($request->query());
        $export = new LaporanSpreadsheetExport(
            title: (string) $meta['title'],
            columns: $laporanService->columns($jenis),
            rows: $laporanService->rowsForExport($jenis, $filters),
        );

        return response($export->content(), 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$this->filename($jenis, 'xls').'"',
        ]);
    }

    private function filename(string $jenis, string $extension): string
    {
        return 'laporan-'.$jenis.'-'.now()->format('Ymd-His').'.'.$extension;
    }
}
