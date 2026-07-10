@extends('pdf.surat.base')

@section('content')
    @php($kelahiran = data_get($data, 'kelahiran'))
    <p>Yang bertanda tangan di bawah ini menerangkan bahwa telah lahir seorang anak dengan data sebagai berikut:</p>
    <table class="data-table">
        <tr><td>Nama Bayi</td><td>: {{ data_get($kelahiran, 'nama_bayi', '-') }}</td></tr>
        <tr><td>Jenis Kelamin</td><td>: {{ data_get($kelahiran, 'jenis_kelamin', '-') }}</td></tr>
        <tr><td>Tempat/Tanggal Lahir</td><td>: {{ data_get($kelahiran, 'tempat_lahir', '-') }}, {{ data_get($kelahiran, 'tanggal_lahir', '-') }}</td></tr>
        <tr><td>Ayah</td><td>: {{ data_get($kelahiran, 'ayah', '-') }}</td></tr>
        <tr><td>Ibu</td><td>: {{ data_get($kelahiran, 'ibu', '-') }}</td></tr>
        <tr><td>Pelapor</td><td>: {{ data_get($kelahiran, 'pelapor', '-') }}</td></tr>
    </table>
    <p>Demikian surat keterangan kelahiran ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
@endsection
