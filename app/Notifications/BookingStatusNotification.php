<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingStatusNotification extends Notification
{
    use Queueable;

    public function __construct(public Booking $booking, public string $status) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $msg = (new MailMessage)
            ->subject("Booking {$this->status} - {$this->booking->tenant->name}")
            ->greeting("Halo {$notifiable->name},");

        if ($this->status === 'approved') {
            $msg->line("Booking Anda telah DISETUJUI.")
                ->line("Lapangan: {$this->booking->court->name}")
                ->line("Tanggal: {$this->booking->date->format('d M Y')}")
                ->line("Waktu: {$this->booking->start_time} - {$this->booking->end_time}");
        } else {
            $msg->line("Maaf, booking Anda telah DITOLAK.")
                ->line("Lapangan: {$this->booking->court->name}")
                ->line("Tanggal: {$this->booking->date->format('d M Y')}");
        }

        return $msg->line('Terima kasih telah menggunakan layanan kami.');
    }
}
