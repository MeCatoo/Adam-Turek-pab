import { Pracownik } from "./pracownik";
import { Danie } from "./danie";
import { Stolik } from "./stolik";

export class Zamowienie {
    pracownik: Pracownik
    pozycje: Danie[]
    status: Status = Status.zlozone
    stolik: Stolik
    kwota: number
    readonly DataZamowineia: Date

    constructor(dania: Danie[], stolik: Stolik, pracownik?: Pracownik, kwota?: number) {
        let finalKwota = 0
        dania.forEach(element => finalKwota += element.cena)
        this.pozycje = dania
        this.kwota = kwota??finalKwota
        this.stolik = stolik
        this.pracownik = <Pracownik>pracownik
        this.DataZamowineia = new Date(Date.now())
    }
    NextStatus() {
        if (this.status == Status.rachunek)
            throw new Error("Zamówienie zakończone")
        else
            switch (this.status) {
                case Status.realizji: this.status = Status.zrealizowane
                case Status.zrealizowane: this.status = Status.rachunek
                case Status.zlozone: this.status = Status.realizji
            }
    }
    DodajDanie(danie: Danie): boolean {
        if (this.pozycje.includes(danie))
            return false
        else {
            this.pozycje.push(danie)
            return true
        }
    }
    UsunDanie(danie: Danie): boolean {
        if (this.pozycje.includes(danie)) {
            this.pozycje = this.pozycje.splice(this.pozycje.findIndex(element => element.nazwa = danie.nazwa), 1)
            return true;
        }
        else { return false }
    }
}
export enum Status {
    zlozone = 0,
    realizji = 1,
    zrealizowane = 2,
    rachunek = 3
}