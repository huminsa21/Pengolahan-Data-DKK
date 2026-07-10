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
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('nik', 16)->nullable()->unique()->after('email');
            $table->string('login_type')->default('EMAIL')->after('nik');
            $table->uuid('perangkat_desa_id')->nullable()->after('login_type');
            $table->boolean('must_change_password')->default(false)->after('perangkat_desa_id');
            $table->boolean('is_active')->default(true)->after('must_change_password');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'login_type',
                'perangkat_desa_id',
                'must_change_password',
                'is_active',
                'last_login_at',
            ]);
            $table->string('email')->nullable(false)->change();
        });
    }
};
