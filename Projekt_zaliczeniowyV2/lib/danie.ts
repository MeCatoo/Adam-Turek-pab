export class Danie {
    Nazwa: string
    Cena: number
    Kategoria: Kategoria

    constructor(nazwa: string, cena: number, kategoria: Kategoria){
        this.Nazwa = nazwa
        this.Cena = cena
        this.Kategoria = kategoria
    }
}
export enum Kategoria{
    przystawka = "przystawka",
    zupa = "zupa",
    danie_główne = "danie_główne",
    deser = "deser",
    napoje_bezalkoholowe = "napoje_bezalkoholowe",
    napoje_alkohowe = "napoje_alkohowe"
}