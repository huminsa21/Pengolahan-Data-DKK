@extends('pdf.surat.base')

@section('content')
    @php($pindah = data_get($data, 'pindah'))
    @php($penduduk = data_get($pindah, 'penduduk'))
    <p>Yang bertanda tangan di bawah ini menerangkan bahwa penduduk berikut mengajukan keterangan pindah:</p>
    <table class="data-table">
        <tr><td>Nama</td><td>: {{ data_get($penduduk, 'nama', '-') }}</td></tr>
        <tr><td>NIK</td><td>: {{ data_get($penduduk, 'nik', '-') }}</td></tr>
        <tr><td>Alamat Asal</td><td>: {{ data_get($pindah, 'alamat_asal', '-') }}</td></tr>
        <tr><td>Alamat Tujuan</td><td>: {{ data_get($pindah, 'alamat_tujuan', '-') }}</td></tr>
        <tr><td>Tanggal Pindah</td><td>: {{ data_get($pindah, 'tanggal_pindah', '-') }}</td></tr>
        <tr><td>Alasan Pindah</td><td>: {{ data_get($pindah, 'alasan_pindah', '-') }}</td></tr>
    </table>
    <p>Demikian surat keterangan pindah ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
@endsection
