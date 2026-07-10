@extends('pdf.surat.base')

@section('content')
    @php($kematian = data_get($data, 'kematian'))
    @php($penduduk = data_get($kematian, 'penduduk'))
    <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
    <table class="data-table">
        <tr><td>Nama</td><td>: {{ data_get($penduduk, 'nama', '-') }}</td></tr>
        <tr><td>NIK</td><td>: {{ data_get($penduduk, 'nik', '-') }}</td></tr>
        <tr><td>Tempat/Tanggal Lahir</td><td>: {{ data_get($penduduk, 'tempat_lahir', '-') }}, {{ data_get($penduduk, 'tanggal_lahir', '-') }}</td></tr>
        <tr><td>Tanggal Meninggal</td><td>: {{ data_get($kematian, 'tanggal_meninggal', '-') }}</td></tr>
        <tr><td>Sebab Meninggal</td><td>: {{ data_get($kematian, 'sebab_meninggal', '-') }}</td></tr>
        <tr><td>Pelapor</td><td>: {{ data_get($kematian, 'pelapor', '-') }}</td></tr>
    </table>
    <p>Benar telah meninggal dunia. Surat ini dibuat sebagai keterangan resmi pemerintah desa.</p>
@endsection
