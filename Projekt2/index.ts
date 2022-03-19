import { Console } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import { normalize } from 'path'
import { Note } from './note'

const app = express()

const notes: Note[] = []
notes.push(
  new Note(
    {
      title: "test",
      content: "test",
      createDate: "test",
      tags: ["test"],
      id: 1
    }))

app.use(express.json())

app.get('/note/:id', function (req: Request, res: Response) {
  const note = FindById(+req.params.id)
  note ?? res.send(404)
  res.status(200).send(note)
})

app.post('/note', function (req: Request, res: Response) {
  if (req.body.title && req.body.content) {
    const date = new Date()
    const note: Note = new Note(
      {
        title: req.body.title,
        content: req.body.title,
        createDate: date.toISOString(),
        tags: req.body.tags,
        id: Date.now()
      })
    notes.push(note)
    res.status(200).send(note)
  }
  else {
    res.status(400).send("Notatka musi zawierać tytuł i zawartość")
  }
})

app.put('/note/:id',
  function (req: Request, res: Response) {
    const note = FindById(+req.params.id)
    if (note) {
      const editedNote: Note = new Note({
        title: req.body.title ?? note.title,
        content: req.body.content ?? note.content,
        createDate: note.createDate,
        tags: req.body.tags ?? note.tags,
        id: note.id
      })
      notes.splice(FindIndexById(+req.params.id), 1, editedNote)
      res.status(200).send("OK")
    }
    else
      res.status(404).send("Nie znaleziono")
  })
app.delete('/note/:id',
  function (req: Request, res: Response) {
    if (FindById(+req.params.id)) {
      notes.splice(FindIndexById(+req.params.id), 1)
      res.status(200).send("Usunięto")
    }
    else
      res.status(400).send("Nie znaleziono")
  }
)




function FindById(id: number) {
  const note = notes.find(function (note: Note): boolean {
    if (note.id === id) {
      return true
    }
    else {
      return false
    }
  })
  return note
}
function FindIndexById(id: number): number {
  const noteIndex = notes.findIndex(function (note: Note): boolean {
    if (note.id === id) {
      return true
    }
    else {
      return false
    }
  })
  return noteIndex;
}

app.listen(3000)

