import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/change-password';

type ChangePasswordForm = {
    password_baru: string;
    konfirmasi_password: string;
};

export default function ChangePassword() {
    const { data, setData, put, processing, errors } =
        useForm<ChangePasswordForm>({
            password_baru: '',
            konfirmasi_password: '',
        });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        put(update.url());
    }

    return (
        <>
            <Head title="Ganti Password" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Anda wajib mengganti password default sebelum mengakses
                        aplikasi.
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_baru">Password Baru</Label>
                        <PasswordInput
                            id="password_baru"
                            name="password_baru"
                            required
                            autoFocus
                            autoComplete="new-password"
                            value={data.password_baru}
                            onChange={(event) =>
                                setData('password_baru', event.target.value)
                            }
                        />
                        <InputError message={errors.password_baru} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="konfirmasi_password">
                            Konfirmasi Password
                        </Label>
                        <PasswordInput
                            id="konfirmasi_password"
                            name="konfirmasi_password"
                            required
                            autoComplete="new-password"
                            value={data.konfirmasi_password}
                            onChange={(event) =>
                                setData(
                                    'konfirmasi_password',
                                    event.target.value,
                                )
                            }
                        />
                        <InputError message={errors.konfirmasi_password} />
                    </div>

                    <Button disabled={processing} type="submit">
                        Simpan Password Baru
                    </Button>
                </div>
            </form>
        </>
    );
}

ChangePassword.layout = {
    title: 'Ganti password default',
    description: 'Masukkan password baru untuk melanjutkan',
};
