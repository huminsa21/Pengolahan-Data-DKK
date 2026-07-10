<?php

namespace Database\Seeders;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Database\Seeder;

class PengumumanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@desa.id')->firstOrFail();

        $pengumuman = [
            [
                'judul' => 'Jadwal Pelayanan Administrasi Desa',
                'isi' => 'Pelayanan administrasi desa dibuka setiap hari kerja pukul 08.00 sampai 15.00.',
                'status' => 'PUBLISHED',
            ],
            [
                'judul' => 'Pendataan Penerima Bantuan Sosial',
                'isi' => 'Warga diminta menyiapkan dokumen kependudukan untuk proses verifikasi data bantuan sosial.',
                'status' => 'PUBLISHED',
            ],
            [
                'judul' => 'Musyawarah Desa Bulanan',
                'isi' => 'Musyawarah desa bulanan akan dilaksanakan di balai desa dengan agenda evaluasi program kerja.',
                'status' => 'DRAFT',
            ],
        ];

        foreach ($pengumuman as $item) {
            Pengumuman::updateOrCreate(
                ['judul' => $item['judul']],
                [
                    ...$item,
                    'tanggal_publish' => $item['status'] === 'PUBLISHED' ? now() : null,
                    'created_by' => $admin->id,
                ],
            );
        }
    }
}
