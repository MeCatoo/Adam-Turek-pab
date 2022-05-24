import { Pracownik } from "./lib/pracownik";
import { Restauracja } from "./lib/restauracja";
import { Rezerwacja } from "./lib/rezerwacja"
import { Status, Stolik } from "./lib/stolik";
import { Zamowienie, Status as S } from "./lib/zamowienie";
import { Danie, Kategoria } from "./lib/danie";
import express from 'express'
import { Request, Response } from 'express'
import { StorageHandle } from "./lib/storageHandle"
import { Console } from "console";
import { JednostkaMiary, Produkt } from "./lib/produkt";

// console.log(new Restauracja("Nazwa", "Zacny adres"))
// console.log(new Pracownik("Imie", "Nazwisko"))
// console.log(new Rezerwacja(new Stolik("nazwa",1, Status.wolny)))
// const dania = [new Danie("Paróweczki", 10, Kategoria.danie_główne)]
// console.log(new Zamowienie(dania,new Stolik("asdasd", 1), new Pracownik("Imie", "Nazwisko")))
// console.log(<S>S.zlozone)
let storageHandle = new StorageHandle()
//storageHandle.PostRezerwacja({start:new Date(), koniec:new Date(),stolik: new Stolik({nazwa:"nazwa",iloscOsob:1,status: Status.niedostepny}), imie:"req.body.imie", nazwisko:"req.body.nazwisko"})
//storageHandle.stoliki.push(new Stolik("nazwa", 1, "213"))
//console.log(storageHandle.stoliki)
// restauracja.DodajStolik(new Stolik("nazwa", 1, Status.wolny))
// restauracja.DodajRezerwacje(new Date(Date.now() + 10), new Date(Date.now() + 11111), 1)
// restauracja.DodajRezerwacje(new Date(Date.now() + 10), new Date(Date.now() + 11111), 1)
// restauracja.DodajRezerwacje(new Date(Date.now() + 11111), new Date(Date.now() + 22222), 1)
const app = express()
app.use(express.json())

app.get('/restauracja', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetRestauracja())
}))
app.put('/restauracja', (async function (req: Request, res: Response) {
    const savae = await storageHandle.UpdateRestauracja(new Restauracja({
        name: req.body.name, adres: req.body.adres,
        telephone: req.body.telephone, nip: req.body.nip, email: req.body.email, www: req.body.www
    }))
    res.status(200).send(savae);
}))
app.get('/stoliki/wolne', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetStoliki())
}))
app.get('/stoliki', (async function (req: Request, res: Response) {
    const now = new Date(Date.now())
    let inneRezerwacje = (await storageHandle.GetRezerwacje()).filter(rezerwacja => rezerwacja.start < now && rezerwacja.koniec > now)
    let zajeteStoliki = (await storageHandle.GetStoliki()).filter(element => inneRezerwacje.some(rezerwacja => rezerwacja.stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
    let tmpStoliki = await storageHandle.GetStoliki()
    await tmpStoliki.forEach(element => {
        if (zajeteStoliki.includes(element))
            element.status = Status.zajety
    })
    if (tmpStoliki)
        res.status(200).send(tmpStoliki)
    else
        res.status(404).send("Brak wolny stolików")
}))
app.get('/stolik/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetStolik(req.params.nazwa))
}))
app.post('/stolik', (async function (req: Request, res: Response) {
    if (!req.body.nazwa || !req.body.iloscOsob)
        return res.status(400).send("Podaj nazwę i ilość osób")
    const stolik = new Stolik({ nazwa: req.body.nazwa, iloscOsob: req.body.iloscOsob, status: Status[req.body.status as keyof typeof Status] ?? Status.niedostepny })
    await storageHandle.PostStolik(stolik)
    res.status(200).send(stolik)
}))
app.put('/stolik/:nazwa', (async function (req: Request, res: Response) {
    const stolik = new Stolik({ nazwa: req.body.nazwa ?? undefined, iloscOsob: req.body.iloscOsob ?? undefined, status: Status[req.body.status as keyof typeof Status] ?? undefined })
    storageHandle.UpdateStolik(req.params.nazwa, stolik)
    res.status(200).send(stolik)
}))
app.delete('/stolik/:nazwa', (async function (req: Request, res: Response) {
    await storageHandle.DeleteStolik(req.params.nazwa)
    res.status(200).send("Usunięto")
}))
app.get('/rezerwacje', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetRezerwacje())
}))
app.get('/rezerwacja/:id', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetRezerwacja(req.params.id))
}))
app.post('/rezerwacja', (async function (req: Request, res: Response) {
    if (!req.body.start || !req.body.end || !req.body.iloscOsob || !req.body.imie || !req.body.nazwisko)
        return res.status(400).send("Podaj daty i ilosc osob")
    const _rezerwacje = await storageHandle.GetRezerwacje()
    const _stoliki = await storageHandle.GetStoliki()
    let inneRezerwacje = _rezerwacje.filter(rezerwacja => (req.body.start <= rezerwacja.start && rezerwacja.start < req.body.end) || (req.body.end >= rezerwacja.koniec && rezerwacja.koniec > req.body.start)) //inne rezerwacje w tym terminie
    let wolneStoliki = _stoliki.filter(element => !inneRezerwacje.some(rezerwacja => rezerwacja.stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
    const stolik = wolneStoliki.find(stolik => stolik.iloscOsob >= req.body.iloscOsob && stolik.status != Status.niedostepny)
    if (stolik) {
        const tmp = new Rezerwacja({ start: req.body.start, koniec: req.body.end, stolik: stolik, imie: req.body.imie, nazwisko: req.body.nazwisko })
        await storageHandle.PostRezerwacja(tmp)
        return res.status(200).send(stolik)
    }
    else {
        return res.status(404).send("Brak wolnych stolików")
    }

}))
app.delete('/rezerwacja/:id', (async function (req: Request, res: Response) {
    await storageHandle.DeleteRezerwacja(req.params.id)
    res.status(200).send("Usunięto")
}))
app.get('/menu', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetMenu())
}))
app.get('/danie/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetDanie(req.params.nazwa))
}))
app.post('/danie/:nazwa', (async function (req: Request, res: Response) {
    if (!req.body.nazwa || !req.body.cena || !req.body.kategoria)
        return res.status(400).send("Podaj nazwę, cenę i kategorię")
    res.status(200).send(await storageHandle.PostDanie(new Danie({ nazwa: req.body.nazwa, cena: req.body.cena, kategoria: Kategoria[req.body.kategoria as keyof typeof Kategoria] ?? Kategoria.danie_główne })))
}))
app.put('/danie/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetDanie(req.params.nazwa))
}))
app.delete('/danie/:id', async function (req: Request, res: Response) {
    await storageHandle.DeleteDanie(req.params.id)
    res.status(200).send("Usunięto")
})
app.get('/magazyn', (async function (req: Request, res: Response) {
    res.status(200).send(await (await storageHandle.GetProdukty()).slice(0,10))
}))
app.get('/magazyn/strona/:numer', (async function (req: Request, res: Response) {
    res.status(200).send(await (await storageHandle.GetProdukty()).slice(10*(+req.params.numer),10*(+req.params.numer)+10))
}))
app.get('/magazyn/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetProdukt(req.params.nazwa))
}))
app.get('/magazyn/sortowanie/:nazwa', (async function (req: Request, res: Response) {
    
    const magazyn = await storageHandle.GetProdukty()
    const wynik = magazyn.filter(element => element.nazwa == req.params.nazwa)
    res.status(200).send(wynik)
}))
app.post('/magazyn/', (async function (req: Request, res: Response) {
    if (!req.body.nazwa || !req.body.cena || !req.body.ilosc || !req.body.jednostkaMiary)
        return res.status(400).send("Podaj prawidłowe dane")
    const zapotrzebowanie = await storageHandle.GetProduktyZapotrzebowanie()
    let produkt = new Produkt({ nazwa: req.body.nazwa, cena: req.body.cena, ilosc: req.body.ilosc, jednostkaMiary: JednostkaMiary[req.body.jednostkaMiary as keyof typeof JednostkaMiary] ?? JednostkaMiary.sztuki })
    if (zapotrzebowanie.includes(produkt)) {
        let nowyProdukt = await storageHandle.GetProduktZapotrzebowanie(zapotrzebowanie.find(element => element.nazwa == produkt.nazwa).nazwa)
        if (nowyProdukt.ilosc - produkt.ilosc < 0) {
            storageHandle.DeleteProduktZapotrzebowanie(nowyProdukt.nazwa)
            storageHandle.PostProdukt(produkt);
        }
        else {
            nowyProdukt.ilosc = nowyProdukt.ilosc - produkt.ilosc
            storageHandle.UpdateProduktZapotrzebowanie(nowyProdukt.nazwa, nowyProdukt)
            storageHandle.PostProdukt(produkt)
        }

    }
    res.status(200).send(await storageHandle.PostProdukt(produkt))
}))
app.put('/magazyn/:nazwa', (async function (req: Request, res: Response) {
    if (!req.body.ilosc)
        return res.status(400).send("Można zmieniać tylko ilość produktu")
    let toEdit = await storageHandle.GetProdukt(req.params.nazwa)
    if (!toEdit)
        return res.status(404).send("Nie znaleziono")
    const zapotrzebowanie = await storageHandle.GetProduktyZapotrzebowanie()
    let ioscProdukt = req.body.ilosc
    let zapotrzebowanieProdukt = await storageHandle.GetProduktZapotrzebowanie(zapotrzebowanie.find(element => element.nazwa == req.params.nazwa).nazwa)
    if (zapotrzebowanieProdukt) {
        if (zapotrzebowanieProdukt.ilosc - ioscProdukt < 0) {
            storageHandle.DeleteProduktZapotrzebowanie(zapotrzebowanieProdukt.nazwa)
            toEdit.ilosc = toEdit.ilosc + req.body.ilosc
            storageHandle.UpdateProdukt(req.params.nazwa, toEdit);
        }
        else {
            zapotrzebowanieProdukt.ilosc = zapotrzebowanieProdukt.ilosc - req.body.ilosc
            toEdit.ilosc = toEdit.ilosc + req.body.ilosc
            storageHandle.UpdateProduktZapotrzebowanie(zapotrzebowanieProdukt.nazwa, zapotrzebowanieProdukt)
            storageHandle.UpdateProdukt(toEdit.nazwa, toEdit)
        }

    }
    else { 
        toEdit.ilosc = toEdit.ilosc + req.body.ilosc
        res.status(200).send(await storageHandle.UpdateProdukt(toEdit.nazwa,toEdit)) 
    }
}))
app.delete('/magazyn/:nazwa', (async function (req: Request, res: Response) {
    await storageHandle.DeleteProdukt(req.params.nazwa)
    res.status(200).send("Usunięto")
}))
app.get('/zapotrzebowanie', (async function (req: Request, res: Response) {
    res.status(200).send(await (await storageHandle.GetProduktyZapotrzebowanie()).slice(0,10))
}))
app.get('/zapotrzebowanie/strona/:numer', (async function (req: Request, res: Response) {
    res.status(200).send(await (await storageHandle.GetProduktyZapotrzebowanie()).slice(10*(+req.params.numer),10*(+req.params.numer)+10))
}))
app.get('/zapotrzebowanie/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetProduktZapotrzebowanie(req.params.nazwa))
}))
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
// app.get('/stoliki', (function (req: Request, res: Response) {
//     const now = new Date(Date.now())
//     let inneRezerwacje = storageHandle.rezerwacje.filter(rezerwacja => rezerwacja.Start < now && rezerwacja.Koniec > now)
//     let zajeteStoliki = storageHandle.stoliki.filter(element => inneRezerwacje.some(rezerwacja => rezerwacja.Stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
//     let tmpStoliki = storageHandle.stoliki
//     tmpStoliki.forEach(element => {
//         if (zajeteStoliki.includes(element))
//             element.Status = Status.zajety
//     })
//     res.status(200).send(tmpStoliki)
// }))

// app.get('/stolik/:name', (function (req: Request, res: Response) {
//     const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa = req.params.name)
//     if (stolik)
//         res.status(200).send(stolik)
//     else
//         res.status(404).send("Nie odnalezniono stolika")
// }))
// app.post('/stolik', (function (req: Request, res: Response) {
//     if (!req.body.name)
//         return res.status(400).send("Podaj nazwę stolika")
//     const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa == req.body.name)
//     if (stolik)
//         return res.status(400).send("Stolik już istnieje")
//     else if (req.body.iloscOsob) {
//         const utworzonyStolik = new Stolik(req.body.name, +req.body.iloscOsob, req.body.status ?? "")
//         storageHandle.stoliki.push(utworzonyStolik)
//         storageHandle.UpdateStorage()
//         return res.status(200).send(utworzonyStolik)
//     }
// }))
// app.put('/stolik/:name', (function (req: Request, res: Response) {
//     const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa === req.params.name)
//     const stolikIndex = storageHandle.stoliki.findIndex(stolik => stolik.Nazwa === req.params.name)
//     if (stolik) {
//         let toEditStolik = storageHandle.stoliki[stolikIndex]
//         if (req.body.name) {
//             if (storageHandle.stoliki.find(stolik => stolik.Nazwa == req.body.name))
//                 return res.status(400).send("Stolik z taką nazwą już istnieje")
//             toEditStolik.Nazwa = req.body.name
//         }
//         if (req.body.iloscOsob)
//             toEditStolik.IloscOsob = req.body.iloscOsob
//         if (req.body.status)
//             toEditStolik.Status = Status[req.body.status as keyof typeof Status]
//         storageHandle.stoliki.splice(stolikIndex, 1, toEditStolik)
//         storageHandle.UpdateStorage()
//         return res.status(200).send(toEditStolik)
//     }
//     else
//         res.status(404).send("Nie odnalezniono stolika")
// }))
// app.delete('/stolik/:name', (function (req: Request, res: Response) {
//     const stolik = storageHandle.stoliki.find(stolik => stolik.Nazwa = req.params.name)
//     if (stolik) {
//         storageHandle.stoliki.slice(storageHandle.stoliki.findIndex(stolik => stolik.Nazwa = req.params.name), 1)
//         res.status(200).send(stolik)
//     }
//     else
//         res.status(404).send("Nie odnalezniono stolika")
// }))
app.get('/menu', (function (req: Request, res: Response) {
    res.status(200).send(storageHandle.menu)
}))
app.get('/menu/:nazwa', (function (req: Request, res: Response) {
    const danie = storageHandle.menu.find(element => element.nazwa = req.params.nazwa)
    if (danie)
        return res.status(200).send(danie)
    else
        return res.status(404).send("Nie odnaleziono danie")
}))
// app.post('/menu', function (req: Request, res: Response) {
//     let danie: Danie;
//     if (req.body.nazwa && req.body.cena && req.body.kategoria) {
//         if ((Object.values(Kategoria).includes(req.body.kategoria))) {
//             danie = new Danie(req.body.nazwa, req.body.cena, req.body.kategoria)
//             storageHandle.menu.push(danie)
//             res.status(200).send(danie)
//         }
//         else
//             res.status(400).send("Błędna kategoria")
//     }
//     else {
//         res.status(400).send("Niepoprawne dane")
//     }
// })
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


app.listen(3000)