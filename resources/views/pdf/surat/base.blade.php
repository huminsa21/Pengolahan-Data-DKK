<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>{{ $surat->jenisSurat->nama_surat }}</title>
    <style>
        @page { margin: 22mm 20mm 18mm; }
        body { color: #111827; font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.65; }
        .kop { border-bottom: 3px double #111827; margin-bottom: 24px; padding-bottom: 10px; width: 100%; }
        .kop-logo { vertical-align: middle; width: 92px; }
        .kop-logo img { height: 74px; object-fit: contain; width: 74px; }
        .kop-text { text-align: center; vertical-align: middle; }
        .kop-text h1, .kop-text h2, .kop-text p { margin: 0; }
        .kop-text h1 { font-size: 15px; text-transform: uppercase; }
        .kop-text h2 { font-size: 18px; text-transform: uppercase; }
        .kop-text p { font-size: 11px; margin-top: 3px; }
        .title { font-size: 15px; font-weight: 700; margin-bottom: 2px; text-align: center; text-decoration: underline; text-transform: uppercase; }
        .number { margin-bottom: 26px; text-align: center; }
        .content { min-height: 310px; text-align: justify; }
        .data-table { border-collapse: collapse; margin: 12px 0; width: 100%; }
        .data-table td { padding: 2px 0; vertical-align: top; }
        .data-table td:first-child { width: 165px; }
        .signature { margin-left: auto; margin-top: 46px; text-align: center; width: 230px; }
        .signature-space { height: 72px; }
        .signature-name { font-weight: 700; text-decoration: underline; }
        .footer { bottom: -8mm; color: #6b7280; font-size: 9px; left: 0; position: fixed; right: 0; text-align: center; }
        .watermark { color: #9ca3af; font-size: 72px; font-weight: 700; left: 0; opacity: .18; position: fixed; right: 0; text-align: center; top: 44%; transform: rotate(-18deg); }
    </style>
</head>
<body>
    @if ($isDraft)
        <div class="watermark">DRAFT</div>
    @endif

    <table class="kop">
        <tr>
            <td class="kop-logo">
                @if (file_exists($desa['logo']))
                    <img src="{{ $desa['logo'] }}" alt="Logo Desa">
                @endif
            </td>
            <td class="kop-text">
                <h1>Pemerintah Kabupaten {{ $desa['kabupaten'] }}</h1>
                <h1>Kecamatan {{ $desa['kecamatan'] }}</h1>
                <h2>{{ $desa['nama_desa'] }}</h2>
                <p>
                    {{ $desa['alamat'] ?: 'Alamat desa belum dikonfigurasi' }}
                    @if ($desa['kode_pos'])
                        <br>Kode Pos: {{ $desa['kode_pos'] }}
                    @endif
                    @if ($desa['telepon'])
                        <br>Telepon: {{ $desa['telepon'] }}
                    @endif
                    @if ($desa['email'])
                        @if (! $desa['telepon'])
                            <br>
                        @endif
                        Email: {{ $desa['email'] }}
                    @endif
                </p>
            </td>
            <td class="kop-logo">&nbsp;</td>
        </tr>
    </table>

    <div class="title">{{ $surat->jenisSurat->nama_surat }}</div>
    <div class="number">Nomor: {{ $surat->nomor_surat ?: 'DRAFT' }}</div>

    <main class="content">
        @yield('content')
    </main>

    <footer class="signature">
        <div>{{ $desa['nama_desa'] }}, {{ $surat->tanggal_surat->translatedFormat('d F Y') }}</div>
        <div>Kepala Desa</div>
        <div class="signature-space"></div>
        <div class="signature-name">{{ $desa['kepala_desa'] }}</div>
        @if ($desa['nip_kepala_desa'])
            <div>NIP. {{ $desa['nip_kepala_desa'] }}</div>
        @endif
    </footer>

    <div class="footer">Dokumen dicetak oleh {{ $desa['nama_aplikasi'] }}</div>
</body>
</html>
