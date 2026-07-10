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
            $table->text('visi')->nullable()->after('logo_path');
            $table->longText('misi')->nullable()->after('visi');
            $table->longText('sejarah')->nullable()->after('misi');
            $table->string('jam_pelayanan')->nullable()->after('sejarah');
            $table->text('maps_embed')->nullable()->after('jam_pelayanan');
            $table->string('facebook')->nullable()->after('maps_embed');
            $table->string('instagram')->nullable()->after('facebook');
            $table->string('youtube')->nullable()->after('instagram');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profil_desa', function (Blueprint $table) {
            $table->dropColumn([
                'visi',
                'misi',
                'sejarah',
                'jam_pelayanan',
                'maps_embed',
                'facebook',
                'instagram',
                'youtube',
            ]);
        });
    }
};
