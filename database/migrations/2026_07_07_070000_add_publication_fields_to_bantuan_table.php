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
        Schema::table('bantuan', function (Blueprint $table) {
            $table->year('tahun')->nullable()->change();
            $table->boolean('is_published')->default(false)->index()->after('status');
            $table->timestamp('published_at')->nullable()->after('is_published');
            $table->foreignUuid('pengumuman_id')->nullable()->after('published_at')->constrained('pengumuman')->nullOnDelete();
            $table->boolean('tampilkan_penerima')->default(true)->after('pengumuman_id');
        });

        Schema::table('penerima_bantuan', function (Blueprint $table) {
            $table->date('tanggal_terima')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penerima_bantuan', function (Blueprint $table) {
            $table->date('tanggal_terima')->nullable(false)->change();
        });

        Schema::table('bantuan', function (Blueprint $table) {
            $table->dropColumn('tampilkan_penerima');
            $table->dropConstrainedForeignId('pengumuman_id');
            $table->dropColumn(['is_published', 'published_at']);
            $table->year('tahun')->nullable(false)->change();
        });
    }
};
