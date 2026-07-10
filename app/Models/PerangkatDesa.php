<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PerangkatDesa extends Model
{
    /** @use HasFactory<\Database\Factories\PerangkatDesaFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    public const JABATAN = [
        'Kepala Desa',
        'Sekretaris Desa',
        'Kaur Pemerintahan',
        'Kaur Keuangan',
        'Kaur Umum',
        'Kasi Pemerintahan',
        'Kasi Pelayanan',
        'Kasi Kesejahteraan',
        'Kepala Dusun I',
        'Kepala Dusun II',
        'Kepala Dusun III',
        'Kepala Dusun IV',
        'Operator Desa',
    ];

    protected $table = 'perangkat_desa';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'penduduk_id',
        'jabatan',
        'nomor_sk',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'user_id',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function roleName(): string
    {
        return match ($this->jabatan) {
            'Kepala Desa' => 'Kepala Desa',
            'Sekretaris Desa' => 'Sekretaris Desa',
            'Kaur Pemerintahan', 'Kasi Pemerintahan' => 'Kaur Pemerintahan',
            'Kepala Dusun I', 'Kepala Dusun II', 'Kepala Dusun III', 'Kepala Dusun IV' => 'Kepala Dusun',
            default => 'Operator Desa',
        };
    }
}
