import { IUser, User, Admin } from './UserTypes'
export { TaskList, Task, Priority }
// interface Task{
//     id:number
//     createDate: Date
//     startDate: Date
//     endDate: Date
// }
enum Priority {
    Critical = "Critical",
    Important = "Important",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Canceled = "Canceled",
    TBA = "TBA"
}

class Task {
    id: number
    name:String
    createDate: Date
    startDate: Date
    hours: number
    endDate: Date
    priority: Priority
    constructor(name:string, start: Date, priority: Priority = Priority.TBA, hours: number = 1) {
        if (hours < 1)
            throw new Error("Zadanie musi trwać przynajmniej godzinę")
        this.name = name
        this.createDate = new Date(Date.now())
        this.startDate = start
        this.hours = hours
        this.id = Date.now()
        const tmp = new Date(start)
        tmp.setHours(start.getHours() + hours)
        this.endDate = tmp
        this.priority = priority
    }
    ToString() {
        return `${this.name} zaplanowane od ${this.startDate} do ${this.endDate} z priorytetem ${this.priority}`
    }
}
// class Break implements Task{
//     id:number
//     createDate: Date
//     startDate: Date
//     endDate: Date
//     constructor(task:Task){
//         this.createDate = new Date(Date.now())
//         this.startDate = start
//         this.endDate = end ?? null
//     }
// }

class TaskList {
    tasks: Task[] = []
    completedTasks: Task[] = []
    owner: User
    constructor(user: User) {
        this.owner = user
    }
    AddTask(task: Task): void {
        const now = new Date(Date.now())
        if(task.startDate<now || task.endDate<now)
        throw new Error("Zadanie należy już do przeszłości")
        if (this.tasks.length === 0) {
            this.tasks.push(task)
            return
        }
        const end = this.tasks[this.tasks.length - 1].endDate
        
        if (end > task.endDate)
            throw new Error("Nie można wykonywać wielu zadań jednocześnie")
        if (now > end)
            task.endDate = now
        if (now > task.startDate)
            task.startDate = now
        this.tasks.push(task)
    }
    GetCurrntTask(): Task {
        const now = new Date(Date.now())
        const tmp = this.tasks.find(element => element.startDate < now && element.endDate > now)
        if (tmp)
            return tmp
        throw new Error("Brak obecnie zadań")
    }
}
