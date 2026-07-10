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
        $pelaporTypes = [
            'PENDUDUK',
            'KELUARGA',
            'KEPALA_DUSUN',
            'RT',
            'RW',
            'BIDAN',
            'PERANGKAT_DESA',
            'LAINNYA',
        ];

        Schema::table('kelahiran', function (Blueprint $table) use ($pelaporTypes): void {
            $table->enum('pelapor_tipe', $pelaporTypes)->default('PENDUDUK')->after('ibu_id');
            $table->string('pelapor_nama')->nullable()->after('pelapor_id');
            $table->string('pelapor_kontak')->nullable()->after('pelapor_nama');
        });

        Schema::table('kematian', function (Blueprint $table) use ($pelaporTypes): void {
            $table->enum('pelapor_tipe', $pelaporTypes)->default('PENDUDUK')->after('penduduk_id');
            $table->string('pelapor_nama')->nullable()->after('pelapor_id');
            $table->string('pelapor_kontak')->nullable()->after('pelapor_nama');
        });

        Schema::table('pendatang', function (Blueprint $table) use ($pelaporTypes): void {
            $table->enum('pelapor_tipe', $pelaporTypes)->default('LAINNYA')->after('penduduk_id');
            $table->foreignUuid('pelapor_id')->nullable()->after('pelapor_tipe')->constrained('penduduk')->nullOnDelete();
            $table->string('pelapor_nama')->nullable()->after('pelapor_id');
            $table->string('pelapor_kontak')->nullable()->after('pelapor_nama');
        });

        Schema::table('pindah', function (Blueprint $table) use ($pelaporTypes): void {
            $table->enum('pelapor_tipe', $pelaporTypes)->default('PENDUDUK')->after('penduduk_id');
            $table->foreignUuid('pelapor_id')->nullable()->after('pelapor_tipe')->constrained('penduduk')->nullOnDelete();
            $table->string('pelapor_nama')->nullable()->after('pelapor_id');
            $table->string('pelapor_kontak')->nullable()->after('pelapor_nama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pindah', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('pelapor_id');
            $table->dropColumn(['pelapor_tipe', 'pelapor_nama', 'pelapor_kontak']);
        });

        Schema::table('pendatang', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('pelapor_id');
            $table->dropColumn(['pelapor_tipe', 'pelapor_nama', 'pelapor_kontak']);
        });

        Schema::table('kematian', function (Blueprint $table): void {
            $table->dropColumn(['pelapor_tipe', 'pelapor_nama', 'pelapor_kontak']);
        });

        Schema::table('kelahiran', function (Blueprint $table): void {
            $table->dropColumn(['pelapor_tipe', 'pelapor_nama', 'pelapor_kontak']);
        });
    }
};
