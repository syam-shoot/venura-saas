<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TenantVerifiedNotification extends Notification
{
    use Queueable;

    public function __construct(public Tenant $tenant) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Venue Kamu Telah Diverifikasi! 🎉')
            ->greeting("Halo {$notifiable->name}!")
            ->line("Selamat! Venue **{$this->tenant->name}** telah diverifikasi oleh tim Venura.")
            ->line('Kamu sekarang bisa login dan mulai menerima booking dari pelanggan.')
            ->action('Login ke Dashboard', url("/{$this->tenant->slug}/admin"))
            ->line('Terima kasih telah bergabung dengan Venura!');
    }
}
