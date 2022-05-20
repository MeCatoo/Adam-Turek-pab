import { Status, Stolik } from "./stolik";

export class Rezerwacja {
    stolik: Stolik// = new Stolik("test", 1)
    start: Date// = new Date()
    koniec: Date //= new Date()
    imie: string //= ""
    nazwisko: string //= ""

    // get Stolik() { return this._stolik }
    // get Start() { return this._start }
    // get Koniec() { return this._koniec }
    // get Imie() { return this._imie }
    // get Nazwisko() { return this._nazwisko }

    // set Stolik(stolik: Stolik) {
    //     if (stolik.Status != Status.niedostepny)
    //         this._stolik = stolik
    //     else
    //         throw new Error("Niepoprawny stolik")
    // }
    // set Start(date: Date) {
    //     if (date > new Date(Date.now()))
    //         this._start = date
    //     else
    //         throw new Error("Niepoprawna data")
    // }
    // set Koniec(date: Date) {
    //     if (date > new Date(Date.now()))
    //         this._koniec = date
    //     else
    //         throw new Error("Niepoprawna data")
    // }
    // set Imie(name: string) {
    //     if (name.length < 50 && name.length > 0)
    //         this._imie = name
    //     else
    //         throw new Error("Błędna nazwa")
    // }
    // set Nazwisko(name: string) {
    //     if (name.length < 50 && name.length > 0)
    //         this._nazwisko = name
    //     else
    //         throw new Error("Błędna nazwa")
    // }

    //     constructor(start: Date, end: Date, stolik: Stolik) {
    //         this.Start = start
    //         this.Koniec = end
    //         this.Stolik = stolik
    //     }
    constructor(rezerwacja: Rezerwacja) {
        this.stolik = rezerwacja.stolik
        this.start = rezerwacja.start
        this.koniec = rezerwacja.koniec
        this.imie = rezerwacja.imie
        this.nazwisko = rezerwacja.nazwisko
    }
}