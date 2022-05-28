import { Pozycja, Pracownik } from "./lib/pracownik";
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
import jwt from 'jsonwebtoken'

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
    const now = new Date(Date.now())
    let inneRezerwacje = (await storageHandle.GetRezerwacje()).filter(rezerwacja => rezerwacja.start < now && rezerwacja.koniec > now)
    let zajeteStoliki = (await storageHandle.GetStoliki()).filter(element => inneRezerwacje.some(rezerwacja => rezerwacja.stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
    let tmpStoliki = await storageHandle.GetStoliki()
    let wolneStoliki: Stolik[] = []
    tmpStoliki.forEach(element => {
        if (!zajeteStoliki.includes(element))
            wolneStoliki.push(element)
    })
    res.status(200).send(wolneStoliki);
}))
app.get('/stoliki/wolny', (async function (req: Request, res: Response) {
    if (!req.body.iloscOsob || !req.body.date)
        return res.status(400).send("Bad request")
    const now = new Date(req.body.date)
    let inneRezerwacje = (await storageHandle.GetRezerwacje()).filter(rezerwacja => rezerwacja.start < now && rezerwacja.koniec > now)
    let zajeteStoliki = (await storageHandle.GetStoliki()).filter(element => inneRezerwacje.some(rezerwacja => rezerwacja.stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
    let tmpStoliki = await storageHandle.GetStoliki()
    let wolneStoliki: Stolik[] = []
    tmpStoliki.forEach(element => {
        if (!zajeteStoliki.includes(element))
            wolneStoliki.push(element)
    })
    const wybranyStolik = wolneStoliki.find(element => element.iloscOsob >= req.body.iloscOsob)
    res.status(200).send(wybranyStolik);
}))
app.get('/stoliki', (async function (req: Request, res: Response) {
    const now = new Date(Date.now())
    let inneRezerwacje = (await storageHandle.GetRezerwacje()).filter(rezerwacja => rezerwacja.start < now && rezerwacja.koniec > now)
    let zajeteStoliki = (await storageHandle.GetStoliki()).filter(element => inneRezerwacje.some(rezerwacja => rezerwacja.stolik == element)) //wybieranie nie zajętego stolika w tym okresie czasu
    let tmpStoliki = await storageHandle.GetStoliki()
    await tmpStoliki.forEach(element => {
        if (zajeteStoliki.includes(element))
            element.status = Status.zajety
        else if (element.status != Status.niedostepny)
            element.status = Status.wolny
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
    const stolickCheck = await storageHandle.GetStolik(req.body.nazwa)
    if (stolickCheck)
        return res.status(400).send("Stolik o takiej nazwie już istnieje")
    const stolik = new Stolik({ nazwa: req.body.nazwa, iloscOsob: req.body.iloscOsob, status: Status[req.body.status as keyof typeof Status] ?? Status.niedostepny })
    await storageHandle.PostStolik(stolik)
    res.status(200).send(stolik)
}))
app.put('/stolik/:nazwa', (async function (req: Request, res: Response) {
    const stolickCheck = await storageHandle.GetStolik(req.params.nazwa)
    if (!stolickCheck)
        return res.status(400).send("Stolik o takiej nazwie nie istnieje")
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
app.post('/danie', (async function (req: Request, res: Response) {
    if (!req.body.nazwa || !req.body.cena || !req.body.kategoria)
        return res.status(400).send("Podaj nazwę, cenę i kategorię")
    res.status(200).send(await storageHandle.PostDanie(new Danie({ nazwa: req.body.nazwa, cena: req.body.cena, kategoria: Kategoria[req.body.kategoria as keyof typeof Kategoria] ?? Kategoria.danie_główne })))
}))
app.put('/danie/:nazwa', (async function (req: Request, res: Response) {
    const danie = storageHandle.GetDanie(req.params.nazwa)
    if (!danie)
        return res.status(404).send("Nie ma dania o takiej nazwie")
    const tmp = new Danie({ nazwa: req.body.nazwa ?? undefined, cena: req.body.cena ?? undefined, kategoria: Kategoria[req.body.kategoria as keyof typeof Kategoria] ?? undefined })
    await storageHandle.UpdateDanie(req.params.nazwa, tmp)
    res.status(200).send(await storageHandle.GetDanie(req.params.nazwa))
}))
app.delete('/danie/:id', async function (req: Request, res: Response) {
    await storageHandle.DeleteDanie(req.params.id)
    res.status(200).send("Usunięto")
})
app.get('/magazyn', (async function (req: Request, res: Response) {
    const produkty = await storageHandle.GetProdukty()
    let sorted: Produkt[] = []
    if (req.body.orderBy) {
        if (req.body.orderBy == "asc") {
            sorted = produkty.sort((a, b) => a.nazwa.localeCompare(b.nazwa))
        }
        else if (req.body.orderBy == "desc") {
            sorted = produkty.sort((a, b) => b.nazwa.localeCompare(a.nazwa))
        }
        else {
            return res.status(400).send("Niepoprawne sortowanie")
        }
        res.status(200).send(sorted.slice(0, 10))
    }
    else {
        res.status(200).send(produkty.slice(0, 10))
    }
}))
app.get('/magazyn/strona/:numer', (async function (req: Request, res: Response) {
    const produkty = await storageHandle.GetProdukty()
    let sorted: Produkt[] = []
    if (req.body.orderBy) {
        if (req.body.orderBy == "asc") {
            sorted = produkty.sort((a, b) => a.nazwa.localeCompare(b.nazwa))
        }
        else if (req.body.orderBy == "desc") {
            sorted = produkty.sort((a, b) => b.nazwa.localeCompare(a.nazwa))
        }
        else {
            return res.status(400).send("Niepoprawne sortowanie")
        }
        res.status(200).send(sorted.slice(10 * (+req.params.numer), 10 * (+req.params.numer) + 10))
    }
    else {
        res.status(200).send(produkty.slice(10 * (+req.params.numer), 10 * (+req.params.numer) + 10))
    }
}))
app.get('/magazyn/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetProdukt(req.params.nazwa))
}))
// app.get('/magazyn/sortowanie/:nazwa', (async function (req: Request, res: Response) {

//     const magazyn = await storageHandle.GetProdukty()
//     const wynik = magazyn.filter(element => element.nazwa == req.params.nazwa)
//     res.status(200).send(wynik)
// }))
app.post('/magazyn', (async function (req: Request, res: Response) {
    if (!req.body.nazwa || !req.body.cena || !req.body.ilosc || !req.body.jednostkaMiary)
        return res.status(400).send("Podaj prawidłowe dane")
    const zapotrzebowanieLista = await storageHandle.GetProduktyZapotrzebowanie()
    let produkt = new Produkt({ nazwa: req.body.nazwa, cena: req.body.cena, ilosc: req.body.ilosc, jednostkaMiary: JednostkaMiary[req.body.jednostkaMiary as keyof typeof JednostkaMiary] ?? JednostkaMiary.sztuki })
    const zapotrzebowanie1 = zapotrzebowanieLista.find(element => element.nazwa == produkt.nazwa)
    //if(!zapotrzebowanie1)
    if (zapotrzebowanie1) {
        let Zapotrzebowanie = await storageHandle.GetProduktZapotrzebowanie(zapotrzebowanie1.nazwa)
        if (Zapotrzebowanie.ilosc - produkt.ilosc < 0) {
            await storageHandle.DeleteProduktZapotrzebowanie(Zapotrzebowanie.nazwa)
            await storageHandle.PostProdukt(produkt);
        }
        else {
            Zapotrzebowanie.ilosc = Zapotrzebowanie.ilosc - produkt.ilosc
            await storageHandle.UpdateProduktZapotrzebowanie(Zapotrzebowanie.nazwa, Zapotrzebowanie)
            await storageHandle.PostProdukt(produkt)
        }
        res.status(200).send(produkt)
    }
    await storageHandle.PostProdukt(produkt)
    res.status(200).send(produkt)
}))
app.put('/magazyn/:nazwa', (async function (req: Request, res: Response) {
    if (!req.body.ilosc)
        return res.status(400).send("Można zmieniać tylko ilość produktu")
    let toEdit = await storageHandle.GetProdukt(req.params.nazwa)
    if (!toEdit)
        return res.status(404).send("Nie znaleziono")
    const zapotrzebowanie = await storageHandle.GetProduktyZapotrzebowanie()
    let ioscProdukt = req.body.ilosc
    const ZapotrzebowanieCheck = zapotrzebowanie.find(element => element.nazwa == req.params.nazwa)
    if (ZapotrzebowanieCheck) {
        let zapotrzebowanieProdukt = await storageHandle.GetProduktZapotrzebowanie(ZapotrzebowanieCheck.nazwa)
        if (+zapotrzebowanieProdukt.ilosc - +ioscProdukt < 0) {
            await storageHandle.DeleteProduktZapotrzebowanie(zapotrzebowanieProdukt.nazwa)
            toEdit.ilosc = +toEdit.ilosc + +req.body.ilosc
            await storageHandle.UpdateProdukt(req.params.nazwa, toEdit);
        }
        else {
            zapotrzebowanieProdukt.ilosc = +zapotrzebowanieProdukt.ilosc - +req.body.ilosc
            toEdit.ilosc = +toEdit.ilosc + +req.body.ilosc
            await storageHandle.UpdateProduktZapotrzebowanie(zapotrzebowanieProdukt.nazwa, zapotrzebowanieProdukt)
            await storageHandle.UpdateProdukt(toEdit.nazwa, toEdit)
        }
        res.status(200).send(toEdit)
    }
    else {
        toEdit.ilosc = +toEdit.ilosc + +req.body.ilosc
        await storageHandle.UpdateProdukt(toEdit.nazwa, toEdit)
        res.status(200).send(toEdit)
    }
}))
app.delete('/magazyn/:nazwa', (async function (req: Request, res: Response) {
    await storageHandle.DeleteProdukt(req.params.nazwa)
    res.status(200).send("Usunięto")
}))
app.get('/zapotrzebowanie', (async function (req: Request, res: Response) {
    const produkty = await storageHandle.GetProduktyZapotrzebowanie()
    let sorted: Produkt[] = []
    if (req.body.orderBy) {
        if (req.body.orderBy == "asc") {
            sorted = produkty.sort((a, b) => a.nazwa.localeCompare(b.nazwa))
        }
        else if (req.body.orderBy == "desc") {
            sorted = produkty.sort((a, b) => b.nazwa.localeCompare(a.nazwa))
        }
        else {
            return res.status(400).send("Niepoprawne sortowanie")
        }
        res.status(200).send(sorted.slice(10 * (+req.params.numer), 10 * (+req.params.numer) + 10))
    }
    else {
        res.status(200).send(produkty.slice(10 * (+req.params.numer), 10 * (+req.params.numer) + 10))
    }
}))
app.get('/zapotrzebowanie/strona/:numer', (async function (req: Request, res: Response) {
    const produkty = await storageHandle.GetProduktyZapotrzebowanie()
    let sorted: Produkt[] = []
    if (req.body.orderBy) {
        if (req.body.orderBy == "asc") {
            sorted = produkty.sort((a, b) => a.nazwa.localeCompare(b.nazwa))
        }
        else if (req.body.orderBy == "desc") {
            sorted = produkty.sort((a, b) => b.nazwa.localeCompare(a.nazwa))
        }
        else {
            return res.status(400).send("Niepoprawne sortowanie")
        }
        res.status(200).send(sorted.slice(10 * (+req.params.numer), 10 * (+req.params.numer) + 10))
    }
    else {
        res.status(200).send(produkty.slice(10 * (+req.params.numer), 10 * (+req.params.numer) + 10))
    }
}))
app.get('/zapotrzebowanie/:nazwa', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetProduktZapotrzebowanie(req.params.nazwa))
}))
app.post('/zapotrzebowanie', (async function (req: Request, res: Response) {
    if (!req.body.nazwa || !req.body.cena || !req.body.ilosc || !req.body.jednostkaMiary)
        return res.status(400).send("Podaj prawidłowe dane")
    let produkt = new Produkt({ nazwa: req.body.nazwa, cena: req.body.cena, ilosc: req.body.ilosc, jednostkaMiary: JednostkaMiary[req.body.jednostkaMiary as keyof typeof JednostkaMiary] ?? JednostkaMiary.sztuki })
    await storageHandle.PostProduktZapotrzebowanie(produkt)
    res.status(200).send(produkt)
}))
app.put('/zapotrzebowanie/:nazwa', (async function (req: Request, res: Response) {
    if (!req.body.ilosc)
        return res.status(400).send("Można zmieniać tylko ilość produktu")
    let zapotrzebowanieTmp = await storageHandle.GetProduktZapotrzebowanie(req.params.nazwa)
    if (zapotrzebowanieTmp) {
        zapotrzebowanieTmp.ilosc = +zapotrzebowanieTmp + +req.params.ilosc
        await storageHandle.UpdateProdukt(req.params.nazwa, zapotrzebowanieTmp)
        res.status(200).send(zapotrzebowanieTmp)
    }
    else {
        res.status(404).send("Nie odnaleziono")
    }
}))
app.delete('/zapotrzebowanie/:nazwa', (async function (req: Request, res: Response) {
    await storageHandle.DeleteProduktZapotrzebowanie(req.params.nazwa)
    res.status(200).send("Usunięto")
}))
app.get('/pracownicy', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetPracownicy())
}))
app.get('/pracownik/:id', (async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetPracownik(req.params.id))
}))
app.post('/pracownicy', (async function (req: Request, res: Response) {
    if (!req.body.imie || !req.body.nazwisko || !req.body.pozycja)
        return res.status(400).send("Podaj prawidłowe dane")
    const pracownik = new Pracownik({ imie: req.body.imie, nazwisko: req.body.nazwisko, pozycja: Pozycja[req.body.pozycja as keyof typeof Pozycja] ?? Pozycja.kierownik })
    await storageHandle.PostPracownik(pracownik)
    res.status(200).send(pracownik)
}))
app.put('/pracownicy/:id', (async function (req: Request, res: Response) {
    const pracownikCheck = await storageHandle.GetPracownik(req.params.id)
    if (!pracownikCheck)
        return res.status(404).send("Nie odnaleziono")
    const pracownik = new Pracownik({ imie: req.body.imie ?? undefined, nazwisko: req.body.nazwisko ?? undefined, pozycja: Pozycja[req.body.pozycja as keyof typeof Pozycja] ?? undefined })
    await storageHandle.UpdatePracownik(req.params.id, pracownik)
    res.status(200).send(pracownik)
}))
app.delete('/pracownicy/:id', (async function (req: Request, res: Response) {
    await storageHandle.DeletePracownik(req.params.id)
    res.status(200).send("Usunięto")
}))
app.post('/login/:id', async function (req: Request, res: Response) {
    let pracownik: any
    try {
        pracownik = await storageHandle.GetPracownik(req.params.id)
    }
    catch (e) {
        return res.status(404).send("Nie odnaleziono")
    }
    if (!pracownik)
        return res.status(404).send("Nie odnaleziono")
    const token = jwt.sign({ id: pracownik._id }, "jwtSecret", { expiresIn: '1h' })
    res.status(200).send(token)
})
app.post('/zamowienie', async function (req: Request, res: Response) {
    if (!req.headers.authorization)
        return res.status(400).send("Zaloguj się")
    const token = req.headers.authorization.split(' ')[1]
    const decoded: any = jwt.verify(token, 'jwtSecret')
    if (!decoded)
        return res.status(400).send("Zaloguj się")
    const pracownik = await storageHandle.GetPracownik(decoded.id)
    if (!pracownik)
        return res.status(404).send("Błędny login")
    if (!req.body.stolik)
        return res.status(400).send("Podaj stolik")
    const stolik = await storageHandle.GetStolik(req.body.stolik)
    if (!stolik)
        return res.status(404).send("Nie odnaleziono stolika")
    let foundDania: Danie[] = []
    if (req.body.pozycje)
        req.body.pozycje.forEach(async (danie: string) => {
            const tmpDanie = await storageHandle.GetDanie(danie)
            if (tmpDanie)
                foundDania.push(tmpDanie)
        })
    const zamowienie = new Zamowienie(foundDania, stolik, pracownik, req.body.kwota)
    await storageHandle.PostZamowienie(zamowienie)
})
app.get('/zamowienia', async function (req: Request, res: Response) {
    res.status(200).send(await storageHandle.GetZamowienia())
})
app.get('/zamowienie/:id', async function (req: Request, res: Response) {
    const zamowienie = await storageHandle.GetZamowienie(req.params.id)
    if (!zamowienie)
        return res.status(404).send("Nie odnaleziono")
    res.status(200).send(zamowienie)
})
app.put('/zamowienie/dodaj/danie/:id', async function (req: Request, res: Response) {
    const zamowienie: any = await storageHandle.GetZamowienie(req.params.id)
    if (!zamowienie)
        return res.status(404).send("Nie odnaleziono")
    if (!req.body.danie)
        return res.status(400).send("Podaj danie")
    const danie = await storageHandle.GetDanie(req.body.danie)
    if (!danie)
        return res.status(404).send("Nie odnaleziono danie")
    const check = zamowienie.DodajDanie(danie)
    if (!check)
        return res.status(400).send("Nie można dodać danie")
    await storageHandle.UpdateZamowienie(zamowienie._id, zamowienie)
    res.status(200).send(zamowienie)
})
app.put('/zamowienie/usun/danie/:id', async function (req: Request, res: Response) {
    const zamowienie: any = await storageHandle.GetZamowienie(req.params.id)
    if (!zamowienie)
        return res.status(404).send("Nie odnaleziono")
    if (!req.body.danie)
        return res.status(400).send("Podaj danie")
    const danie = await storageHandle.GetDanie(req.body.danie)
    if (!danie)
        return res.status(404).send("Nie odnaleziono danie")
    const check = zamowienie.UsunDanie(danie)
    if (!check)
        return res.status(400).send("Nie można dodać danie")
    await storageHandle.UpdateZamowienie(zamowienie._id, zamowienie)
    res.status(200).send(zamowienie)
})
app.put('zamowienie/nastepy/status', async function (req: Request, res: Response) {
    const zamowienie: any = await storageHandle.GetZamowienie(req.params.id)
    if (!zamowienie)
        return res.status(404).send("Nie odnaleziono")
    try { zamowienie.NastepyStatus() }
    catch (e) { return res.status(400).send(e) }
    await storageHandle.UpdateZamowienie(zamowienie._id, zamowienie)
    res.status(200).send(zamowienie)
})
app.delete('/zamowienie/:id', async function (req: Request, res: Response) {
    await storageHandle.DeleteZamowienie(req.params.id)
    res.status(200).send("Usunięto")
})
app.get('raport/zamowienia/kelner/:id', async function (req: Request, res: Response) {
    const pracownik = await storageHandle.GetPracownik(req.params.id)
    if (!pracownik)
        return res.status(404).send("Nie odnaleziono")
    const zamowienia = await storageHandle.GetZamowienia()
    const raport = zamowienia.filter(element => element.pracownik == pracownik)
    res.status(200).send(raport)
})
app.get('raport/zamowienia/kelner/suma/:id', async function (req: Request, res: Response) {
    const pracownik = await storageHandle.GetPracownik(req.params.id)
    if (!pracownik)
        return res.status(404).send("Nie odnaleziono")
    const zamowienia = await storageHandle.GetZamowienia()
    const raport = zamowienia.filter(element => element.pracownik == pracownik)
    res.status(200).send(raport.length)
})
app.get('raport/zamowienia/stolik/:nazwa', async function (req: Request, res: Response) {
    const stolik = await storageHandle.GetStolik(req.params.nazwa)
    if (!stolik)
        return res.status(404).send("Nie odnaleziono")
    const zamowienia = await storageHandle.GetZamowienia()
    const raport = zamowienia.filter(element => element.stolik == stolik)
    res.status(200).send(raport)
})
app.get('raport/zamowienia/stolik/suma/:nazwa', async function (req: Request, res: Response) {
    const stolik = await storageHandle.GetStolik(req.params.nazwa)
    if (!stolik)
        return res.status(404).send("Nie odnaleziono")
    const zamowienia = await storageHandle.GetZamowienia()
    const raport = zamowienia.filter(element => element.stolik == stolik)
    res.status(200).send(raport.length)
})
app.get('raport/zamowienia/czas', async function (req: Request, res: Response) {
    if (!req.body.od == undefined || !req.body.do == undefined)
        return res.status(400).send("Podaj od i do")
    const zamowienia = await storageHandle.GetZamowienia()
    const raport = zamowienia.filter(element => element.DataZamowineia > req.body.od && element.DataZamowineia < req.body.do && element.status == S.zrealizowane)
    res.status(200).send(raport)
})
app.get('raport/zamowienia/czas/przychod', async function (req: Request, res: Response) {
    if (!req.body.od == undefined || !req.body.do == undefined)
        return res.status(400).send("Podaj od i do")
    const zamowienia = await storageHandle.GetZamowienia()
    const raport = zamowienia.filter(element => element.DataZamowineia > req.body.od && element.DataZamowineia < req.body.do && element.status == S.zrealizowane)
    let przychod = 0
    raport.forEach(element => przychod += element.kwota)
    res.status(200).send(przychod)
})



// app.get('/pracownik/:id', (async function (req: Request, res: Response){
//     const pracownikCheck = storageHandle.GetPracownik({})
//     // to do: poprawa get pracownik, mogą być o tych samych danych
//     //const token = jwt.sign(payload, secret)
// }))

//to do: tokeny dla każdego pracownika, dzięki którym przypisują się do zamówienia
//to do: sortowanie po nazwie: rosnąco i malejąco

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
// app.get('/menu', (function (req: Request, res: Response) {
//     res.status(200).send(storageHandle.menu)
// }))
// app.get('/menu/:nazwa', (function (req: Request, res: Response) {
//     const danie = storageHandle.menu.find(element => element.nazwa = req.params.nazwa)
//     if (danie)
//         return res.status(200).send(danie)
//     else
//         return res.status(404).send("Nie odnaleziono danie")
// }))
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