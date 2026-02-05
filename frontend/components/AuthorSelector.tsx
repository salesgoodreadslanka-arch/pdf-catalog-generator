'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

interface Author {
    name: string
    count: number
}

interface AuthorSelectorProps {
    authors: Author[]
    selectedAuthors: string[]
    onSelectionChange: (selected: string[]) => void
}

export default function AuthorSelector({
    authors,
    selectedAuthors,
    onSelectionChange
}: AuthorSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleToggle = (authorName: string) => {
        if (selectedAuthors.includes(authorName)) {
            onSelectionChange(selectedAuthors.filter(a => a !== authorName))
        } else {
            onSelectionChange([...selectedAuthors, authorName])
        }
    }

    const handleSelectAll = () => {
        onSelectionChange(authors.map(a => a.name))
    }

    const handleClearAll = () => {
        onSelectionChange([])
    }

    const displayedAuthors = isExpanded ? filteredAuthors : filteredAuthors.slice(0, 5)

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Select All / Clear All */}
            <div className="flex gap-2">
                <button
                    onClick={handleSelectAll}
                    className="flex-1 px-3 py-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
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

            {/* Author List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {displayedAuthors.map((author) => (
                    <label
                        key={author.name}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center flex-1">
                            <input
                                type="checkbox"
                                checked={selectedAuthors.includes(author.name)}
                                onChange={() => handleToggle(author.name)}
                                className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-sm text-white group-hover:text-purple-300 transition-colors">
                                {author.name}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                            {author.count}
                        </span>
                    </label>
                ))}
            </div>

            {/* Expand/Collapse */}
            {filteredAuthors.length > 5 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show More ({filteredAuthors.length - 5} more)
                        </>
                    )}
                </button>
            )}
        </div>
    )
}
