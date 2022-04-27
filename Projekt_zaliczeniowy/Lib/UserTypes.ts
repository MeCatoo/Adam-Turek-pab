export { IUser, User, Admin, Instytucja }
import { Task, TaskList } from './TastTypes'

interface IUser {
    id: number
    login: string
    password: string
    createDate: Date
}
class User implements IUser {
    id: number
    createDate: Date
    login: string;
    password: string;
    tasks: TaskList
    constructor(login: string, password: string) {
        this.login = login
        this.password = password
        const date = new Date()
        this.createDate = new Date(Date.now())
        this.tasks = new TaskList(this);
        this.id = Date.now()
    }
    AddTask(task: Task) {
        this.tasks.AddTask(task);
        console.log(`Dodano nowe zadanie dla ${this.login}`)
    }
    GetCurrentTask(): string {
        return "Obecne zadanie to: " + this.tasks.GetCurrentTask().ToString()
    }
    GetUpcomingTask(): string {
        return "Kolejne zadanie to: " + this.tasks.GetUpcomingTask().ToString()
    }
    RemoveTask(date: Date) {
        this.tasks.RemoveTask(date)
    }
}
class Admin implements IUser {
    id: number
    createDate: Date
    login: string;
    password: string;
    constructor(login: string, password: string) {
        this.login = login
        this.password = password
        const date = new Date()
        this.createDate = new Date(Date.now())
        this.id = Date.now()
    }
}
class Instytucja {
    name: string
    createDate: Date
    owner: IUser
    employees: User[] = []
    constructor(name: string, owner: IUser) {
        this.name = name
        const date = new Date()
        this.createDate = new Date(Date.now())
        this.owner = owner
    }

    AddEmployee(employee: User) {
        if (this.employees.includes(employee))
            throw new Error("Ten pracownik jest już dodadny");
        this.employees.push(employee)
    }
    GetEmployeesTasks(): string[] {
        let tasks: string[] = []
        this.employees.forEach(employee => tasks.push(employee.GetCurrentTask()))
        return tasks
    }

}