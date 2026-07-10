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
        Schema::create('pendatang', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('penduduk_id')->nullable()->constrained('penduduk')->nullOnDelete();
            $table->string('nik', 16)->index();
            $table->string('nama_lengkap');
            $table->string('jenis_kelamin', 20);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->text('alamat_asal');
            $table->string('desa_asal');
            $table->string('kecamatan_asal');
            $table->string('kabupaten_asal');
            $table->string('provinsi_asal');
            $table->date('tanggal_datang');
            $table->string('alasan_datang');
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
        Schema::dropIfExists('pendatang');
    }
};
