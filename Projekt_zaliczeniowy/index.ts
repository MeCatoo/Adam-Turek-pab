import { Console, error } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import {IUser, User, Admin} from './Lib/UserTypes'
import {Task, TaskList, Priority} from './Lib/TastTypes'

let user = new User("Jan", "haslo")
let task = new Task("Zadanko",new Date(9999999999999), Priority.Important,100)
user.AddTask(task)
console.log(task.ToString())
user.AddTask(new Task("Zada12nko",new Date(2222222222221), Priority.Important))
user.AddTask(new Task("Zada12nko",new Date(Date.now()), Priority.Important))
user.AddTask(new Task("Zada12nko",new Date(3333333333333), Priority.Important))
console.log( user.GetCurrentTask())
console.log(user.GetUpcomingTask())
const app = express()
app.use(express.json())
app.get('/tasks', function(req: Request, res: Response){
    let tmp:string[] = []
    user.tasks.tasks.forEach(task=>tmp.push(task.ToString() + "\n"))
    res.status(200).send(tmp)
})
app.listen(3000)