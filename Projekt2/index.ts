import { Console, error } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import { Note } from './note'
import { Tag } from './tag'
import { StorageHandle } from './storageHandle'
import { User } from './user'

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
        //res.send(200).send(user.token)
    } catch (error) {
        storageHandle.Store(tmp)
    }
    if (tmp)
        res.status(200).send(tmp.token)
    else
        res.status(400).send("Katastrofalny błąd")
})

app.post('/note', function (req: Request, res: Response) {
    if (!req.headers.authorization)
        return res.status(401).send("wymagane logowanie")
    if (!storageHandle.VerifyToken(User.DecodeHeader(req.headers.authorization)))
        return res.status(401).send("wymagane logowanie")
    if (!req.body.title && req.body.content)
        return res.status(400).send("Podaj tytuł i treść notatki")
    if (req.body.tags.constructor.name !== "Array")
        return res.status(400).send("Podaj tagi jako tabelę")
    let note
    try { note = new Note(req.body.title, req.body.content, req.body.tags, storageHandle.FindUser(User.DecodeHeader(req.headers.authorization))) }
    catch (error) {
        return res.status(401).send(error)
    }
    storageHandle.Store(note)
    return res.status(200).send(note)

})

app.post('/tag',
    function (req: Request, res: Response) {
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
        try {
            storageHandle.DeleteTag
        } catch (error) {
            res.status(401).send(error)
        }
        res.status(200).send("Usunięto")
    })

app.listen(3000)

