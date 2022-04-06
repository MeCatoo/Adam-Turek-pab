import {Tag} from './tag'
import { User } from './user'

export class Note{
    title:string 
    content:string
    createDate:string
    tags:Tag[]
    id:number
    user: User
    constructor(note:Note){
        this.title=note.title
        this.content=note.content
        this.createDate=note.createDate
        this.tags=note.tags
        this.id=note.id
        this.user=note.user
    }
}
