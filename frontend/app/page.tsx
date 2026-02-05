'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, Download, Sparkles } from 'lucide-react'
import CategorySelector from '@/components/CategorySelector'
import AuthorSelector from '@/components/AuthorSelector'
import DownloadButton from '@/components/DownloadButton'
import { fetchCategories, fetchAuthors } from '@/lib/api'

export default function Home() {
    const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
    const [authors, setAuthors] = useState<Array<{ name: string; count: number }>>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const data = await fetchCategories()
            setCategories(data.categories)
            setAuthors(data.authors)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-12 h-12 text-yellow-400 mr-3 animate-pulse" />
                        <h1 className="text-6xl font-bold text-white">
                            PDF Catalog Generator
                        </h1>
                        <Sparkles className="w-12 h-12 text-yellow-400 ml-3 animate-pulse" />
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Generate professional PDF catalogs from your Google Sheets data with real-time progress tracking
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="glass rounded-2xl p-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
                            <p className="text-white mt-4 text-center">Loading data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                        {/* Category-wise Download */}
                        <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl mr-4">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Category-wise</h2>
                                    <p className="text-gray-400 text-sm">Select categories to include</p>
                                </div>
                            </div>

                            <CategorySelector
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onSelectionChange={setSelectedCategories}
                            />

                            <div className="mt-6">
                                <DownloadButton
                                    type="category"
                                    selectedItems={selectedCategories}
                                    disabled={selectedCategories.length === 0}
                                    label={`Download (${selectedCategories.length} selected)`}
                                />
                            </div>
                        </div>

                        {/* Author-wise Download */}
                        <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl mr-4">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Author-wise</h2>
                                    <p className="text-gray-400 text-sm">Select authors to include</p>
                                </div>
                            </div>

                            <AuthorSelector
                                authors={authors}
                                selectedAuthors={selectedAuthors}
                                onSelectionChange={setSelectedAuthors}
                            />

                            <div className="mt-6">
                                <DownloadButton
                                    type="author"
                                    selectedItems={selectedAuthors}
                                    disabled={selectedAuthors.length === 0}
                                    label={`Download (${selectedAuthors.length} selected)`}
                                />
                            </div>
                        </div>

                        {/* Full Catalog Download */}
                        <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl mr-4">
                                    <Download className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Full Catalog</h2>
                                    <p className="text-gray-400 text-sm">Download complete catalog</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 mb-6 border border-green-500/20">
                                <p className="text-white text-center mb-2">
                                    <span className="text-4xl font-bold text-gradient-blue">
                                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                                    </span>
                                </p>
                                <p className="text-gray-300 text-center text-sm">Total Products</p>
                                <p className="text-gray-400 text-center text-xs mt-2">
                                    {categories.length} Categories • {authors.length} Authors
                                </p>
                            </div>

                            <div className="mt-6">
                                <DownloadButton
                                    type="full"
                                    selectedItems={[]}
                                    disabled={false}
                                    label="Download Full Catalog"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-16 text-gray-400 text-sm animate-fade-in">
                    <p>Powered by FastAPI + Next.js • Real-time Progress Tracking</p>
                </div>
            </div>
        </main>
    )
}
