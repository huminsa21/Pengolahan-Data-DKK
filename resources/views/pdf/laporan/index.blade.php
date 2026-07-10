<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        @page {
            margin: 24px 28px;
        }

        body {
            color: #111827;
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.45;
        }

        .letterhead {
            border-bottom: 3px double #111827;
            margin-bottom: 18px;
            padding-bottom: 12px;
            width: 100%;
        }

        .letterhead-logo {
            width: 78px;
        }

        .letterhead-title {
            font-size: 15px;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
        }

        .letterhead-village {
            font-size: 17px;
            font-weight: 700;
            text-align: center;
            text-transform: uppercase;
        }

        .letterhead-meta {
            font-size: 10px;
            text-align: center;
        }

        .report-title {
            font-size: 15px;
            font-weight: 700;
            margin: 10px 0 2px;
            text-align: center;
            text-transform: uppercase;
        }

        .report-meta {
            margin: 12px 0 14px;
            width: 100%;
        }

        .report-meta td {
            padding: 2px 0;
            vertical-align: top;
        }

        table.data {
            border-collapse: collapse;
            width: 100%;
        }

        table.data th,
        table.data td {
            border: 1px solid #d1d5db;
            padding: 6px;
            vertical-align: top;
        }

        table.data th {
            background: #d1fae5;
            font-weight: 700;
            text-align: left;
        }

        .footer {
            color: #6b7280;
            font-size: 9px;
            margin-top: 16px;
            text-align: center;
        }
    </style>
</head>
<body>
    <table class="letterhead">
        <tr>
            <td class="letterhead-logo">
                @if ($profilDesa->logoPublicPath() && file_exists($profilDesa->logoPublicPath()))
                    <img src="{{ $profilDesa->logoPublicPath() }}" style="width: 68px; height: 68px; object-fit: contain;" alt="Logo">
                @endif
            </td>
            <td>
                <div class="letterhead-title">Pemerintah Kabupaten {{ $profilDesa->kabupaten }}</div>
                <div class="letterhead-title">Kecamatan {{ $profilDesa->kecamatan }}</div>
                <div class="letterhead-village">{{ $profilDesa->nama_desa }}</div>
                <div class="letterhead-meta">
                    {{ $profilDesa->alamat ?: 'Alamat kantor desa' }}
                    @if ($profilDesa->kode_pos)
                        , Kode Pos {{ $profilDesa->kode_pos }}
                    @endif
                </div>
                <div class="letterhead-meta">
                    @if ($profilDesa->telepon)
                        Telp. {{ $profilDesa->telepon }}
                    @endif
                    @if ($profilDesa->email)
                        {{ $profilDesa->telepon ? ' | ' : '' }}Email {{ $profilDesa->email }}
                    @endif
                </div>
            </td>
            <td class="letterhead-logo">&nbsp;</td>
        </tr>
    </table>

    <div class="report-title">{{ $title }}</div>

    <table class="report-meta">
        <tr>
            <td style="width: 18%;">Periode</td>
            <td style="width: 32%;">:
                {{ $filters['date_from'] ?: 'Awal' }} s/d {{ $filters['date_to'] ?: 'Akhir' }}
            </td>
            <td style="width: 18%;">Tanggal Cetak</td>
            <td>: {{ $printedAt }}</td>
        </tr>
        <tr>
            <td>Filter Status</td>
            <td>: {{ $filters['status'] ?: 'Semua' }}</td>
            <td>Dicetak Oleh</td>
            <td>: {{ $printedBy }}</td>
        </tr>
        <tr>
            <td>Search</td>
            <td colspan="3">: {{ $filters['search'] ?: '-' }}</td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th style="width: 28px;">No</th>
                @foreach ($columns as $column)
                    <th>{{ $column['label'] }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $index => $row)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    @foreach ($columns as $column)
                        <td>{{ $row[$column['key']] ?? '-' }}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($columns) + 1 }}" style="text-align: center;">Tidak ada data.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dokumen dicetak oleh Sistem Informasi Kependudukan Desa
    </div>
</body>
</html>
