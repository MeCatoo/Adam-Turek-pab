import { Console, error } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import { normalize } from 'path'
import { Note } from './note'
import { Tag } from './tag'
import { StorageHandle } from './storageHandle'
import json from 'stream/consumers'
import jwt from 'jsonwebtoken';
import { User } from './user'
import { resolveSoa } from 'dns'

const storageHandle = new StorageHandle()
const app = express()
app.use(express.json())



app.get('/note/:id', function (req: Request, res: Response) {
    if (!req.headers.authorization)
        return res.status(401).send("wymagane logowanie")
    if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization)))
        return res.status(401).send("wymagane logowanie")
    let note
    try {
        if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization ?? "123")))
            return res.status(401).send("wymagane logowanie")
        let note = storageHandle.FindNote(+req.params.id)
        if (!(note.user.token == req.headers.authorization ?? "123"))
            return res.status(401).send("wymagane logowanie")
        res.status(200).send(note)
    }
    catch (error) { res.status(404).send(error) }
})
app.get('/note', function (req: Request, res: Response) {
    if (!req.headers.authorization)
        return res.status(401).send("wymagane logowanie")
    if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization)))
        return res.status(401).send("wymagane logowanie")
    let filteredNotes = storageHandle.notes.filter(function (note: Note) {
        if ((note.user.token === req.headers.authorization))
            return true
        else
            return false
    })
    res.status(200).send(filteredNotes)
})

app.get('/tag/:id', function (req: Request, res: Response) {
    let tag
    try {
        tag = storageHandle.FindTag(+req.params.id)
    } catch (error) {
        res.status(404).send(error)
    }
    res.status(200).send(tag)
})
app.get('/tag', function (req: Request, res: Response) {
    res.status(200).send(storageHandle.tags)
})

app.post('/login', function (req: Request, res: Response) {
    if (!(req.body.login && req.body.password))
        res.status(401).send("podaj login i hasło")
    const tmp = new User(req.body.login, req.body.password)
    let user
    try {
        user = storageHandle.FindUser(tmp.token)
        res.send(200).send(user.token)
    } catch {
        storageHandle.Store(tmp)
    }
    if (tmp)
        res.status(200).send(tmp.token)
    else
        res.status(400).send("Katastrofalny błąd")
})

app.post('/note', function (req: Request, res: Response) {
    // if (!req.headers.authorization)
    //     return res.status(401).send("wymagane logowanie")
    // const user = FindUserByHeader(req.headers.authorization)
    // if (!user)
    //     return res.status(401).send("błedne dane")
    // const tagsTmp: Tag[] = [];
    // req.body.tags.forEach((element: Tag) => {
    //     tagsTmp.push(FindTagByName(element.name))
    // })
    // const date = new Date()
    // date.toISOString()

    // if (req.body.title && req.body.content) {
    //     const date = new Date()
    //     const note: Note = new Note(
    //         {
    //             title: req.body.title,
    //             content: req.body.title,
    //             createDate: date.toISOString(),
    //             tags: tagsTmp,
    //             id: Date.now(),
    //             user: user
    //         })
    //     notes.push(note)
    //     updateStorage();
    //     res.status(200).send(note)
    // }
    // else {
    //     res.status(400).send("Notatka musi zawierać tytuł i zawartość")
    // }
    if (!req.headers.authorization)
        return res.status(401).send("wymagane logowanie")
    if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization)))
        return res.status(401).send("wymagane logowanie")
    if (!req.body.title && req.body.content)
        res.status(401).send("Podaj tytuł i treść notatki")
    let note
    try { new Note(req.body.title, req.body.content, req.body.tags, storageHandle.FindUser(req.headers.authorization)) }
    catch (error) {
        res.status(401).send(error)
    }
    storageHandle.Store(note)
    res.status(200).send(note)

})

app.post('/tag',
    function (req: Request, res: Response) {
        // if (!CheckToken(req.headers.authorization))
        // return res.status(401).send("wymagane logowanie")
        if (!req.body.name)
            res.status(401).send("Podaj nazwę tagu")
        else
            res.status(400).send("Tag musi mieć nazwę")
        const tag = storageHandle.FindTag(req.body.name)
        if (tag)
            res.status(401).send("Tag już istnieje")
        else
            res.status(200).send(tag)
    })

app.put('/note/:id',
    function (req: Request, res: Response) {
        // if (!req.headers.authorization)
        //     return res.status(401).send("wymagane logowanie")
        // const user = FindUserByHeader(req.headers.authorization)
        // if (!user)
        //     return res.status(401).send("błedne dane")
        // const note = FindById(+req.params.id)
        // if (note && note.user.token === user.token) {
        //     const editedNote: Note = new Note({
        //         title: req.body.title ?? note.title,
        //         content: req.body.content ?? note.content,
        //         createDate: note.createDate,
        //         tags: req.body.tags ?? note.tags,
        //         id: note.id,
        //         user: note.user
        //     })
        //     notes.splice(FindIndexById(+req.params.id), 1, editedNote)
        //     updateStorage();
        //     res.status(200).send("OK")
        // }
        // else
        //     res.status(404).send("Nie znaleziono"
        if (!req.headers.authorization)
            return res.status(401).send("wymagane logowanie")
        if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization)))
            return res.status(401).send("wymagane logowanie")
        let note
        let editedNote
        try {
            note = storageHandle.FindNote(+req.params.id)
            editedNote = new Note(req.body.title ?? note.title, req.body.content ?? note.content, req.body.tags ?? note.tags, storageHandle.FindUser(req.headers.authorization))
        } catch (error) {
            res.status(401).send(error)
        }
        if (!note)
            return res.status(400).send("Katastrofalny błąd")
        if (!(note.user.token === req.headers.authorization))
            return res.status(401).send("wymagane logowanie")
        storageHandle.Update(editedNote, +req.params.id)
        res.status(200).send(storageHandle.FindNote(+req.params.id))
    })

app.put('/tag/:id',
    function (req: Request, res: Response) {
        // if (!CheckToken(req.headers.authorization))
        // return res.status(401).send("wymagane logowanie")
        // const tag = FindTagById(+req.params.id)
        // if (tag) {
        //     tag.name = req.body.name
        //     tags.splice(FindTagIndexById(+req.params.id), 1, tag)
        //     res.status(200).send(tag)
        // }
        // else
        //     res.status(400).send("Nie znaleziono")
        let tag
        let editedTag
        try {
            tag = storageHandle.FindTag(+req.params.id)
            editedTag = new Tag(req.body.name ?? tag.name)
        } catch (error) {
            res.status(404).send(error)
        }
        storageHandle.Update(editedTag, +req.params.id)


    })

app.delete('/note/:id',
    function (req: Request, res: Response) {
        // if (!CheckToken(req.headers.authorization))
        //     return res.status(401).send("wymagane logowanie")
        //     if (FindById(+req.params.id)) {
        //         notes.splice(FindIndexById(+req.params.id), 1)
        //         res.status(200).send("Usunięto")
        //     }
        //     else
        //         res.status(400).send("Nie znaleziono")
        if (!req.headers.authorization)
            return res.status(401).send("wymagane logowanie")
        if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization)))
            return res.status(401).send("wymagane logowanie")
        let note = storageHandle.FindNote(+req.params.id)
        if (!(note.user.token === req.headers.authorization ?? "123"))
            return res.status(401).send("wymagane logowanie")
        try {
            storageHandle.DeleteNote(+req.params.id)
        } catch (error) {
            res.status(401).send(error)
        }
        res.status(200).send("Usunięto")
    })

app.delete('/tag/:id',
    function (req: Request, res: Response) {
        // if (!CheckToken(req.headers.authorization))
        // return res.status(401).send("wymagane logowanie")
        // if (FindTagById(+req.params.id)) {
        //     tags.splice(FindTagIndexById(+req.params.id), 1)
        //     res.status(200).send("Usunięto")
        // }
        // else
        //     res.status(400).send("Nie znaleziono")
        try {
            storageHandle.DeleteTag
        } catch (error) {
            res.status(401).send(error)
        }
        res.status(200).send("Usunięto")
    })

// function FindById(id: number) {

//   const note = notes.find(function (note: Note): boolean {
//     if (note.id === id) {
//       return true
//     }
//     else {
//       return false
//     }
//   })
//   return note
// }
// function FindIndexById(id: number): number {
//     const noteIndex = notes.findIndex(function (note: Note): boolean {
//         if (note.id === id) {
//             return true
//         }
//         else {
//             return false
//         }
//     })
//     return noteIndex;
// }
// function FindTagByName(name: string): Tag {
//     const tag = tags.find(function (tag: Tag) {
//         if (tag.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
//             return true
//         }
//         else {
//             return false
//         }
//     })
//     if (tag)
//         return tag;
//     else {
//         return CreateTag(name)
//     }
// }
// function FindTagById(id: number) {
//     const tag = tags.find(function (tag: Tag) {
//         if (tag.id === id) {
//             return true
//         }
//         else {
//             return false
//         }
//     })
//     return tag;
// }
// function FindTagIndexById(id: number): number {
//     const tagIndex = tags.findIndex(function (tag: Tag) {
//         if (tag.id === id) {
//             return true
//         }
//         else {
//             return false
//         }
//     })
//     return tagIndex;
// }

// // function IsTagExists(name: string): void {
// //   const tag = FindTagByName(name)
// //   if (!tag) {
// //     tags.push(new Tag(name))
// //   }
// // }
// function CreateTag(name: string): Tag {
//     const tag = new Tag(name)
//     tags.push(tag)
//     return tag;
// }

// function CreateUser(login: string, password: string) {
//     const tmp = new User(login, password)
//     if (!FindUserByToken(tmp.token)) {
//         users.push(tmp)
//         updateStorage()
//     }
// }

// function CheckToken(token: any): boolean {
//   if (token) {

//     if (tmp[1] === "")//"eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.4GMt2k_zZryxhKgC8_HvdSZtYxyEyDa0AFIL-n60a8M")
//       return true
//     else
//       return false
//   }
//   else
//     return false
// }
app.listen(3000)

