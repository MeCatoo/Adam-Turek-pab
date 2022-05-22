export class Pracownik {
    imie: string
    nazwisko: string
    pozycja: Pozycja = Pozycja.brak

    // get Imie() { return this._imie }
    // get Nazwisko() { return this._nazwisko }
    // get Pozycja() { return this._pozycja }

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
    // set Pozycja(pozycja: Pozycja) {
    //     this._pozycja = pozycja
    // }
    constructor(pracownik: Pracownik) {
        this.imie = pracownik.imie
        this.nazwisko = pracownik.nazwisko
        this.pozycja = Pozycja[pracownik.pozycja as keyof typeof Pozycja] ?? Pozycja.brak
    }
}
export enum Pozycja {
    kierownik = "kierownik",
    kucharz = "kucharz",
    kelner = "kelner",
    brak = "brak",
    zwolniony = "zwolniony"
}