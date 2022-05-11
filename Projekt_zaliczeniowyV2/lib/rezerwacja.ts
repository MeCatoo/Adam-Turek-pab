import { Status, Stolik } from "./stolik";

export class Rezerwacja {
    private _stolik: Stolik = new Stolik("test", 1)
    private _start: Date = new Date()
    private _koniec: Date = new Date()
    private _imie: string = ""
    private _nazwisko: string = ""

    get Stolik() { return this._stolik }
    get Start() { return this._start }
    get Koniec() { return this._koniec }
    get Imie() { return this._imie }
    get Nazwisko() { return this._nazwisko }

    set Stolik(stolik: Stolik) {
        if (stolik.Status != Status.niedostepny)
            this._stolik = stolik
        else
            throw new Error("Niepoprawny stolik")
    }
    set Start(date: Date) {
        if (date > new Date(Date.now()))
            this._start = date
        else
            throw new Error("Niepoprawna data")
    }
    set Koniec(date: Date) {
        if (date > new Date(Date.now()))
            this._koniec = date
        else
            throw new Error("Niepoprawna data")
    }
    set Imie(name: string) {
        if (name.length < 50 && name.length > 0)
            this._imie = name
        else
            throw new Error("Błędna nazwa")
    }
    set Nazwisko(name: string) {
        if (name.length < 50 && name.length > 0)
            this._nazwisko = name
        else
            throw new Error("Błędna nazwa")
    }

    constructor(start: Date, end: Date, stolik: Stolik) {
        this.Start = start
        this.Koniec = end
        this.Stolik = stolik
    }
}