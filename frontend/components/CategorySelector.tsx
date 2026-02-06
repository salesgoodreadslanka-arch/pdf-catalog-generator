'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
    name: string
    count: number
}

interface CategorySelectorProps {
    categories: Category[]
    selectedCategories: string[]
    onSelectionChange: (selected: string[]) => void
}

export default function CategorySelector({
    categories,
    selectedCategories,
    onSelectionChange
}: CategorySelectorProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleToggle = (categoryName: string) => {
        if (selectedCategories.includes(categoryName)) {
            onSelectionChange(selectedCategories.filter(c => c !== categoryName))
        } else {
            onSelectionChange([...selectedCategories, categoryName])
        }
    }

    const handleSelectAll = () => {
        onSelectionChange(categories.map(c => c.name))
    }

    const handleClearAll = () => {
        onSelectionChange([])
    }

    const displayedCategories = isExpanded ? filteredCategories : filteredCategories.slice(0, 5)

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-blue/40" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-brand-gray-50 border border-brand-gray-200 rounded-xl text-brand-blue placeholder-brand-blue/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-sm"
                />
            </div>

            {/* Select All / Clear All */}
            <div className="flex gap-2">
                <button
                    onClick={handleSelectAll}
                    className="flex-1 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue rounded-lg transition-colors border border-brand-blue/10"
                >
                    Select All
                </button>
                <button
                    onClick={handleClearAll}
                    className="flex-1 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-brand-red/5 hover:bg-brand-red/10 text-brand-red rounded-lg transition-colors border border-brand-red/10"
                >
                    Clear All
                </button>
            </div>

            {/* Category List */}
            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-brand-gray-200 scrollbar-track-transparent">
                {displayedCategories.map((category) => (
                    <label
                        key={category.name}
                        className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-brand-gray-50 transition-all group active:scale-[0.98]"
                    >
                        <div className="flex items-center flex-1">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => handleToggle(category.name)}
                                className="w-4 h-4 text-brand-red border-brand-gray-300 rounded focus:ring-brand-red focus:ring-offset-0"
                            />
                            <span className="ml-3 text-sm font-medium text-brand-blue/80 group-hover:text-brand-blue transition-colors">
                                {category.name}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-blue/40 bg-brand-gray-100 px-2 py-0.5 rounded-full">
                            {category.count}
                        </span>
                    </label>
                ))}
            </div>

            {/* Expand/Collapse */}
            {filteredCategories.length > 5 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-brand-blue/40 hover:text-brand-red transition-colors uppercase tracking-widest mt-2"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            View All ({filteredCategories.length})
                        </>
                    )}
                </button>
            )}
        </div>
    )
}
