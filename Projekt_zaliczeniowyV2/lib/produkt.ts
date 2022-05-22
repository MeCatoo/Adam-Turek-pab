export class Produkt {
    nazwa: string = ""
    cena: number = 0
    ilosc: number = 0
    jednostkaMiary: JednostkaMiary

    // get Nazwa() { return this._nazwa }
    // get Cena() { return this._cena }
    // get Ilosc() { return this._ilosc }
    // get jednostkaMiary() { return this._jednostkaMiary }

    // set Nazwa(name: string) {
    //     if (name.length < 50 && name.length > 0)
    //         this._nazwa = name
    //     else
    //         throw new Error("Błędna nazwa")
    // }
    // set Cena(name: number) {
    //     if (name < 9999 && name >= 0)
    //         this._cena = name
    //     else
    //         throw new Error("Błędna cena")
    // }
    // set Ilosc(name: number) {
    //     if (name < 99999 && name >= 0)
    //         this._ilosc = name
    //     else
    //         throw new Error("Błędna cena")
    // }
    // constructor(nazwa: string, jednostkaMiary: JednostkaMiary, cena: number, ilosc: number = 0) {
    //     this.nazwa = nazwa
    //     this.cena = cena
    //     this.jednostkaMiary = jednostkaMiary
    //     this.ilosc = ilosc
    // }
    constructor(produkt: Produkt) {
        this.nazwa = produkt.nazwa
        this.cena = produkt.cena
        this.jednostkaMiary = produkt.jednostkaMiary
        this.ilosc = produkt.ilosc
    }

}
export enum JednostkaMiary {
    kg = "kg",
    sztuki = "sztuki"
}