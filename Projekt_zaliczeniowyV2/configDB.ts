//import mongoose from 'mongoose'

import { Kategoria } from "./lib/danie";
import { Restauracja } from "./lib/restauracja";
import { Stolik } from "./lib/stolik";

export const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://MeCatooo:123pass@cluster0.hlmgs.mongodb.net/restauracja?retryWrites=true&w=majority')

const RestauracjaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    adres: {
        type: String
    },
    telephone: {
        type: String
    },
    nip: {
        type: String
    },
    email: {
        type: String
    },
    www: {
        type: String
    },
});

export const restauracjaModel = mongoose.model("restauracja", RestauracjaSchema);

const stolikSchema = new mongoose.Schema({
    // _id:  {
    //     type: mongoose.Types.ObjectId
    // },
    nazwa: {
        type: String,
        required: true, 
        dropDups: true,
        unique: true
    },
    iloscOsob: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Niedostepny"
    },
})
export const stolikModel = mongoose.model("stolik", stolikSchema)
//const newstolika = new stolikModel({nazwa: "New Name", iloscOsob: 5})
const data = stolikModel.find({}).exec() //=> 
//console.log("Query res", <Stolik>data)
//newstolika.save();
const rezerwacjaSchema = new mongoose.Schema({
    // _id:  {
    //     type: mongoose.Types.ObjectId
    // },
    stolik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stolikSchema',
        required: true
    },
    start: {
        type: String,
        required: true
    },
    koniec: {
        type: String,
        required: true
    },
    imie: {
        type: String,
        required: true
    },
    nazwisko: {
        type: String,
        required: true
    },
})
export const rezerwacjaModel = mongoose.model("rezerwacja", rezerwacjaSchema)

const danieScema = new mongoose.Schema({
    nazwa: {
        type: String,
        required: true
    },
    cena: {
        type: Number,
        required: true
    },
    kategoria: {
        type: String,
        required: true
    }
})

export const danieModel = mongoose.model("danie", danieScema)

const pracownikScema = new mongoose.Schema({
    imie: {
        type: String,
        required: true
    },
    nazwisko: {
        type: Number,
        required: true
    },
    pozycja: {
        type: String,
        required: true
    }
})
export const pracownikModel = mongoose.model("pracownik", pracownikScema)

const zamoweienieScema = new mongoose.Schema({
    pracownik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pracownikScema',
        required: true
    },
    stolik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stolikkScema',
        required: true
    },
    pozycje: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stolikkScema',
        required: true
    }],
    cena: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dataZamoiwenia: {
        type: Date,
        required: true
    }
})
export const zamoweienieModel = mongoose.model("zamowienie", zamoweienieScema)

const produktScema = new mongoose.Schema({
    nazwa: {
        type: String,
        required: true
    },
    cena: {
        type: Number,
        required: true
    },
    ilosc: {
        type: Number,
        required: true
    },
    jednostkaMiary: {
        type: String,
        required: true
    }
})
export const produktModel = mongoose.model("produkt", produktScema)
const produktZapotrzebowanieScema = new mongoose.Schema({
    nazwa: {
        type: String,
        required: true
    },
    cena: {
        type: Number,
        required: true
    },
    ilosc: {
        type: Number,
        required: true
    },
    jednostkaMiary: {
        type: String,
        required: true
    }
})
export const produktZapotrzebowanieModel = mongoose.model("produktZapotrzebowanie", produktZapotrzebowanieScema)
// const newRezerwacja = new rezerwacjaModel({stolik: newstolika, 
//     start: new Date(Date.now()),
//     koniec: new Date(Date.now()+1000),
//     imie: "stefan",
//     nazwisko: "kowalski"
//     })
// newRezerwacja.save()






// const newrestauracja = new restauracjaModel({name: "New Name"})
// const saveRet = newrestauracja.save()
// mongoose.connect('mongodb://username:password@cluster0.hlmgs.mongodb.net:27017/pab');
//mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]

