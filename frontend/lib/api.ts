import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface CategoryData {
    name: string
    count: number
}

export interface AuthorData {
    name: string
    count: number
}

export interface SheetData {
    categories: CategoryData[]
    authors: AuthorData[]
    total_products: number
}

export interface CatalogRequest {
    catalog_type: 'category' | 'author' | 'full'
    selected_items?: string[]
}

export interface CatalogResponse {
    success: boolean
    task_id: string
    filename: string
    download_url: string
}

export interface ProgressData {
    progress: number
    status: string
    message: string
    file_path?: string
}

export const fetchCategories = async (): Promise<SheetData> => {
    const response = await axios.get(`${API_URL}/api/data`)
    return response.data.data
}

export const fetchAuthors = async (): Promise<SheetData> => {
    const response = await axios.get(`${API_URL}/api/data`)
    return response.data.data
}

export const generateCatalog = async (request: CatalogRequest): Promise<CatalogResponse> => {
    const response = await axios.post(`${API_URL}/api/catalog/generate`, request)
    return response.data
}

export const getProgress = async (taskId: string): Promise<ProgressData> => {
    const response = await axios.get(`${API_URL}/api/catalog/progress/${taskId}`)
    return response.data
}

export const cancelCatalog = async (taskId: string): Promise<void> => {
    await axios.post(`${API_URL}/api/catalog/cancel/${taskId}`)
}

export const downloadCatalog = async (filename: string): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/api/catalog/download/${filename}`, {
        responseType: 'blob'
    })
    return response.data
}

export const streamProgress = (taskId: string, onProgress: (data: ProgressData) => void) => {
    const eventSource = new EventSource(`${API_URL}/api/catalog/stream/${taskId}`)

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        onProgress(data)

        if (data.status === 'complete' || data.status === 'error') {
            eventSource.close()
        }
    }

    eventSource.onerror = () => {
        eventSource.close()
    }

    return eventSource
}
