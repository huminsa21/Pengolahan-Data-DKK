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
        Schema::create('surat', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nomor_surat')->unique();
            $table->foreignUuid('jenis_surat_id')->constrained('jenis_surat')->cascadeOnDelete();
            $table->foreignUuid('penduduk_id')->nullable()->constrained('penduduk')->nullOnDelete();
            $table->date('tanggal_surat');
            $table->string('keperluan');
            $table->json('data_json')->nullable();
            $table->string('status', 20)->default('DRAFT')->index();
            $table->foreignId('dibuat_oleh')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat');
    }
};
