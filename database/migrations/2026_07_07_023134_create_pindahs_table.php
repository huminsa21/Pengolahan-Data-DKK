<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pindah', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->date('tanggal_pindah');
            $table->text('alamat_tujuan');
            $table->string('desa_tujuan');
            $table->string('kecamatan_tujuan');
            $table->string('kabupaten_tujuan');
            $table->string('provinsi_tujuan');
            $table->string('alasan_pindah');
            $table->string('status', 20)->default('PROSES')->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pindah');
    }
};
