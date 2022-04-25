import { Console, error } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import {IUser, User, Admin} from './Lib/UserTypes'
import {Task, TaskList, Priority} from './Lib/TastTypes'

// let asd = new Date(Date.now())
// const asd1 = new Date(Date.now())
// asd.setHours(asd.getHours()+5)
let user = new User("Jan", "haslo")
let task = new Task("Zadanko",new Date(9999999999999), Priority.Important,100)
user.AddTask(task)
console.log(task.ToString())
//console.log(new Date(9999999999999))
//user.RemoveTask(new Date(Date.now()+10000001))
//console.log(task)
user.AddTask(new Task("Zada12nko",new Date(2222222222221), Priority.Important))
user.AddTask(new Task("Zada12nko",new Date(Date.now()), Priority.Important))
user.AddTask(new Task("Zada12nko",new Date(3333333333333), Priority.Important))
console.log(user.tasks.tasks)
//window.setTimeout()
console.log( user.GetCurrentTask())
const app = express()
app.use(express.json())
