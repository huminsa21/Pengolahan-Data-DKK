<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ChangePasswordController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('auth/change-password');
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'password_baru' => ['required', 'string', 'min:8', 'same:konfirmasi_password'],
            'konfirmasi_password' => ['required', 'string'],
        ]);

        $request->user()->forceFill([
            'password' => Hash::make($validated['password_baru']),
            'must_change_password' => false,
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Password berhasil diganti.']);

        return to_route('dashboard');
    }
}
