import { Pracownik } from "./pracownik";
import { Danie } from "./danie";
import { Stolik } from "./Stolik";

export class Zamowienie{
    pracownik: Pracownik
    pozycje: Danie[]
    status: Status = Status.zlozone
    stolik: Stolik
    kwota: number

    constructor(dania: Danie[], stolik: Stolik, pracownik?: Pracownik){
        let finalKwota = 0
        dania.forEach(element => finalKwota += element.Cena)
        this.pozycje= dania
        this.kwota = finalKwota
        this.stolik = stolik
        this.pracownik = <Pracownik>pracownik
    }
    // NextStatus(){
    //     if(this.status)
    // }
}
export enum Status{
    zlozone = 0,
    realizji = 1,
    zrealizowane = 2,
    rachunek = 3
}