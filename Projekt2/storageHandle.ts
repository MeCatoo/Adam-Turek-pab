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
        //this.readStorage()
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
        if (searchParameter.constructor.name === "number") {
            tag = this._tags.find(function (tag: Tag): boolean {
                if (tag.id === searchParameter) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else if (searchParameter.constructor.name === "string") {
            tag = this._tags.find(function (tag: Tag): boolean {
                if (tag.name.toLowerCase() === searchParameter.toLowerCase()) {
                    return true
                }
                else {
                    return false
                }
            })
            if (!tag) {
                tag = this.Store(new Tag(searchParameter))
            }
        }
        else
            throw new Error("Błędny parametr")
        if (tag)
            return tag
        else
            throw new Error("Nie odnaleziono tagu")
    }
    FindUser(id: any): User {
        let user
        switch (id) {
            case id.constructor.name === "number":
                user = this._users.find(function (user: User): boolean {
                    if (user.id === id) {
                        return true
                    }
                    else {
                        return false
                    }
                })
                break;
            case id.constructor.name === "string":
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
    FinddNotesIndex(id: number): number {
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
    FindTagsIndex(id: number): number {
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
    FindUsersIndex(id: number): number {
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
        this._notes.splice(this.FindUsersIndex(id), 1)
        this.updateStorage()
    }
    DeleteTag(id: number) {
        this._notes.splice(this.FindUsersIndex(id), 1)
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
    VerifyToken(token:string): boolean{
        try {
            this.FindUser(token)
        } catch (error) {
            return false
        }
        return true
    }

    private async updateStorage(): Promise<void> {
        const tmp = [this._notes, this._tags, this._users]
        try {
            await fs.promises.writeFile(this.storeFile, JSON.stringify(tmp));
        } catch (err) {
            console.log(err)
        }
    }
    private async readStorage(): Promise<void> {
        try {
            const data = await fs.promises.readFile(this.storeFile, 'utf-8');
            this._notes = JSON.parse(data).notes
            this._tags = JSON.parse(data).tags
            this._users = JSON.parse(data).users
            return
        } catch (err) {
            console.log(err)
        }
    }
}