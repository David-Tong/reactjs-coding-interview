import { useEffect, useState } from "react"
import { searchItems, type Item } from "./searchApi"

export const useAsyncSearch = (keyword: string) => {
    const [results, setResults] = useState<Item[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const k = keyword.trim()
        if (k === "") {
            setResults([])
            setLoading(false)
            return
        }

        // will abord the previous search result
        let cancelled = false
        setLoading(true)
        searchItems(k).then((data) => {
            if (cancelled) return
            setResults(data)
            setLoading(false)
        })

        // clean up function
        return () => {
            cancelled = true
        }
    }, [keyword])

    return {results, loading}
}
