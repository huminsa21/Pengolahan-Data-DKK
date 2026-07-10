<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@desa.id'],
            [
                'name' => 'Administrator Desa',
                'password' => 'password',
                'email_verified_at' => now(),
                'login_type' => 'EMAIL',
                'must_change_password' => false,
                'is_active' => true,
            ],
        );

        Role::findOrCreate('Super Admin', 'web');

        $admin->syncRoles('Super Admin');
    }
}
