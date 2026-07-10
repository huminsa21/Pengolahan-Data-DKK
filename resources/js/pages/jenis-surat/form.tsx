import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store, update } from '@/routes/jenis-surat';
import type { JenisSurat } from './types';

type FormData = {
    kode_surat: string;
    nama_surat: string;
    template_surat: string;
    is_active: boolean;
};

export function JenisSuratForm({ jenisSurat }: { jenisSurat?: JenisSurat }) {
    const form = useForm<FormData>({
        kode_surat: jenisSurat?.kode_surat ?? '',
        nama_surat: jenisSurat?.nama_surat ?? '',
        template_surat: jenisSurat?.template_surat ?? '',
        is_active: jenisSurat?.is_active ?? true,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (jenisSurat) {
            form.put(update.url(jenisSurat.id));
            return;
        }

        form.post(store.url());
    }

    return (
        <form
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
            onSubmit={submit}
        >
            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="kode_surat">Kode Surat</Label>
                    <Input
                        id="kode_surat"
                        value={form.data.kode_surat}
                        onChange={(event) =>
                            form.setData(
                                'kode_surat',
                                event.target.value.toUpperCase(),
                            )
                        }
                    />
                    {form.errors.kode_surat && (
                        <p className="text-sm text-destructive">
                            {form.errors.kode_surat}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nama_surat">Nama Surat</Label>
                    <Input
                        id="nama_surat"
                        value={form.data.nama_surat}
                        onChange={(event) =>
                            form.setData('nama_surat', event.target.value)
                        }
                    />
                    {form.errors.nama_surat && (
                        <p className="text-sm text-destructive">
                            {form.errors.nama_surat}
                        </p>
                    )}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="template_surat">Template Surat</Label>
                    <textarea
                        id="template_surat"
                        className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={form.data.template_surat}
                        onChange={(event) =>
                            form.setData('template_surat', event.target.value)
                        }
                    />
                    {form.errors.template_surat && (
                        <p className="text-sm text-destructive">
                            {form.errors.template_surat}
                        </p>
                    )}
                </div>
                <label className="flex items-center gap-3 text-sm">
                    <Checkbox
                        checked={form.data.is_active}
                        onCheckedChange={(checked) =>
                            form.setData('is_active', checked === true)
                        }
                    />
                    Aktif
                </label>
            </div>
            <div className="mt-6 flex justify-end">
                <Button disabled={form.processing} type="submit">
                    {jenisSurat ? 'Simpan Perubahan' : 'Tambah Jenis Surat'}
                </Button>
            </div>
        </form>
    );
}
