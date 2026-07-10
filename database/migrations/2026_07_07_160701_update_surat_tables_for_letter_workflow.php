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
        Schema::table('jenis_surat', function (Blueprint $table): void {
            $table->longText('template_surat')->nullable()->change();
        });

        Schema::table('surat', function (Blueprint $table): void {
            $table->string('nomor_surat')->nullable()->change();
            $table->string('keperluan')->nullable()->change();
            $table->string('referensi_tipe', 30)->nullable()->after('penduduk_id')->index();
            $table->string('referensi_id')->nullable()->after('referensi_tipe')->index();
            $table->index(['jenis_surat_id', 'status']);
            $table->index(['tanggal_surat', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat', function (Blueprint $table): void {
            $table->dropIndex(['jenis_surat_id', 'status']);
            $table->dropIndex(['tanggal_surat', 'status']);
            $table->dropIndex(['referensi_tipe']);
            $table->dropIndex(['referensi_id']);
            $table->dropColumn(['referensi_tipe', 'referensi_id']);
            $table->string('nomor_surat')->nullable(false)->change();
            $table->string('keperluan')->nullable(false)->change();
        });

        Schema::table('jenis_surat', function (Blueprint $table): void {
            $table->longText('template_surat')->nullable(false)->change();
        });
    }
};
