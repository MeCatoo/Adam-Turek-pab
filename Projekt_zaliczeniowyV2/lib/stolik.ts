export class Stolik{
    //_id: string = "0"
     nazwa: string = ""
     iloscOsob: number = 1
     status: Status = Status.niedostepny

    // get Nazwa(){return this._nazwa}
    // get IloscOsob(){return this._iloscOsob}
    // get Status() {return this._status}

    // set Nazwa(name: string) {
    //     if (name.length < 50 && name.length > 0)
    //         this._nazwa = name
    //     else
    //         throw new Error("Błędna nazwa")
    // }
    // set IloscOsob(name: number) {
    //     if (name < 100)
    //         this._iloscOsob = name
    //     else
    //         throw new Error("Błędna ilosc")
    // }
    // set Status(name: Status) {
    //         this._status = name
    // }
    // constructor(nazwa: string, iloscosob: number, status?: string){
    //     this.Nazwa = nazwa 
    //     this.IloscOsob = iloscosob
    //     this.Status = Status[status as keyof typeof Status] ?? Status.niedostepny
    // }
    constructor(stolik: Stolik){
        this.nazwa = stolik.nazwa
        this.iloscOsob = stolik.iloscOsob
        this.status = stolik.status
        //this._id = stolik._id
    }
}
export enum Status{
    wolny = "wolny",
    zajety = "zajety",
    niedostepny = "niedostepny"
}