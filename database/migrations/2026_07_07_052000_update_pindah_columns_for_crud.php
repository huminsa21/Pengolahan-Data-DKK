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
        Schema::table('pindah', function (Blueprint $table): void {
            $table->text('alamat_tujuan')->nullable()->change();
            $table->string('desa_tujuan')->nullable()->change();
            $table->string('kecamatan_tujuan')->nullable()->change();
            $table->string('kabupaten_tujuan')->nullable()->change();
            $table->string('provinsi_tujuan')->nullable()->change();
            $table->string('alasan_pindah')->nullable()->change();
            $table->text('keterangan')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pindah', function (Blueprint $table): void {
            $table->dropColumn('keterangan');
            $table->text('alamat_tujuan')->nullable(false)->change();
            $table->string('desa_tujuan')->nullable(false)->change();
            $table->string('kecamatan_tujuan')->nullable(false)->change();
            $table->string('kabupaten_tujuan')->nullable(false)->change();
            $table->string('provinsi_tujuan')->nullable(false)->change();
            $table->string('alasan_pindah')->nullable(false)->change();
        });
    }
};
