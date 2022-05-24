import { Restauracja } from "./restauracja"
import { Stolik } from "./stolik"
import { Pracownik } from "./pracownik"
import { Rezerwacja } from "./rezerwacja"
import { Danie } from "./danie"
import { Produkt } from "./produkt"
import { Zamowienie } from "./zamowienie"
import { stolikModel, restauracjaModel, rezerwacjaModel, danieModel, pracownikModel, zamoweienieModel, produktModel, produktZapotrzebowanieModel } from "../configDB"
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

    async GetRestauracja(): Promise<Restauracja> {
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
    async GetStoliki(): Promise<Stolik[]> {
        const tmp: Stolik[] = []
        const save = await stolikModel.find({}).exec()
        console.log(save)
        save.forEach((element: Stolik) => tmp.push(new Stolik(element)));
        return tmp
    }
    async GetStolik(nazwa: string): Promise<Stolik> {
        const data = await stolikModel.findOne({ nazwa: nazwa }).exec()
        return new Stolik(data)
    }
    async PostStolik(stolik: Stolik) {
        const newStolik = await new stolikModel(stolik)
        newStolik.save()
    }
    async DeleteStolik(Nazwa: string) {
        await stolikModel.deleteOne({ nazwa: Nazwa })
    }
    async UpdateStolik(nazwa: string, edited: Stolik) {
        await stolikModel.findOneAndUpdate({ nazwa: nazwa }, edited)
    }
    async GetRezerwacja(id: string): Promise<Rezerwacja> {
        const data = await rezerwacjaModel.findOne({ _id: id }).exec()
        return new Rezerwacja(data)
    }
    async GetRezerwacje(): Promise<Rezerwacja[]> {
        let tmp: Rezerwacja[] = []
        const save = await rezerwacjaModel.find({}).exec()
        await save.forEach((element: Rezerwacja) => {
            // element.stolik = new Stolik(stolikModel.findOne({_id: element.stolik._id }).exec())
            // console.log(element.stolik._id)
            tmp.push(new Rezerwacja(element))
        });
        //await tmp.forEach(element => element.stolik = new Stolik( stolikModel.findOne({_id:element.stolik._id})))
        return tmp
    }
    async PostRezerwacja(rezerwacja: Rezerwacja) {
        //const newRezerwacja = new rezerwacjaModel({stolik: rezerwacja.stolik._id, start: rezerwacja.start, koniec: rezerwacja.koniec, imie: rezerwacja.imie, nazwisko: rezerwacja.nazwisko})
        const newRezerwacja = await new rezerwacjaModel(rezerwacja)
        //console.log(newRezerwacja)
        await newRezerwacja.save()
    }
    async DeleteRezerwacja(id: string) {
        await rezerwacjaModel.deleteOne({ _id: id }).exec()
    }
    async GetMenu(): Promise<Danie[]> {
        let tmp: Danie[] = []
        const newDanie = await new danieModel.find().exec()
        newDanie.forEach((element: Danie) => tmp.push(new Danie(element)))
        return tmp
    }
    async GetDanie(nazwa: string): Promise<Danie> {
        const newDanie = await new danieModel.findOne({ nazwa: nazwa }).exec()
        return new Danie(newDanie)
    }
    async PostDanie(danie: Danie) {
        const newDanie = await new danieModel(danie)
        newDanie.save()
    }
    async DeleteDanie(nazwa: string) {
        await danieModel.deleteOne({ nazwa: nazwa }).exec()
    }
    async GetPracownicy(): Promise<Pracownik[]> {
        return await pracownikModel.find().exec()
    }
    async GetPracownik(imie: string, nazwisko: string): Promise<Pracownik> {
        return await pracownikModel.findOne({ imie: imie, nazwisko: nazwisko }).exec()
    }
    async PostPracownik(pracownik: Pracownik) {
        const newPracownik = pracownikModel(pracownik)
        await newPracownik.save()
    }
    async UpdatePracownik(imie: string, nazwisko: string, pracownik: Pracownik) {
        await pracownikModel.findOneAndUpdate({ imie: imie, nazwisko: nazwisko }, pracownik)
    }
    async DeletePracownik(imie: string, nazwisko: string) {
        await pracownikModel.deleteOne({ imie: imie, nazwisko: nazwisko })
    }
    async GetZamowienia(): Promise<Zamowienie[]> {
        return await zamoweienieModel.find().exec()
    }
    async GetZamowienie(id: string): Promise<Zamowienie> {
        return await zamoweienieModel.findOne({ _id: id }).exec()
    }
    async PostZamowienie(zamowienie: Zamowienie) {
        const newZamowienie = new zamoweienieModel(zamowienie)
        await newZamowienie.save()
    }
    async UpdateZamowienie(id: string, zamowienie: Zamowienie) {
        await zamoweienieModel.findOneAndUpdate({ _id: id }, zamowienie)
    }
    async DeleteZamowienie(id: string) {
        await zamoweienieModel.deleteOne({ _id: id })
    }
    async GetProdukty(): Promise<Produkt[]> {
        return await produktModel.find().exec()
    }
    async GetProdukt(nazwa: string): Promise<Produkt> {
        return await produktModel.findOne({ nazwa: nazwa }).exec()
    }
    async PostProdukt(produkt: Produkt) {
        const newProdukt = new produktModel(produkt)
        await newProdukt.save()
    }
    async UpdateProdukt(nazwa: string, produkt: Produkt) {
        await produktModel.findOneAndUpdate({ nazwa: nazwa }, produkt)
    }
    async DeleteProdukt(nazwa: string) {
        await produktZapotrzebowanieModel.deleteOne({ nazwa: nazwa })
    }
    async GetProduktyZapotrzebowanie(): Promise<Produkt[]> {
        return await produktZapotrzebowanieModel.find().exec()
    }
    async GetProduktZapotrzebowanie(nazwa: string): Promise<Produkt> {
        return await produktZapotrzebowanieModel.findOne({ nazwa: nazwa }).exec()
    }
    async PostProduktZapotrzebowanie(produkt: Produkt) {
        const newProdukt = new produktZapotrzebowanieModel(produkt)
        await newProdukt.save()
    }
    async UpdateProduktZapotrzebowanie(nazwa: string, produkt: Produkt) {
        await produktZapotrzebowanieModel.findOneAndUpdate({ nazwa: nazwa }, produkt)
    }
    async DeleteProduktZapotrzebowanie(nazwa: string) {
        await produktZapotrzebowanieModel.deleteOne({ nazwa: nazwa })
    }
    //to do: 

}