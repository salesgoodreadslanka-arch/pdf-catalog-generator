import { useState } from 'react'
import { Download, Loader2, CheckCircle, XCircle, XSquare } from 'lucide-react'
import { generateCatalog, streamProgress, downloadCatalog, cancelCatalog } from '@/lib/api'
import ProgressBar from './ProgressBar'

interface DownloadButtonProps {
    type: 'category' | 'author' | 'full'
    selectedItems: string[]
    disabled: boolean
    label: string
}

export default function DownloadButton({
    type,
    selectedItems,
    disabled,
    label
}: DownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
    const [startTime, setStartTime] = useState<number | null>(null)
    const [estimatedTime, setEstimatedTime] = useState<string | undefined>(undefined)

    const formatTime = (seconds: number): string => {
        if (!isFinite(seconds) || seconds < 0) return 'calculating...'
        if (seconds < 60) return `${Math.ceil(seconds)}s`
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.ceil(seconds % 60)
        return `${minutes}m ${remainingSeconds}s`
    }

    const handleDownload = async () => {
        try {
            setIsGenerating(true)
            setProgress(0)
            setStatus('Initializing...')
            setError(null)
            setSuccess(false)
            setCurrentTaskId(null)
            setStartTime(Date.now())
            setEstimatedTime(undefined)

            // Generate catalog
            const response = await generateCatalog({
                catalog_type: type,
                selected_items: type === 'full' ? undefined : selectedItems
            })

            setCurrentTaskId(response.task_id)

            // Stream progress updates
            const eventSource = streamProgress(response.task_id, (progressData) => {
                setProgress(progressData.progress)
                setStatus(progressData.message)

                // Calculate ETA
                if (progressData.progress > 0 && progressData.progress < 100) {
                    const elapsed = (Date.now() - (startTime || Date.now())) / 1000
                    if (elapsed > 2) { // Wait 2s for stability
                        const rate = progressData.progress / elapsed // percent per second
                        const remainingPercent = 100 - progressData.progress
                        const remainingSeconds = remainingPercent / rate
                        setEstimatedTime(formatTime(remainingSeconds))
                    }
                }

                if (progressData.status === 'complete') {
                    // Download the file
                    downloadFile(response.filename)
                } else if (progressData.status === 'error') {
                    setError(progressData.message)
                    setIsGenerating(false)
                    setCurrentTaskId(null)
                    setStartTime(null)
                } else if (progressData.status === 'cancelled') {
                    setError('Cancelled by user')
                    setIsGenerating(false)
                    setCurrentTaskId(null)
                    setStartTime(null)
                }
            })

            // Cleanup on unmount
            return () => {
                eventSource.close()
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to generate catalog')
            setIsGenerating(false)
            setCurrentTaskId(null)
            setStartTime(null)
        }
    }

    const handleCancel = async () => {
        if (!currentTaskId) return
        try {
            setStatus('Cancelling...')
            await cancelCatalog(currentTaskId)
        } catch (err) {
            console.error('Failed to cancel', err)
        }
    }

    const downloadFile = async (filename: string) => {
        try {
            setStatus('Downloading...')
            const blob = await downloadCatalog(filename)

            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            setSuccess(true)
            setStatus('Download complete!')

            // Reset after 3 seconds
            setTimeout(() => {
                setIsGenerating(false)
                setProgress(0)
                setStatus('')
                setSuccess(false)
                setCurrentTaskId(null)
            }, 3000)
        } catch (err) {
            setError('Failed to download file')
            setIsGenerating(false)
            setCurrentTaskId(null)
        }
    }

    const getButtonColor = () => {
        if (success) return 'bg-green-500 hover:bg-green-600'
        if (error) return 'bg-red-500 hover:bg-red-600'
        if (type === 'category') return 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
        if (type === 'author') return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button
                    onClick={handleDownload}
                    disabled={disabled || isGenerating}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${getButtonColor()}`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {status || 'Generating...'}
                        </>
                    ) : success ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Success!
                        </>
                    ) : error ? (
                        <>
                            <XCircle className="w-5 h-5" />
                            Try Again
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            {label}
                        </>
                    )}
                </button>

                {isGenerating && (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                        title="Cancel Generation"
                    >
                        <XSquare className="w-5 h-5" />
                    </button>
                )}
            </div>

            {isGenerating && (
                <ProgressBar progress={progress} status={status} estimatedTime={estimatedTime} />
            )}

            {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
            )}
        </div>
    )
}
