<?php

namespace App\Exports;

class LaporanSpreadsheetExport
{
    /**
     * @param  array<int, array{key: string, label: string}>  $columns
     * @param  array<int, array<string, mixed>>  $rows
     */
    public function __construct(
        private readonly string $title,
        private readonly array $columns,
        private readonly array $rows,
    ) {}

    public function content(): string
    {
        $headerCells = collect($this->columns)
            ->map(fn (array $column): string => $this->cell($column['label'], 'Header'))
            ->implode('');

        $rows = collect($this->rows)
            ->map(function (array $row): string {
                $cells = collect($this->columns)
                    ->map(fn (array $column): string => $this->cell((string) ($row[$column['key']] ?? '')))
                    ->implode('');

                return "<Row>{$cells}</Row>";
            })
            ->implode('');

        return implode('', [
            '<?xml version="1.0"?>',
            '<?mso-application progid="Excel.Sheet"?>',
            '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
            '<Styles>',
            '<Style ss:ID="Title"><Font ss:Bold="1" ss:Size="14"/><Alignment ss:Horizontal="Center"/></Style>',
            '<Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>',
            '</Styles>',
            '<Worksheet ss:Name="'.$this->escape($this->title).'">',
            '<Table>',
            '<Row><Cell ss:MergeAcross="'.max(count($this->columns) - 1, 0).'" ss:StyleID="Title"><Data ss:Type="String">'.$this->escape($this->title).'</Data></Cell></Row>',
            '<Row/>',
            "<Row>{$headerCells}</Row>",
            $rows,
            '</Table>',
            '</Worksheet>',
            '</Workbook>',
        ]);
    }

    private function cell(string $value, ?string $style = null): string
    {
        $styleAttribute = $style ? ' ss:StyleID="'.$style.'"' : '';

        return "<Cell{$styleAttribute}><Data ss:Type=\"String\">{$this->escape($value)}</Data></Cell>";
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }
}
