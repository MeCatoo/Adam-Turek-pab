import e from 'express';
import jwt from 'jsonwebtoken';
import { Note } from './note'
export class User {
    id: number
    login: string
    token: string
    admin: boolean

    constructor(login: string, password: string, admin?: string) {
        this.login = login 
        this.token = jwt.sign(login.concat(password), "123")
        if(admin == "secret123")
        this.admin = true
        else
        this.admin = false
        this.id = Date.now()
    }
    static DecodeHeader(header: string): string {
        const tmp = header.split(" ", 2)
        if (!(tmp[0] === "Bearer"))
            throw new Error("Błędna autoryzacja")
        return tmp[1]
    }
}
