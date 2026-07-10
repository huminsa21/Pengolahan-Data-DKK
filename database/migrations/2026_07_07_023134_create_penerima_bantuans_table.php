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
        Schema::create('penerima_bantuan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('bantuan_id')->constrained('bantuan')->cascadeOnDelete();
            $table->foreignUuid('penduduk_id')->constrained('penduduk')->cascadeOnDelete();
            $table->date('tanggal_terima');
            $table->decimal('nominal', 15, 2)->nullable();
            $table->string('status', 20)->default('AKTIF')->index();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique(['bantuan_id', 'penduduk_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerima_bantuan');
    }
};
