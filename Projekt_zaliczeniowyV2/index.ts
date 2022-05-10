import { Pracownik } from "./lib/pracownik";
import { Restauracja } from "./lib/restauracja";
import { Rezerwacja} from "./lib/rezerwacja"
import { Status, Stolik } from "./lib/Stolik";
import { Zamowienie, Status as S } from "./lib/zamowienie";
import { Danie, Kategoria } from "./lib/danie";
import express from 'express'
import { Request, Response } from 'express'


console.log(new Restauracja("Nazwa", "Zacny adres"))
console.log(new Pracownik("Imie", "Nazwisko"))
console.log(new Rezerwacja(new Stolik("nazwa",1, Status.wolny)))
const dania = [new Danie("Paróweczki", 10, Kategoria.danie_główne)]
console.log(new Zamowienie(dania,new Stolik("asdasd", 1), new Pracownik("Imie", "Nazwisko")))
console.log(<S>S.zlozone)

const app = express()
app.use(express.json())

app.get('/restauracja', (function(req: Request, res: Response){
    //res.se
}))


app.listen(3000)