<?php

return [
    'nama_desa' => env('DESA_NAMA', 'Desa Kodon-Kodon'),
    'kecamatan' => env('DESA_KECAMATAN', 'Merek'),
    'kabupaten' => env('DESA_KABUPATEN', 'Karo'),
    'provinsi' => env('DESA_PROVINSI', 'Sumatera Utara'),
    'alamat' => env('DESA_ALAMAT', ''),
    'kode_pos' => env('DESA_KODE_POS', ''),
    'telepon' => env('DESA_TELEPON', ''),
    'email' => env('DESA_EMAIL', ''),
    'website' => env('DESA_WEBSITE', ''),
    'nama_kepala_desa' => env('DESA_NAMA_KEPALA_DESA', env('DESA_KEPALA_DESA', 'Kepala Desa')),
    'nip_kepala_desa' => env('DESA_NIP_KEPALA_DESA', ''),
    'kepala_desa' => env('DESA_KEPALA_DESA', 'Kepala Desa'),
    'logo_path' => 'img/logo.png',
    'logo' => 'img/logo.png',
    'nama_aplikasi' => env('DESA_APLIKASI_NAMA', 'Sistem Informasi Kependudukan Desa'),
];
