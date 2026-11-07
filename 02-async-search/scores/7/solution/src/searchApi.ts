export interface Item {
    id: number
    name: string
}

const DATA: Item[] = [
    'React', 'React Router', 'Redux', 'Vue', 'Vite', 'Vitest', 'TypeScript',
    'JavaScript', 'Node.js', 'Next.js', 'Angular', 'Svelte', 'Webpack', 'ESLint',
    'Prettier', 'Tailwind CSS', 'Zustand', 'GraphQL',
].map((name, idx) => ({
    id: idx + 1,
    name: name
}))

export const searchItems = (keyword: string): Promise<Item[]> => {
    const delay = 300 + Math.random() * 900
    return new Promise((resolve) => {
        const k = keyword.trim().toLowerCase()
        setTimeout(() => {
            resolve(DATA.filter((item) => item.name.toLowerCase().includes(k)))
        }, delay)
    })
}