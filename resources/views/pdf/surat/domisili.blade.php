@extends('pdf.surat.base')

@section('content')
    @php($penduduk = data_get($data, 'penduduk'))
    <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
    <table class="data-table">
        <tr><td>Nama</td><td>: {{ data_get($penduduk, 'nama', '-') }}</td></tr>
        <tr><td>NIK</td><td>: {{ data_get($penduduk, 'nik', '-') }}</td></tr>
        <tr><td>Tempat/Tanggal Lahir</td><td>: {{ data_get($penduduk, 'tempat_lahir', '-') }}, {{ data_get($penduduk, 'tanggal_lahir', '-') }}</td></tr>
        <tr><td>Jenis Kelamin</td><td>: {{ data_get($penduduk, 'jenis_kelamin', '-') }}</td></tr>
        <tr><td>Pekerjaan</td><td>: {{ data_get($penduduk, 'pekerjaan', '-') }}</td></tr>
        <tr><td>Alamat</td><td>: {{ data_get($penduduk, 'alamat', '-') }}</td></tr>
        <tr><td>Dusun/RT/RW</td><td>: {{ data_get($penduduk, 'dusun', '-') }} / {{ data_get($penduduk, 'rt', '-') }} / {{ data_get($penduduk, 'rw', '-') }}</td></tr>
    </table>
    <p>Benar berdomisili di wilayah {{ $desa['nama_desa'] }}. Surat keterangan ini dibuat untuk keperluan {{ data_get($data, 'keperluan', $surat->keperluan ?: '-') }}.</p>
@endsection
