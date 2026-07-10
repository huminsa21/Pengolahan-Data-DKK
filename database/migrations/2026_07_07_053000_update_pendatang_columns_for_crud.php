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
        Schema::table('pendatang', function (Blueprint $table): void {
            $table->string('nik', 16)->nullable()->change();
            $table->string('tempat_lahir')->nullable()->change();
            $table->date('tanggal_lahir')->nullable()->change();
            $table->text('alamat_asal')->nullable()->change();
            $table->string('desa_asal')->nullable()->change();
            $table->string('kecamatan_asal')->nullable()->change();
            $table->string('kabupaten_asal')->nullable()->change();
            $table->string('provinsi_asal')->nullable()->change();
            $table->string('alasan_datang')->nullable()->change();
            $table->string('agama')->nullable()->after('tanggal_lahir');
            $table->string('status_perkawinan')->nullable()->after('agama');
            $table->string('pendidikan')->nullable()->after('status_perkawinan');
            $table->string('pekerjaan')->nullable()->after('pendidikan');
            $table->string('no_hp')->nullable()->after('pekerjaan');
            $table->foreignUuid('dusun_id')->nullable()->after('provinsi_asal')->constrained('dusun')->nullOnDelete();
            $table->text('alamat_tujuan')->nullable()->after('dusun_id');
            $table->string('rt', 3)->nullable()->after('alamat_tujuan');
            $table->string('rw', 3)->nullable()->after('rt');
            $table->text('keterangan')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendatang', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('dusun_id');
            $table->dropColumn([
                'agama',
                'status_perkawinan',
                'pendidikan',
                'pekerjaan',
                'no_hp',
                'alamat_tujuan',
                'rt',
                'rw',
                'keterangan',
            ]);
            $table->string('nik', 16)->nullable(false)->change();
            $table->string('tempat_lahir')->nullable(false)->change();
            $table->date('tanggal_lahir')->nullable(false)->change();
            $table->text('alamat_asal')->nullable(false)->change();
            $table->string('desa_asal')->nullable(false)->change();
            $table->string('kecamatan_asal')->nullable(false)->change();
            $table->string('kabupaten_asal')->nullable(false)->change();
            $table->string('provinsi_asal')->nullable(false)->change();
            $table->string('alasan_datang')->nullable(false)->change();
        });
    }
};
