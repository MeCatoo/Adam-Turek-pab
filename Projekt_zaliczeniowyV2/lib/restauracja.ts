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
    // private _menu: Danie[] = []
    // private _zatrudnieni: Pracownik[] = []
    // private _stoliki: Stolik[] = []
    // private _rezerwacje: Rezerwacja[] = []

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

   
}