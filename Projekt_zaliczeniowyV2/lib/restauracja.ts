import e from "express"
import { Danie } from "./danie"
import { Pozycja, Pracownik } from "./pracownik"
import { Stolik, Status as StolikStatus } from "./stolik"
import { Rezerwacja } from "./rezerwacja"

export class Restauracja {
    private _name: string = "TBA"
    private _adres: string = "TBA"
    private _telephone: string = "TBA"
    private _nip: string = "TBA"
    private _email: string = "TBA"
    private _www: string = "TBA"
    private _menu: Danie[] = []
    private _zatrudnieni: Pracownik[] = []
    private _stoliki: Stolik[] = []
    private _rezerwacje: Rezerwacja[] = []

    get Name() { return this._name }
    get Adres() { return this._adres }
    get Telephone() { return this._telephone }
    get Nip() { return this._nip }
    get Email() { return this._email }
    get WWW() { return this._www }

    set Name(name: string) {
        if (name.length < 50 && name.length > 0)
            this._name = name
        else
            throw new Error("Błędna nazwa")
    }
    set Adres(name: string) {
        if (name.length < 80 && name.length > 0)
            this._adres = name
        else
            throw new Error("Błędna nazwa")
    }
    set Telephone(name: string) {
        if (name.length == 9 && /^\d+$/.test(name))
            this._telephone = name
        else
            throw new Error("Błędny numer")
    }
    set Nip(name: string) {
        if (name.length < 15 && name.length > 0)
            this._nip = name
        else
            throw new Error("Błędny numer")
    }
    set Email(name: string) {
        if (name.length < 30 && name.length > 0 && name.includes('@'))
            this._email = name
        else
            throw new Error("Błędna nazwa")
    }
    set WWW(name: string) {
        if (name.length < 30 && name.length > 0 && name.includes('.'))
            this._www = name
        else
            throw new Error("Błędna nazwa")
    }

    constructor(name: string, adres: string, telephone?: string, nip?: string, email?: string, www?: string) {
        this.Name = name
        this.Adres = adres
        this.Telephone = telephone ?? "000000000"
        this.Nip = nip ?? "TBA"
        this.Email = email ?? "TBA@TBA"
        this.WWW = www ?? "TBA.TBA"
    }

    DodajDanie(danie: Danie): boolean {
        if (this._menu.find(element => element.Nazwa == danie.Nazwa))
            return false
        else {
            this._menu.push(danie)
            return true
        }
    }

    UsunDanie(danie: Danie): boolean {
        if (this._menu.find(element => element.Nazwa == danie.Nazwa)) {
            this._menu = this._menu.splice(this._menu.findIndex(element => element.Nazwa == danie.Nazwa, 1))
            return true
        }
        else {
            return false
        }
    }

    Zatrudnij(pracownik: Pracownik): boolean {
        if (this._zatrudnieni.includes(pracownik))
            return false
        else {
            this._zatrudnieni.push(pracownik)
            return true
        }
    }

    Zwolnij(pracownik: Pracownik): boolean {
        let tmp = this._zatrudnieni.find(element => element.Imie == pracownik.Imie && element.Nazwisko == pracownik.Nazwisko && element.Pozycja == pracownik.Pozycja)
        if (tmp) {
            tmp.Pozycja = Pozycja.zwolniony
            this._zatrudnieni = this._zatrudnieni.splice(this._zatrudnieni.findIndex(element => element.Imie == pracownik.Imie && element.Nazwisko == pracownik.Nazwisko && element.Pozycja == pracownik.Pozycja, tmp))
            return true
        }
        else {
            return false
        }
    }

    DodajStolik(stolik: Stolik): boolean {
        if (this._stoliki.find(element => element.Nazwa == stolik.Nazwa))
            return false
        else {
            this._stoliki.push(stolik)
            return true
        }
    }

    ZmienStatusStolika(stolik: Stolik, status: StolikStatus): boolean {
        let tmp = this._stoliki.find(element => element.Nazwa == stolik.Nazwa)
        if (tmp && tmp.Status != status) {
            tmp.Status = status
            this._stoliki = this._stoliki.splice(this._stoliki.findIndex(element => element.Nazwa == stolik.Nazwa, status))
            return true
        }
        else {
            return false
        }
    }

    UsunStolik(stolik: Stolik): boolean {
        if (this._stoliki.find(element => element.Nazwa == stolik.Nazwa)) {
            this._stoliki = this._stoliki.splice(this._stoliki.findIndex(element => element.Nazwa == stolik.Nazwa, 1))
            return true
        }
        else {
            return false
        }
    }

    DodajRezerwacje(start: Date, end: Date, iloscOsob: number) {
        let inneRezerwacje = this._rezerwacje.filter(rezerwacja => (start <= rezerwacja.Start && rezerwacja.Start<end) || (end >= rezerwacja.Koniec && rezerwacja.Koniec>start)) //inne rezerwacje w tym terminie
        let wolneStoliki = this._stoliki.filter(element => !inneRezerwacje.some(rezerwacja => rezerwacja.Stolik == element )) //wybieranie nie zajętego stolika w tym okresie czasu
        const stolik = wolneStoliki.find(stolik => stolik.IloscOsob >= iloscOsob)
        if (stolik) { 
            this._rezerwacje.push(new Rezerwacja(start, end, stolik)) 
        }
        console.log(wolneStoliki)
        //console.log(inneRezerwacje)
    }
}