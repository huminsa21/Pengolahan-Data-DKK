<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePengumumanRequest;
use App\Http\Requests\UpdatePengumumanRequest;
use App\Models\Pengumuman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengumumanController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $pengumuman = Pengumuman::query()
            ->with('pembuat:id,name')
            ->withCount('bantuan')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('judul', 'like', "%{$search}%")
                        ->orWhere('isi', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('pengumuman/index', [
            'pengumuman' => $pengumuman,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
            'stats' => [
                'total' => Pengumuman::count(),
                'draft' => Pengumuman::where('status', 'DRAFT')->count(),
                'published' => Pengumuman::where('status', 'PUBLISHED')->count(),
                'archived' => Pengumuman::where('status', 'ARCHIVED')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pengumuman/create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(StorePengumumanRequest $request): RedirectResponse
    {
        Pengumuman::create([
            ...$this->normalizePublishDate($request->validated()),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengumuman berhasil ditambahkan.']);

        return to_route('pengumuman.index');
    }

    public function show(Pengumuman $pengumuman): Response
    {
        return Inertia::render('pengumuman/show', [
            'pengumuman' => $pengumuman->load('pembuat:id,name')->loadCount('bantuan'),
        ]);
    }

    public function edit(Pengumuman $pengumuman): Response
    {
        return Inertia::render('pengumuman/edit', [
            'pengumuman' => $pengumuman,
            'options' => $this->formOptions(),
        ]);
    }

    public function update(UpdatePengumumanRequest $request, Pengumuman $pengumuman): RedirectResponse
    {
        $pengumuman->update($this->normalizePublishDate($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengumuman berhasil diperbarui.']);

        return to_route('pengumuman.index');
    }

    public function destroy(Pengumuman $pengumuman): RedirectResponse
    {
        if ($pengumuman->bantuan()->exists()) {
            Inertia::flash('toast', ['type' => 'warning', 'message' => 'Pengumuman terkait bantuan sebaiknya di-archive, bukan dihapus.']);

            return back();
        }

        $pengumuman->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengumuman berhasil dihapus.']);

        return to_route('pengumuman.index');
    }

    public function publish(Pengumuman $pengumuman): RedirectResponse
    {
        $pengumuman->update([
            'status' => 'PUBLISHED',
            'tanggal_publish' => $pengumuman->tanggal_publish ?: now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengumuman berhasil dipublikasikan.']);

        return back();
    }

    public function archive(Pengumuman $pengumuman): RedirectResponse
    {
        $pengumuman->update(['status' => 'ARCHIVED']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengumuman berhasil diarsipkan.']);

        return back();
    }

    /**
     * @return array<string, list<string>>
     */
    private function formOptions(): array
    {
        return [
            'status' => ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizePublishDate(array $data): array
    {
        if (($data['status'] ?? null) === 'PUBLISHED' && blank($data['tanggal_publish'] ?? null)) {
            $data['tanggal_publish'] = now();
        }

        return $data;
    }
}
