import { Pracownik } from "./lib/pracownik";
import { Restauracja } from "./lib/restauracja";
import { Rezerwacja} from "./lib/rezerwacja"
import { Status, Stolik } from "./lib/Stolik";

console.log(new Restauracja("Nazwa", "Zacny adres"))
console.log(new Pracownik("Imie", "Nazwisko"))
console.log(new Rezerwacja(new Stolik("nazwa",1, Status.wolny)))