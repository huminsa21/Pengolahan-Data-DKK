<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class ProfilDesa extends Model
{
    /** @use HasFactory<\Database\Factories\ProfilDesaFactory> */
    use HasFactory;
    use HasUuids;

    protected $table = 'profil_desa';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nama_desa',
        'kecamatan',
        'kabupaten',
        'provinsi',
        'alamat',
        'kode_pos',
        'telepon',
        'email',
        'website',
        'nama_kepala_desa',
        'nip_kepala_desa',
        'logo_path',
        'visi',
        'misi',
        'sejarah',
        'jam_pelayanan',
        'maps_embed',
        'facebook',
        'instagram',
        'youtube',
        'background_path',
        'background_type',
        'background_color',
        'background_overlay_opacity',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'background_overlay_opacity' => 'float',
        ];
    }

    public static function current(): self
    {
        $profilDesa = new self;

        if (! Schema::hasTable($profilDesa->getTable())) {
            return self::fallback();
        }

        return self::query()->first() ?? self::fallback();
    }

    public function logoUrl(): string
    {
        return $this->getLogoUrlAttribute();
    }

    public function logoPublicPath(): string
    {
        return public_path($this->resolvedLogoPath());
    }

    public function getLogoUrlAttribute(): string
    {
        return asset($this->resolvedLogoPath());
    }

    public function getBackgroundUrlAttribute(): ?string
    {
        $backgroundPath = $this->background_path;

        if (! $backgroundPath || ! file_exists(public_path($backgroundPath))) {
            return null;
        }

        return asset($backgroundPath);
    }

    /**
     * @return array<string, string>
     */
    public function getPublicBackgroundStyleAttribute(): array
    {
        if ($this->background_type === 'IMAGE' && $this->background_url) {
            return [
                'backgroundImage' => "url('{$this->background_url}')",
                'backgroundSize' => 'cover',
                'backgroundPosition' => 'center',
            ];
        }

        if ($this->background_type === 'COLOR' && $this->background_color) {
            return [
                'backgroundColor' => $this->background_color,
            ];
        }

        if ($this->background_type === 'GRADIENT') {
            return [
                'backgroundImage' => 'linear-gradient(135deg, #047857, #14532d)',
            ];
        }

        return [
            'backgroundColor' => '#F8FAFC',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toBrandingArray(): array
    {
        return [
            'nama_desa' => $this->nama_desa,
            'kecamatan' => $this->kecamatan,
            'kabupaten' => $this->kabupaten,
            'provinsi' => $this->provinsi,
            'alamat' => $this->alamat,
            'kode_pos' => $this->kode_pos,
            'telepon' => $this->telepon,
            'email' => $this->email,
            'website' => $this->website,
            'nama_kepala_desa' => $this->nama_kepala_desa,
            'nip_kepala_desa' => $this->nip_kepala_desa,
            'logo_path' => $this->logo_path,
            'visi' => $this->visi,
            'misi' => $this->misi,
            'sejarah' => $this->sejarah,
            'jam_pelayanan' => $this->jam_pelayanan,
            'maps_embed' => $this->maps_embed,
            'facebook' => $this->facebook,
            'instagram' => $this->instagram,
            'youtube' => $this->youtube,
            'background_path' => $this->background_path,
            'background_type' => $this->background_type,
            'background_color' => $this->background_color,
            'background_overlay_opacity' => $this->background_overlay_opacity,
            'logo' => $this->logo_url,
            'logo_url' => $this->logo_url,
            'background_url' => $this->background_url,
            'public_background_style' => $this->public_background_style,
            'nama_aplikasi' => config('desa.nama_aplikasi', 'Sistem Informasi Kependudukan Desa'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toPdfArray(): array
    {
        return [
            ...$this->toBrandingArray(),
            'logo' => $this->logoPublicPath(),
            'kepala_desa' => $this->nama_kepala_desa ?: 'Kepala Desa',
        ];
    }

    private static function fallback(): self
    {
        return new self([
            'nama_desa' => config('desa.nama_desa', 'Desa Kodon-Kodon'),
            'kecamatan' => config('desa.kecamatan', 'Merek'),
            'kabupaten' => config('desa.kabupaten', 'Karo'),
            'provinsi' => config('desa.provinsi', 'Sumatera Utara'),
            'alamat' => config('desa.alamat'),
            'kode_pos' => config('desa.kode_pos'),
            'telepon' => config('desa.telepon'),
            'email' => config('desa.email'),
            'website' => config('desa.website'),
            'nama_kepala_desa' => config('desa.nama_kepala_desa', config('desa.kepala_desa')),
            'nip_kepala_desa' => config('desa.nip_kepala_desa'),
            'logo_path' => config('desa.logo_path', config('desa.logo', 'img/logo.png')),
            'visi' => null,
            'misi' => null,
            'sejarah' => null,
            'jam_pelayanan' => null,
            'maps_embed' => null,
            'facebook' => null,
            'instagram' => null,
            'youtube' => null,
            'background_path' => null,
            'background_type' => null,
            'background_color' => null,
            'background_overlay_opacity' => 0.35,
        ]);
    }

    private function resolvedLogoPath(): string
    {
        $logoPath = $this->logo_path ?: 'img/logo.png';

        if (file_exists(public_path($logoPath))) {
            return $logoPath;
        }

        return 'img/logo.png';
    }
}
