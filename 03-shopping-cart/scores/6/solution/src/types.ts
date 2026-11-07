export interface Listing {
    readonly product: Product
    quantity: number
}

export interface CartItem {
    readonly product: Product
    quantity: number
}

interface Product {
    readonly name: string
    readonly price: number
}

const PRODUCTS: Product[] = [
    {name: "Java", price: 10},
    {name: "Python", price: 8},
    {name: "React.js", price: 5}
]

export const LISTINGS = PRODUCTS.map(product => ({product: product, quantity: Math.floor(Math.random() * 10) + 1}))

export const CARTITEMS = PRODUCTS.map(product => ({product: product, quantity: 0}))