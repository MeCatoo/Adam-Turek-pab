export class Danie {
    Nazwa: string
    Cena: number
    Kategoria: Kategoria

    constructor(danie: Danie){
        this.Nazwa = danie.Nazwa
        this.Cena = danie.Cena
        this.Kategoria = danie.Kategoria
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