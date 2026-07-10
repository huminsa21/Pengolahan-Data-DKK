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
        Schema::table('kematian', function (Blueprint $table): void {
            $table->string('tempat_meninggal')->nullable()->change();
            $table->string('sebab_meninggal')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kematian', function (Blueprint $table): void {
            $table->string('tempat_meninggal')->nullable(false)->change();
            $table->string('sebab_meninggal')->nullable(false)->change();
        });
    }
};
