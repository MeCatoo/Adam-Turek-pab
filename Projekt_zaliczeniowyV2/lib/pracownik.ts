export class Pracownik {
    private _imie: string = "TBA"
    private _nazwisko: string = "TBA"
    private _pozycja: Pozycja = Pozycja.brak

    get Imie() { return this._imie }
    get Nazwisko() { return this._nazwisko }
    get Pozycja() { return this._pozycja }

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
    set Pozycja(pozycja: Pozycja) {
        this._pozycja = pozycja
    }
    constructor(imie: string, nazwisko: string, pozyzja?: string) {
        this.Imie = imie
        this.Nazwisko = nazwisko
        switch (pozyzja) {
            case "kierownik":
                this.Pozycja = Pozycja.kierownik; break;
            case "kelner":
                this.Pozycja = Pozycja.kierownik; break;
            case "kucharz":
                this.Pozycja = Pozycja.kierownik; break;
            default:
                this.Pozycja = Pozycja.brak; break;

        }
    }
}
export enum Pozycja {
    kierownik = "kierownik",
    kucharz = "kucharz",
    kelner = "kelner",
    brak = "brak",
    zwolniony = "zwolniony"
}