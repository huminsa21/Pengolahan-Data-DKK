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
        Schema::create('dusun', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('kode_dusun')->nullable()->unique();
            $table->string('nama_dusun');
            $table->string('kepala_dusun')->nullable();
            $table->string('no_hp_kepala_dusun')->nullable();
            $table->text('keterangan')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dusun');
    }
};
