<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>{{ $judul }}</title>
    <style>
        @page {
            margin: 22mm 20mm 18mm;
        }

        body {
            color: #111827;
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.6;
        }

        .kop-table {
            border-bottom: 3px double #111827;
            margin-bottom: 22px;
            padding-bottom: 10px;
            width: 100%;
        }

        .kop-logo {
            vertical-align: middle;
            width: 92px;
        }

        .kop-logo img {
            height: 74px;
            object-fit: contain;
            text-align: center;
            width: 74px;
        }

        .kop-text {
            text-align: center;
            vertical-align: middle;
        }

        .kop-text h1,
        .kop-text h2,
        .kop-text p {
            margin: 0;
        }

        .kop-text h1 {
            font-size: 15px;
            text-transform: uppercase;
        }

        .kop-text h2 {
            font-size: 18px;
            text-transform: uppercase;
        }

        .kop-text .address {
            font-size: 11px;
            margin-top: 3px;
        }

        .meta {
            margin: 0 auto 18px;
            text-align: center;
            width: 100%;
        }

        .meta td {
            text-align: center;
        }

        .judul {
            font-size: 15px;
            font-weight: 700;
            margin: 20px 0 4px;
            text-align: center;
            text-decoration: underline;
            text-transform: uppercase;
        }

        .nomor {
            font-size: 12px;
            margin-bottom: 24px;
            text-align: center;
        }

        .isi {
            min-height: 270px;
            text-align: justify;
            white-space: pre-line;
        }

        .signature {
            margin-left: auto;
            margin-top: 44px;
            text-align: center;
            width: 220px;
        }

        .signature-space {
            height: 72px;
        }

        .signature-name {
            font-weight: 700;
            text-decoration: underline;
        }

        .document-footer {
            bottom: -8mm;
            color: #6b7280;
            font-size: 9px;
            left: 0;
            position: fixed;
            right: 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <header>
        <table class="kop-table">
            <tr>
                <td class="kop-logo">
                    @if (file_exists($logoPath))
                        <img src="{{ $logoPath }}" alt="Logo Desa">
                    @endif
                </td>
                <td class="kop-text">
                    <h1>Pemerintah Kabupaten {{ $kabupaten }}</h1>
                    <h1>Kecamatan {{ $kecamatan }}</h1>
                    <h2>{{ $namaDesa }}</h2>
                    <p class="address">
                        {{ $alamatDesa ?: 'Alamat desa belum dikonfigurasi' }}
                        @if ($kodePos)
                            <br>Kode Pos: {{ $kodePos }}
                        @endif
                        @if ($teleponDesa)
                            <br>Telepon: {{ $teleponDesa }}
                        @endif
                        @if ($emailDesa)
                            @if (! $teleponDesa)
                                <br>
                            @endif
                            Email: {{ $emailDesa }}
                        @endif
                    </p>
                </td>
                <td class="kop-logo">&nbsp;</td>
            </tr>
        </table>
    </header>

    <main>
        <div class="judul">{{ $judul }}</div>
        <div class="nomor">Nomor: {{ $nomorSurat }}</div>
        <div class="isi">{{ $isi }}</div>
    </main>

    <footer class="signature">
        <div>{{ $namaDesa }}, {{ $tanggal }}</div>
        <div>Kepala Desa</div>
        <div class="signature-space"></div>
        <div class="signature-name">{{ $namaKepalaDesa }}</div>
        @if ($nipKepalaDesa)
            <div>NIP. {{ $nipKepalaDesa }}</div>
        @endif
    </footer>

    <div class="document-footer">
        Dokumen dicetak oleh {{ $namaAplikasi }}
    </div>
</body>
</html>
