<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $dashboardService): Response
    {
        $currentYear = now()->year;
        $year = (int) $request->integer('year', $currentYear);
        $year = $year > 1900 && $year <= $currentYear + 1 ? $year : $currentYear;
        $dusunId = $request->filled('dusun_id') ? (string) $request->query('dusun_id') : null;

        return Inertia::render('dashboard', [
            'filters' => [
                'year' => $year,
                'dusun_id' => $dusunId,
            ],
            'filterOptions' => $dashboardService->getFilterOptions(),
            'summaryStats' => $dashboardService->getSummaryStats($year, $dusunId),
            'charts' => [
                'pendudukPerDusun' => $dashboardService->getPendudukPerDusun($year),
                'jenisKelamin' => $dashboardService->getJenisKelaminStats($dusunId),
                'peristiwaBulanan' => $dashboardService->getPeristiwaBulanan($year, $dusunId),
                'bantuanPerProgram' => $dashboardService->getBantuanStats($year),
                'suratPerJenis' => $dashboardService->getSuratStats($year),
            ],
            'recent' => $dashboardService->getRecentActivities($dusunId),
        ]);
    }
}
