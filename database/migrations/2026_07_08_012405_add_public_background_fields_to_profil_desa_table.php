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
        Schema::table('profil_desa', function (Blueprint $table) {
            $table->string('background_path')->nullable()->after('youtube');
            $table->enum('background_type', ['IMAGE', 'COLOR', 'GRADIENT'])->nullable()->after('background_path');
            $table->string('background_color')->nullable()->after('background_type');
            $table->decimal('background_overlay_opacity', 3, 2)->nullable()->default(0.35)->after('background_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profil_desa', function (Blueprint $table) {
            $table->dropColumn([
                'background_path',
                'background_type',
                'background_color',
                'background_overlay_opacity',
            ]);
        });
    }
};
