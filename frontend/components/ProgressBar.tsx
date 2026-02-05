'use client'

interface ProgressBarProps {
    progress: number
    status: string
    estimatedTime?: string
}

export default function ProgressBar({ progress, status, estimatedTime }: ProgressBarProps) {
    const getProgressColor = () => {
        if (progress < 30) return 'bg-blue-500'
        if (progress < 70) return 'bg-purple-500'
        if (progress < 100) return 'bg-green-500'
        return 'bg-emerald-500'
    }

    return (
        <div className="space-y-2">
            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getProgressColor()} transition-all duration-500 ease-out relative`}
                    style={{ width: `${progress}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
            </div>

            {/* Progress Info */}
            <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                    <span className="text-gray-300">{status}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-white font-semibold">{progress}%</span>
                    {estimatedTime && (
                        <span className="text-xs text-gray-400 font-mono">
                            Est. {estimatedTime}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
