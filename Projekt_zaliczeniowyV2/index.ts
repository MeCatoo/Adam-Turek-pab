import { Pracownik } from "./lib/pracownik";
import { Restauracja } from "./lib/restauracja";
import { Rezerwacja } from "./lib/rezerwacja"
import { Status, Stolik } from "./lib/stolik";
import { Zamowienie, Status as S } from "./lib/zamowienie";
import { Danie, Kategoria } from "./lib/danie";
import express from 'express'
import { Request, Response } from 'express'
import { StorageHandle } from "./lib/storageHandle"

// console.log(new Restauracja("Nazwa", "Zacny adres"))
// console.log(new Pracownik("Imie", "Nazwisko"))
// console.log(new Rezerwacja(new Stolik("nazwa",1, Status.wolny)))
// const dania = [new Danie("Paróweczki", 10, Kategoria.danie_główne)]
// console.log(new Zamowienie(dania,new Stolik("asdasd", 1), new Pracownik("Imie", "Nazwisko")))
// console.log(<S>S.zlozone)
let storageHandle = new StorageHandle()
storageHandle.stoliki.push(new Stolik("nazwa", 1, "213"))
console.log(storageHandle.stoliki)
// restauracja.DodajStolik(new Stolik("nazwa", 1, Status.wolny))
// restauracja.DodajRezerwacje(new Date(Date.now() + 10), new Date(Date.now() + 11111), 1)
// restauracja.DodajRezerwacje(new Date(Date.now() + 10), new Date(Date.now() + 11111), 1)
// restauracja.DodajRezerwacje(new Date(Date.now() + 11111), new Date(Date.now() + 22222), 1)
const app = express()
app.use(express.json())

app.get('/restauracja', (function (req: Request, res: Response) {
    res.status(200).send(storageHandle.restauracja)
}))
app.put('/restauracja', (function (req: Request, res: Response) {
    if (req.body.name)
        storageHandle.restauracja.Name = req.body.name
    if (req.body.adres)
        storageHandle.restauracja.Adres = req.body.adres
    if (req.body.telephone)
        storageHandle.restauracja.Telephone = req.body.telephone
    if (req.body.nip)
        storageHandle.restauracja.Nip = req.body.nip
    if (req.body.email)
        storageHandle.restauracja.Email = req.body.email
    if (req.body.www)
        storageHandle.restauracja.WWW = req.body.www
    if (req.body.telephone)
        storageHandle.restauracja.Telephone = req.body.telephone
    if (req.body.telephone)
        storageHandle.restauracja.Telephone = req.body.telephone
    storageHandle.UpdateStorage()
    res.status(200).send(storageHandle.restauracja);
}))
app.get('/stoliki', (function (req: Request, res: Response) {
    const now = new Date(Date.now())
    let inneRezerwacje = storageHandle.rezerwacje.filter(rezerwacja => rezerwacja.Start < now && rezerwacja.Koniec > now)
    let zajeteStoliki = storageHandle.stoliki.filter(element => inneRezerwacje.some(rezerwacja => rezerwacja.Stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
    let tmpStoliki = storageHandle.stoliki
    tmpStoliki.forEach(element => {
        if (zajeteStoliki.includes(element))
            element.Status = Status.zajety
    })
    res.status(200).send(tmpStoliki)
}))

app.get('/stolik/:name', (function (req: Request, res: Response) {
    const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa = req.params.name)
    if (stolik)
        res.status(200).send(stolik)
    else
        res.status(404).send("Nie odnalezniono stolika")
}))
app.post('/stolik', (function (req: Request, res: Response) {
    if (!req.body.name)
        return res.status(400).send("Podaj nazwę stolika")
    const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa == req.body.name)
    if (stolik)
        return res.status(400).send("Stolik już istnieje")
    else if (req.body.iloscOsob) {
        const utworzonyStolik = new Stolik(req.body.name, +req.body.iloscOsob, req.body.status ?? "")
        storageHandle.stoliki.push(utworzonyStolik)
        storageHandle.UpdateStorage()
        return res.status(200).send(utworzonyStolik)
    }
}))
app.put('/stolik/:name', (function (req: Request, res: Response) {
    const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa === req.params.name)
    const stolikIndex = storageHandle.stoliki.findIndex(stolik => stolik.Nazwa === req.params.name)
    if (stolik) {
        let toEditStolik = storageHandle.stoliki[stolikIndex]
        if (req.body.name) {
            if (storageHandle.stoliki.find(stolik => stolik.Nazwa == req.body.name))
                return res.status(400).send("Stolik z taką nazwą już istnieje")
            toEditStolik.Nazwa = req.body.name
        }
        if (req.body.iloscOsob)
            toEditStolik.IloscOsob = req.body.iloscOsob
        if (req.body.status)
            toEditStolik.Status = Status[req.body.status as keyof typeof Status]
        storageHandle.stoliki.splice(stolikIndex, 1, toEditStolik)
        storageHandle.UpdateStorage()
        return res.status(200).send(toEditStolik)
    }
    else
        res.status(404).send("Nie odnalezniono stolika")
}))
app.delete('/stolik/:name', (function (req: Request, res: Response) {
    const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa = req.params.name)
    if (stolik) {
        storageHandle.stoliki.slice(storageHandle.stoliki.findIndex(stolik => stolik.Nazwa = req.params.name), 1)
        res.status(200).send(stolik)
    }
    else
        res.status(404).send("Nie odnalezniono stolika")
}))
app.get('/menu', (function (req: Request, res: Response) {
    res.status(200).send(storageHandle.menu)
}))
app.get('/menu/:nazwa', (function (req: Request, res: Response) {
    const danie = storageHandle.menu.find(element => element.Nazwa = req.params.nazwa)
    if (danie)
        return res.status(200).send(danie)
    else
        return res.status(404).send("Nie odnaleziono danie")
}))
app.post('/menu', function (req: Request, res: Response) {
    let danie: Danie;
    if (req.body.nazwa && req.body.cena && req.body.kategoria) {
        if ((Object.values(Kategoria).includes(req.body.kategoria))) {
            danie = new Danie(req.body.nazwa, req.body.cena, req.body.kategoria)
            storageHandle.menu.push(danie)
            res.status(200).send(danie)
        }
        else
            res.status(400).send("Błędna kategoria")
    }
    else {
        res.status(400).send("Niepoprawne dane")
    }
})
// app.put('/menu/:nazwa', function (req: Request, res: Response){
//     const danie = storageHandle.
// })

// DodajDanie(danie: Danie): boolean {
//     if (this._menu.find(element => element.Nazwa == danie.Nazwa))
//         return false
//     else {
//         this._menu.push(danie)
//         return true
//     }
// }

// UsunDanie(danie: Danie): boolean {
//     if (this._menu.find(element => element.Nazwa == danie.Nazwa)) {
//         this._menu = this._menu.splice(this._menu.findIndex(element => element.Nazwa == danie.Nazwa, 1))
//         return true
//     }
//     else {
//         return false
//     }
// }

// Zatrudnij(pracownik: Pracownik): boolean {
//     if (this._zatrudnieni.includes(pracownik))
//         return false
//     else {
//         this._zatrudnieni.push(pracownik)
//         return true
//     }
// }

// Zwolnij(pracownik: Pracownik): boolean {
//     let tmp = this._zatrudnieni.find(element => element.Imie == pracownik.Imie && element.Nazwisko == pracownik.Nazwisko && element.Pozycja == pracownik.Pozycja)
//     if (tmp) {
//         tmp.Pozycja = Pozycja.zwolniony
//         this._zatrudnieni = this._zatrudnieni.splice(this._zatrudnieni.findIndex(element => element.Imie == pracownik.Imie && element.Nazwisko == pracownik.Nazwisko && element.Pozycja == pracownik.Pozycja, tmp))
//         return true
//     }
//     else {
//         return false
//     }
// }

// DodajStolik(stolik: Stolik): boolean {
//     if (this._stoliki.find(element => element.Nazwa == stolik.Nazwa))
//         return false
//     else {
//         this._stoliki.push(stolik)
//         return true
//     }
// }

// ZmienStatusStolika(stolik: Stolik, status: StolikStatus): boolean {
//     let tmp = this._stoliki.find(element => element.Nazwa == stolik.Nazwa)
//     if (tmp && tmp.Status != status) {
//         tmp.Status = status
//         this._stoliki = this._stoliki.splice(this._stoliki.findIndex(element => element.Nazwa == stolik.Nazwa, status))
//         return true
//     }
//     else {
//         return false
//     }
// }

// UsunStolik(stolik: Stolik): boolean {
//     if (this._stoliki.find(element => element.Nazwa == stolik.Nazwa)) {
//         this._stoliki = this._stoliki.splice(this._stoliki.findIndex(element => element.Nazwa == stolik.Nazwa, 1))
//         return true
//     }
//     else {
//         return false
//     }
// }

// DodajRezerwacje(start: Date, end: Date, iloscOsob: number) {
//     let inneRezerwacje = this._rezerwacje.filter(rezerwacja => (start <= rezerwacja.Start && rezerwacja.Start<end) || (end >= rezerwacja.Koniec && rezerwacja.Koniec>start)) //inne rezerwacje w tym terminie
//     let wolneStoliki = this._stoliki.filter(element => !inneRezerwacje.some(rezerwacja => rezerwacja.Stolik == element )) //wybieranie nie zajętego stolika w tym okresie czasu
//     const stolik = wolneStoliki.find(stolik => stolik.IloscOsob >= iloscOsob)
//     if (stolik) { 
//         this._rezerwacje.push(new Rezerwacja(start, end, stolik)) 
//     }
//     console.log(wolneStoliki)
//     //console.log(inneRezerwacje)
// }

app.listen(3000)