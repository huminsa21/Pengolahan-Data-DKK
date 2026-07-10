<?php

namespace App\Models;

use Database\Factories\DusunFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'kode_dusun',
    'nama_dusun',
    'kepala_dusun',
    'no_hp_kepala_dusun',
    'keterangan',
    'is_active',
])]
class Dusun extends Model
{
    /** @use HasFactory<DusunFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'dusun';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function penduduk(): HasMany
    {
        return $this->hasMany(Penduduk::class);
    }

    public function pendatang(): HasMany
    {
        return $this->hasMany(Pendatang::class);
    }
}
