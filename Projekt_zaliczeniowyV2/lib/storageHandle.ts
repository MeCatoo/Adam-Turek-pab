import { Restauracja } from "./restauracja"
import { Stolik } from "./stolik"
import { Pracownik } from "./pracownik"
import { Rezerwacja } from "./rezerwacja"
import { Danie } from "./danie"
import { Produkt } from "./produkt"
import { Zamowienie } from "./zamowienie"

export class StorageHandle {
    restauracja: Restauracja = new Restauracja("Nazwa", "Zacny adres")
    stoliki: Stolik[] = []
    pracownicy: Pracownik[] = []
    rezerwacje: Rezerwacja[] = []
    menu: Danie[] = []
    produkty: Produkt[] = []
    zamowienia: Zamowienie[] = []

    constructor() {
    }
    UpdateStorage(){}
}