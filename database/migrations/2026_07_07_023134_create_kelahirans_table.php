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
        Schema::create('kelahiran', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_bayi');
            $table->string('jenis_kelamin', 20);
            $table->date('tanggal_lahir');
            $table->string('tempat_lahir');
            $table->time('waktu_lahir')->nullable();
            $table->foreignUuid('ayah_id')->nullable()->constrained('penduduk')->nullOnDelete();
            $table->foreignUuid('ibu_id')->nullable()->constrained('penduduk')->nullOnDelete();
            $table->foreignUuid('pelapor_id')->nullable()->constrained('penduduk')->nullOnDelete();
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->text('alamat');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelahiran');
    }
};
