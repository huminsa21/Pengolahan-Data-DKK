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
        Schema::table('penduduk', function (Blueprint $table) {
            $table->string('nik', 16)->nullable()->change();
        });

        Schema::table('kelahiran', function (Blueprint $table) {
            $table->foreignUuid('penduduk_id_bayi')
                ->nullable()
                ->after('id')
                ->constrained('penduduk')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kelahiran', function (Blueprint $table) {
            $table->dropConstrainedForeignId('penduduk_id_bayi');
        });

        Schema::table('penduduk', function (Blueprint $table) {
            $table->string('nik', 16)->nullable(false)->change();
        });
    }
};
