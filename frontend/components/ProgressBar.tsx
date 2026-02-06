'use client'

interface ProgressBarProps {
    progress: number
    status: string
    estimatedTime?: string
}

export default function ProgressBar({ progress, status, estimatedTime }: ProgressBarProps) {
    const getProgressColor = () => {
        if (progress < 100) return 'brand-gradient'
        return 'bg-emerald-500'
    }

    return (
        <div className="space-y-3">
            {/* Progress Bar */}
            <div className="relative w-full h-2.5 bg-brand-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full ${getProgressColor()} transition-all duration-700 ease-out relative`}
                    style={{ width: `${progress}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
            </div>

            {/* Progress Info */}
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                <div className="flex flex-col">
                    <span className="text-brand-blue/60">{status}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-brand-blue font-bold">{progress}%</span>
                    {estimatedTime && (
                        <span className="text-[10px] text-brand-red font-mono">
                            ETA: {estimatedTime}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
