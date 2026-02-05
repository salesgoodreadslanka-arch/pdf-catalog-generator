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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Select All / Clear All */}
            <div className="flex gap-2">
                <button
                    onClick={handleSelectAll}
                    className="flex-1 px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                >
                    Select All
                </button>
                <button
                    onClick={handleClearAll}
                    className="flex-1 px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Category List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {displayedCategories.map((category) => (
                    <label
                        key={category.name}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center flex-1">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => handleToggle(category.name)}
                                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-white group-hover:text-blue-300 transition-colors">
                                {category.name}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                            {category.count}
                        </span>
                    </label>
                ))}
            </div>

            {/* Expand/Collapse */}
            {filteredCategories.length > 5 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show More ({filteredCategories.length - 5} more)
                        </>
                    )}
                </button>
            )}
        </div>
    )
}
