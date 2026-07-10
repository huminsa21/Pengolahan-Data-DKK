<?php

namespace App\Models;

use Database\Factories\PengumumanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['judul', 'isi', 'tanggal_publish', 'status', 'created_by'])]
class Pengumuman extends Model
{
    /** @use HasFactory<PengumumanFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'pengumuman';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_publish' => 'datetime',
        ];
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function bantuan(): HasMany
    {
        return $this->hasMany(Bantuan::class);
    }
}
