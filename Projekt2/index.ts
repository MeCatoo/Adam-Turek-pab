import express from 'express'
import {Request, Response} from 'express'
import {Note} from './note'

const app = express()

const notes:Note[] = []
notes.push(
     new Note(
    {title:"req.body.title", 
      content:"req.body.title",
      createDate : "req.body.createDate",
      tags:["req.body.tags"], 
      id : Date.now()}))

app.use(express.json())

app.get('/:id', function (req: Request, res: Response) {
    const note = notes.find(function(note: Note):boolean{
        if(note.id===+req.params.id)
        {
            return true
        }
        else 
        {
            return false
        }
    })
    const jsonData = JSON.stringify(note)
  res.status(200).send(JSON.stringify(jsonData))
})
app.post('/', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  const note:Note = new Note(
      {title:req.body.title, 
        content:req.body.title,
        createDate : req.body.createDate,
        tags:req.body.tags, 
        id : Date.now()})
  res.status(200).send(JSON.stringify(note))
})

app.listen(3000)

