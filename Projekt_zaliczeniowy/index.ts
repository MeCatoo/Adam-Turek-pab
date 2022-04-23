import { Console, error } from 'console'
import express from 'express'
import { Request, Response } from 'express'
import {IUser, User, Admin} from './Lib/UserTypes'
import {Task, TaskList, Priority} from './Lib/TastTypes'

// let asd = new Date(Date.now())
// const asd1 = new Date(Date.now())
// asd.setHours(asd.getHours()+5)
let user = new User("Jan", "haslo")
user.AddTask(new Task("Zadanko",new Date(Date.now()), Priority.Important))
console.log(user.GetCurrentTask().ToString())
const app = express()
app.use(express.json())
