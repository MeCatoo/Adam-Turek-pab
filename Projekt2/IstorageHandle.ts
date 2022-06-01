import { Console } from 'console';
import fs from 'fs';
import { Note } from './note'
import { Tag } from './tag'
import { User } from './user'

export interface IStorageHandle {



    Store(stored: any):any;

    FindNote(id: number): Note 
    FindTag(searchParameter: any): Tag 
    FindUser(id: any): User 

    DeleteUser(id: number) :void
    DeleteNote(id: number) :void
    DeleteTag(id: number) :void

    Update(edited: any, id: number) :void
    IsTagExist(name: string): boolean  
    VerifyToken(token: string): boolean 
}