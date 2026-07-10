@extends('pdf.surat.base')

@section('content')
    @php($pendatang = data_get($data, 'pendatang'))
    <p>Yang bertanda tangan di bawah ini menerangkan bahwa penduduk berikut telah datang dan berdomisili di wilayah desa:</p>
    <table class="data-table">
        <tr><td>Nama</td><td>: {{ data_get($pendatang, 'nama', '-') }}</td></tr>
        <tr><td>NIK</td><td>: {{ data_get($pendatang, 'nik', '-') }}</td></tr>
        <tr><td>Alamat Asal</td><td>: {{ data_get($pendatang, 'alamat_asal', '-') }}</td></tr>
        <tr><td>Alamat Tujuan</td><td>: {{ data_get($pendatang, 'alamat_tujuan', '-') }}</td></tr>
        <tr><td>Tanggal Datang</td><td>: {{ data_get($pendatang, 'tanggal_datang', '-') }}</td></tr>
        <tr><td>Alasan Datang</td><td>: {{ data_get($pendatang, 'alasan_datang', '-') }}</td></tr>
    </table>
    <p>Demikian surat keterangan datang ini dibuat dengan sebenar-benarnya.</p>
@endsection
