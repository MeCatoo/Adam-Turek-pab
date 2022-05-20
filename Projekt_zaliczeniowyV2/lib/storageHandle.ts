import { Restauracja } from "./restauracja"
import { Stolik } from "./stolik"
import { Pracownik } from "./pracownik"
import { Rezerwacja } from "./rezerwacja"
import { Danie } from "./danie"
import { Produkt } from "./produkt"
import { Zamowienie } from "./zamowienie"
import { stolikModel, restauracjaModel, rezerwacjaModel, mongoose } from "../configDB"
import { Mode } from "fs"

export class StorageHandle {
    restauracja?: Restauracja
    stoliki: Stolik[] = []
    pracownicy: Pracownik[] = []
    rezerwacje: Rezerwacja[] = []
    menu: Danie[] = []
    produkty: Produkt[] = []
    zamowienia: Zamowienie[] = []

    constructor() {
        
    }


    async UpdateStorage() {

    }
    async ReadStorage() {
        const data = await stolikModel.findOne({}).exec()
        //const stolik = <Stolik>data[0]
        // console.log(data.toObject().constructor.name)
    }

    async GetRestauracja():Promise<Restauracja> {
        const save = new Restauracja(await restauracjaModel.findOne({}).exec())
        //console.log(new Restauracja(save))
        return save
        
    }
    async UpdateRestauracja(restauracja: Restauracja) {
        const newRestauracja = new restauracjaModel(await restauracjaModel.findOne({}).exec())
        
        if (restauracja.name)
            newRestauracja.name = restauracja.name
        if (restauracja.adres)
            newRestauracja.adres = restauracja.adres
        if (restauracja.telephone)
            newRestauracja.telephone = restauracja.telephone
        if (restauracja.nip)
            newRestauracja.nip = restauracja.nip
        if (restauracja.email)
            newRestauracja.email = restauracja.email
        if (restauracja.www)
            newRestauracja.www = restauracja.www
        return await newRestauracja.save()
    }
    async GetStoliki(): Promise<Stolik[]>{
        const tmp: Stolik[] = []
        const save = await stolikModel.find({}).exec()
        console.log(save)
        save.forEach((element:Stolik) => tmp.push(new Stolik(element)));
        return tmp
    }
    async GetStolik(nazwa: string): Promise<Stolik>{
        const data = await stolikModel.findOne({nazwa: nazwa}).exec()
        return new Stolik(data)
    }
    async GetRezerwacje(): Promise<Rezerwacja[]>{
        const tmp: Rezerwacja[] = []
        const save = await rezerwacjaModel.find({}).exec()
        save.forEach((element:Rezerwacja) => tmp.push(new Rezerwacja(element)));
        return tmp
    }
    async PostRezerwacja(rezerwacja: Rezerwacja){
        //const newRezerwacja = new rezerwacjaModel({stolik: rezerwacja.stolik._id, start: rezerwacja.start, koniec: rezerwacja.koniec, imie: rezerwacja.imie, nazwisko: rezerwacja.nazwisko})
        const newRezerwacja = new rezerwacjaModel(rezerwacja)
        //console.log(newRezerwacja)
        newRezerwacja.save()
    }
}