export interface User {
    name: string
    email: string
    password: string
}

export interface Response {
    message: string
    status: "ok" | "failed" 
}