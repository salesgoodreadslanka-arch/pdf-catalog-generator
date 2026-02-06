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
        <main className="min-h-screen bg-brand-gray-50 flex flex-col">
            {/* Navigation / Header */}
            <header className="glass sticky top-0 z-50 border-b border-brand-gray-200 py-4 shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="bg-brand-red p-2 rounded-lg transform group-hover:rotate-12 transition-transform shadow-md">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            <span className="text-brand-blue">Goodreads</span>
                            <span className="text-brand-red">.lk</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-blue/70">
                        <span className="hover:text-brand-red transition-colors cursor-pointer">Documentation</span>
                        <span className="hover:text-brand-red transition-colors cursor-pointer">Support</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 flex-grow">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-sm font-semibold tracking-wide uppercase">
                        <Sparkles className="w-4 h-4" />
                        <span>Professional Cataloging</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-brand-blue leading-tight tracking-tight">
                        Transform your data into <br />
                        <span className="text-brand-red">Premium Catalogs</span>
                    </h1>
                    <p className="text-lg md:text-xl text-brand-blue/60 max-w-2xl mx-auto leading-relaxed">
                        Effortlessly generate high-quality PDF catalogs from Google Sheets with real-time tracking and zero configuration.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="brand-card p-12 text-center bg-white/50">
                            <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h2 className="text-xl font-bold text-brand-blue">Synchronizing Data...</h2>
                            <p className="text-brand-blue/50 mt-2">Connecting to Google Cloud Services</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Category Selector Card */}
                        <div className="brand-card group">
                            <div className="bg-brand-blue p-6 text-white group-hover:bg-brand-blue/95 transition-colors">
                                <Users className="w-8 h-8 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold">Category Scope</h3>
                                <p className="text-white/70 text-sm mt-1">Refine by product categories</p>
                            </div>
                            <div className="p-6">
                                <CategorySelector
                                    categories={categories}
                                    selectedCategories={selectedCategories}
                                    onSelectionChange={setSelectedCategories}
                                />
                                <div className="mt-8">
                                    <DownloadButton
                                        type="category"
                                        selectedItems={selectedCategories}
                                        disabled={selectedCategories.length === 0}
                                        label={`Download Selected (${selectedCategories.length})`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Author Selector Card */}
                        <div className="brand-card group">
                            <div className="bg-brand-red p-6 text-white group-hover:bg-brand-red/95 transition-colors">
                                <Users className="w-8 h-8 mb-4 opacity-90" />
                                <h3 className="text-2xl font-bold">Author Selection</h3>
                                <p className="text-white/70 text-sm mt-1">Generate filtered by creators</p>
                            </div>
                            <div className="p-6">
                                <AuthorSelector
                                    authors={authors}
                                    selectedAuthors={selectedAuthors}
                                    onSelectionChange={setSelectedAuthors}
                                />
                                <div className="mt-8">
                                    <DownloadButton
                                        type="author"
                                        selectedItems={selectedAuthors}
                                        disabled={selectedAuthors.length === 0}
                                        label={`Download Selected (${selectedAuthors.length})`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Utility / Full Catalog Card */}
                        <div className="brand-card lg:col-span-1 md:col-span-2 group">
                            <div className="bg-brand-gray-100 p-6 text-brand-blue group-hover:bg-brand-gray-200 transition-colors">
                                <Download className="w-8 h-8 mb-4 text-brand-red" />
                                <h3 className="text-2xl font-bold">Standard Catalog</h3>
                                <p className="text-brand-blue/60 text-sm mt-1">Full inventory generation</p>
                            </div>
                            <div className="p-6 space-y-8">
                                <div className="bg-brand-gray-50 rounded-2xl p-6 border border-brand-gray-200 flex flex-col items-center justify-center min-h-[160px]">
                                    <span className="text-5xl font-black text-brand-blue mb-1">
                                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                                    </span>
                                    <span className="text-brand-blue/50 text-sm font-bold uppercase tracking-widest">Total Products</span>
                                    <div className="mt-4 flex gap-3 text-[10px] font-bold text-brand-blue/40 uppercase tracking-tighter">
                                        <span>{categories.length} Categories</span>
                                        <span>•</span>
                                        <span>{authors.length} Authors</span>
                                    </div>
                                </div>
                                <DownloadButton
                                    type="full"
                                    selectedItems={[]}
                                    disabled={false}
                                    label="Generate Full Catalog"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Footer */}
            <footer className="border-t border-brand-gray-200 bg-white py-12 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-bold text-lg">Goodreads.lk</span>
                    </div>
                    <p className="text-brand-blue/40 text-sm font-medium">
                        &copy; 2026 Goodreads.lk Professional Services. Built for performance and reliability.
                    </p>
                </div>
            </footer>
        </main>
    )
}
