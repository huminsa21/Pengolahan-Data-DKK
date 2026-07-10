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
        Schema::create('penduduk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nik', 16)->unique();
            $table->string('nama_lengkap');
            $table->string('jenis_kelamin', 20);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('agama');
            $table->string('status_perkawinan');
            $table->string('pendidikan');
            $table->string('pekerjaan');
            $table->string('no_hp')->nullable();
            $table->text('alamat');
            $table->string('dusun');
            $table->string('rt', 3);
            $table->string('rw', 3);
            $table->string('desa');
            $table->string('kecamatan');
            $table->string('kabupaten');
            $table->string('provinsi');
            $table->string('no_kk', 16)->nullable()->index();
            $table->string('hubungan_keluarga')->nullable();
            $table->boolean('is_kepala_keluarga')->default(false);
            $table->string('status_penduduk', 20)->default('AKTIF')->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penduduk');
    }
};
