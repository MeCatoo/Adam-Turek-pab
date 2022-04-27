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
    TBA = "TBA",
    Completed = "Completed"
}

class Task {
    id: number
    name: string
    description: string = ""
    createDate: Date
    startDate: Date
    hours: number
    endDate: Date
    priority: Priority
    constructor(name: string, start: Date, priority: Priority = Priority.TBA, hours: number = 1) {
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
    ToString(): string {
        return `${this.name} zaplanowane od ${this.startDate} do ${this.endDate} z priorytetem ${this.priority}`
    }
    AddDescription(description: string): void {
        if (description.length > 300)
            throw new Error("Opis jest za długi")
        this.description = description
        return
    }
}
class TaskList {
    tasks: Task[] = []
    completedTasks: Task[] = []
    owner: User
    constructor(user: User) {
        this.owner = user
    }
    AddTask(task: Task): void {
        const now = new Date(Date.now())
        if (task.startDate < now || task.endDate < now)
            throw new Error("Zadanie należy już do przeszłości")
        if (this.tasks.length === 0) {
            this.tasks.push(task)
        }
        else if (this.tasks.length === 1) {
            if (this.tasks[0].endDate < task.startDate || this.tasks[0].startDate > task.endDate)
                this.tasks.push(task)
            else
                throw new Error("Nie można wykonywac wielu zadań na raz")
        }
        else {
            if (this.tasks[this.tasks.length - 1].endDate < task.startDate) {
                this.tasks.push(task)
            }
            else if (this.tasks[0].startDate > task.endDate && task.startDate >= now) {
                this.tasks.push(task)
            }
            else {
                for (let i = this.tasks.length - 1; i > 0; i--) {
                    const after = this.tasks[i]
                    const before = this.tasks[i - 1]
                    if (before.endDate < task.startDate && after.startDate > task.endDate) {
                        this.tasks.push(task)
                        break;
                    }
                    if (i === 1)
                        throw new Error("Nie można przypisać zadania")
                }
            }
        }
        this.tasks.sort(function (a: Task, b: Task): number {
            if (a.startDate < b.startDate)
                return -1
            else if (a.startDate > b.startDate)
                return 1
            else
                return 0
        })
    }
    // AddTaskWithoutDate(task: Task, priority: Priority){
    //     if(task.priority !== Priority.TBA)
    //     throw new Error("W ten sposób można przypisać tylko zadania z priorytetem TBA")
    //     this.tasks.push(task)
    //     this.tasks.sort(function(a:Task,b:Task):number{
    //         const aIndex = Object.keys(Priority).indexOf(a.priority)
    //         const bIndex = Object.keys(Priority).indexOf(b.priority)
    //         if(aIndex>bIndex)
    //         return -1
    //         else if(aIndex<bIndex)
    //         return 1
    //         else 
    //         return 0
    //     })
    // }
    RemoveTask(date: Date) {
        const tmp = this.tasks.findIndex(element => element.startDate <= date && element.endDate >= date)
        if (!tmp)
            throw new Error("Nie odnaleziono zadania")
        this.tasks = this.tasks.splice(tmp, 1)
    }
    GetCurrentTask(): Task {
        const now = new Date(Date.now() + 100) //Delete +100 before relase
        const tmp = this.tasks.find(element => element.startDate < now && element.endDate > now)
        if (tmp)
            return tmp
        throw new Error("Brak obecnie zadań")
    }
    GetUpcomingTask(): Task {
        const index = this.tasks.indexOf(this.GetCurrentTask())
        if (index >= this.tasks.length - 1)
            throw new Error("Nie ma zaplanowanych kolejnych zadań")
        return this.tasks[index + 1]
    }
}
