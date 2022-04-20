import { Console } from 'console';
import fs from 'fs';
import { Note } from './note'
import { Tag } from './tag'
import { User } from './user'

export class StorageHandle {

    private _notes: Note[] = [];
    private _tags: Tag[] = [];
    private _users: User[] = [];
    private storeFile = "Storage.json"

    constructor() {
        this.readStorage()
    }
    get notes(): Note[] {
        return this._notes;
    }
    get tags(): Tag[] {
        return this._tags
    }
    get users(): User[] {
        return this._users
    }

    Store(stored: any) {
        switch (stored.constructor.name) {
            case "User":
                this._users.push(stored)
                this.updateStorage();
                break;
            case "Tag":
                this._tags.push(stored)
                this.updateStorage();
                break;
            case "Note":
                let tmpTags:Tag[] = []
                stored.tags.forEach((tag: Tag) => tmpTags.push(this.FindTag(String(tag.name))))
                stored.tags = tmpTags
                this._notes.push(stored)
                this.updateStorage();
                break;
            default:
                throw new Error("Nieobsługiwany typ")
        }
    }

    FindNote(id: number): Note {
        const note = this._notes.find(function (note: Note): boolean {
            if (note.id === id) {
                return true
            }
            else {
                return false
            }
        })
        if (note)
            return note
        else
            throw new Error("Nie odnaleziono notatki")
    }
    FindTag(searchParameter: any): Tag {
        let tag;
        if (searchParameter.constructor.name === "Number") {
            tag = this._tags.find(function (tag: Tag): boolean {
                if (tag.id === searchParameter) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (searchParameter.constructor.name === "String") {
            tag = this._tags.find(function (tag: Tag): boolean {
                if (tag.name.toLowerCase() === searchParameter.toLowerCase()) {
                    return true
                }
                else {
                    return false
                }
            })
            if (!tag) {
                tag = new Tag(searchParameter)
                this.Store(tag)
            }
        }
        else
            throw new Error("Błędny parametr")
        if (tag) {
            return tag
        }
        else
            throw new Error("Nie odnaleziono tagu")
    }
    FindUser(id: any): User {
        let user
        switch (id.constructor.name) {
            case "number":
                user = this._users.find(function (user: User): boolean {
                    if (user.id === id) {
                        return true
                    }
                    else {
                        return false
                    }
                })
                break;
            case "String":
                user = this._users.find(function (user: User): boolean {
                    if (user.token === id) {
                        return true
                    }
                    else {
                        return false
                    }
                })
        }
        if (user)
            return user
        else
            throw new Error("Nie znalezniono użytkownika")
    }
    private FinddNotesIndex(id: number): number {
        const note = this._notes.findIndex(function (note: Note): boolean {
            if (note.id === id) {
                return true
            }
            else {
                return false
            }
        })
        if (note)
            return note
        else
            throw new Error()
    }
    private FindTagsIndex(id: number): number {
        const tag = this._tags.findIndex(function (tag: Tag): boolean {
            if (tag.id === id) {
                return true
            }
            else {
                return false
            }
        })
        if (tag)
            return tag
        else
            throw new Error()
    }
    private FindUsersIndex(id: number): number {
        const user = this._users.findIndex(function (user: User): boolean {
            if (user.id === id) {
                return true
            }
            else {
                return false
            }
        })
        if (user)
            return user
        else
            throw new Error("Nie znalezniono użytkownika")
    }

    DeleteUser(id: number) {
        this._users.splice(this.FindUsersIndex(id), 1)
        this.updateStorage()
    }
    DeleteNote(id: number) {
        this._notes.splice(this.FinddNotesIndex(id), 1)
        this.updateStorage()
    }
    DeleteTag(id: number) {
        this._tags.splice(this.FindTagsIndex(id), 1)
        this.updateStorage()
    }

    Update(edited: any, id: number) {
        if (!edited)
            throw new Error()
        switch (edited) {
            case edited.constructor.name === "Note":
                if (!this.FindNote(id))
                    throw new Error()
                const tmpNote = this.FindNote(id)
                tmpNote.title = edited.title ?? tmpNote.title,
                    tmpNote.content = edited.content ?? tmpNote.content,
                    tmpNote.createDate = edited.createDate,
                    tmpNote.tags = edited.tags ?? tmpNote.tags,
                    this._notes.splice(this.FinddNotesIndex(tmpNote.id), 1, tmpNote)
                break;
            case edited.constructor.name === "Tag":
                if (!this.FindTag(id))
                    throw new Error()
                const tmpTag = this.FindTag(id)
                tmpTag.name = edited.name ?? tmpTag.name
                this._tags.splice(this.FindTagsIndex(tmpTag.id), 1, tmpTag)
                break;
            default:
                throw new Error()
        }
    }
    IsTagExist(name: string): boolean {
        const tag = this._tags.find(function (tag: Tag): boolean {
            if (tag.name.toLowerCase() === name.toLowerCase()) {
                return true
            }
            else {
                return false
            }
        })
        if (tag)
            return true
        else
            return false
    }
    VerifyToken(token: string): boolean {
        try {
            this.FindUser(token)
        } catch (error) {
            return false
        }
        return true
    }

    private async updateStorage(): Promise<void> {
        const tmp = [this._notes, this._tags, this._users]

        console.log(JSON.stringify(tmp))
        try {
            await fs.promises.writeFile(this.storeFile, JSON.stringify(tmp));
        } catch (err) {
            console.log(err)
        }
    }
    private async readStorage(): Promise<void> {
        try {
            const data = await fs.promises.readFile(this.storeFile, 'utf-8');
            this._notes = this.Decode(JSON.parse(data)[0])
            this._tags = this.Decode(JSON.parse(data)[1])
            this._users = this.Decode(JSON.parse(data)[2])
            return
        } catch (err) {
            console.log(err)
        }
    }
    private Decode<Type>(arg: Type[]): Type[] {
        let tmp: Type[] = [];
        arg.forEach(element => tmp.push(element))
        return tmp;
    }
}