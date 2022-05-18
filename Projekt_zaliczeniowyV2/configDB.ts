//import mongoose from 'mongoose'

import { Restauracja } from "./lib/restauracja";

const mongoose = require('mongoose');
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

const restauracjaModel = mongoose.model("restauracja", RestauracjaSchema);

const stolikSchema = new mongoose.Schema({
    nazwa: {
        type: String,
        required: true
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
const stolikModel = mongoose.model("stolik", stolikSchema)
//const newstolika = new stolikModel({nazwa: "New Name", iloscOsob: 5})
const newstolika = stolikModel.find()
console.log(newstolika)
//newstolika.save();
const rezerwacjaSchema = new mongoose.Schema({
    stolik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stolik",
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    koniec: {
        type: Date,
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
const rezerwacjaModel = mongoose.model("stolik", stolikSchema)

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

