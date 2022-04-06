import jwt from 'jsonwebtoken';
export class User{
    id: number
    token: string

    constructor(login:string, password: string){
        this.token = jwt.sign(login.concat(password),"123")
        this.id = Date.now()
    }
}
