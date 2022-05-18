export class Danie {
    Nazwa: string
    Cena: number
    Kategoria: Kategoria

    constructor(nazwa: string, cena: number, kategoria: string){
        this.Nazwa = nazwa
        this.Cena = cena
        this.Kategoria = Kategoria[kategoria as keyof typeof Kategoria] ?? Kategoria.danie_główne
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