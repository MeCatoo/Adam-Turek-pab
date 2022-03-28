import { Console } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import { normalize } from 'path'
import { Note } from './note'
import { Tag } from './tag'
import fs from 'fs';
import { json } from 'stream/consumers'

const app = express()
const storeFile = "Storage.json"
let notes: Note[] = []
let tags: Tag[] = [];
readStorage();
// const tag1 = new Tag("tag test1")
// const tag2 = new Tag("tag test3")
// const tag3 = new Tag("tag test24")
// tags.push(tag1, tag2, tag3)
// notes.push(
//   new Note(
//     {
//       title: "test",
//       content: "test",
//       createDate: "test",
//       tags: [tag1, tag2, tag3],
//       id: 1
//     }))
app.use(express.json())

app.get('/note/:id', function (req: Request, res: Response) {
  const note = FindById(+req.params.id)
  note ?? res.send(404)
  res.status(200).send(note)
})
app.get('/note', function (req: Request, res: Response) {
  res.status(200).send(notes)
})

app.get('/tag/:id', function (req: Request, res: Response) {
  const tag = FindTagById(+req.params.id)
  tag ?? res.send(404)
  res.status(200).send(tag)
})
app.get('/tag', function (req: Request, res: Response) {
  res.status(200).send(tags)
})

app.post('/note', function (req: Request, res: Response) {

  const tagsTmp: Tag[] = [];
  req.body.tags.forEach((element: Tag) => {
    tagsTmp.push(FindTagByName(element.name))

  })
  if (req.body.title && req.body.content) {
    const date = new Date()
    const note: Note = new Note(
      {
        title: req.body.title,
        content: req.body.title,
        createDate: date.toISOString(),
        tags: tagsTmp,
        id: Date.now()
      })
    notes.push(note)
    updateStorage();
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
function FindTagByName(name: string): Tag {
  const tag = tags.find(function (tag: Tag) {
    if (tag.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
      return true
    }
    else {
      return false
    }
  })
  if (tag)
    return tag;
  else {
    return CreateTag(name)
  }
}
function FindTagById(id: number) {
  const tag = tags.find(function (tag: Tag) {
    if (tag.id === id) {
      return true
    }
    else {
      return false
    }
  })
  return tag;
}
// function IsTagExists(name: string): void {
//   const tag = FindTagByName(name)
//   if (!tag) {
//     tags.push(new Tag(name))
//   }
// }
function CreateTag(name: string): Tag {
  const tag = new Tag(name)
  tags.push(tag)
  return tag;
}
async function updateStorage(): Promise<void> {
  const tmp = {notes, tags}
  const dataToSave = JSON.stringify(tmp);
  try {
      await fs.promises.writeFile(storeFile, dataToSave);
  } catch (err) {
      console.log(err)
  }
}
 async function readStorage(): Promise<void> {
  try {
      const data = await fs.promises.readFile(storeFile, 'utf-8');
      notes = JSON.parse(data).notes
      tags = JSON.parse(data).tags
  } catch (err) {
      console.log(err)
  }
}
app.listen(3000)

