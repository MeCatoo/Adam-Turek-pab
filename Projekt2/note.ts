import { Tag } from './tag'
import { User } from './user'
const date = new Date()
export class Note {
    title: string
    content: string
    createDate: string
    tags: Tag[]
    id: number
    isPublic: boolean
    user: User
    constructor(title: string, content: string, tags: Tag[], user: User, isPublic?:boolean) {
        this.title = title
        this.content = content
        this.createDate = date.toISOString()
        this.tags = tags
        this.id = Date.now()
        this.isPublic = isPublic ?? false
        this.user = user
    }
}
