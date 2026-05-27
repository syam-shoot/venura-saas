export function VenuraLogo({ className = 'h-8 w-8' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle */}
            <rect width="40" height="40" rx="12" fill="url(#venura-gradient)" />
            {/* V shape representing venue/arena */}
            <path d="M12 12L20 28L28 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Arena arc */}
            <path d="M10 30C10 30 15 26 20 26C25 26 30 30 30 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            {/* Dot - ball */}
            <circle cx="20" cy="18" r="2.5" fill="white" opacity="0.9" />
            <defs>
                <linearGradient id="venura-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10b981" />
                    <stop offset="1" stopColor="#059669" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function VenuraLogoFull({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <VenuraLogo />
            <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">Venura</span>
                <span className="hidden sm:block text-[9px] text-slate-400 -mt-0.5 tracking-wider uppercase">Venue & Arena Booking</span>
            </div>
        </div>
    );
}
