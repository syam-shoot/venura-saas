import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

let showToastFn: ((msg: string) => void) | null = null;

export function toast(message: string) {
    showToastFn?.(message);
}

export function ToastProvider() {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        showToastFn = (msg: string) => {
            setMessage(msg);
            setVisible(true);
            setTimeout(() => setVisible(false), 3000);
        };
        return () => { showToastFn = null; };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-200">
                <div className="bg-emerald-500 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold">{message}</span>
            </div>
        </div>
    );
}
