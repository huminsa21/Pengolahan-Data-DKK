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
        Schema::create('bantuan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('kode_bantuan')->unique();
            $table->string('nama_bantuan');
            $table->string('jenis_bantuan');
            $table->string('sumber_bantuan');
            $table->year('tahun');
            $table->text('deskripsi')->nullable();
            $table->string('status', 20)->default('AKTIF')->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bantuan');
    }
};
