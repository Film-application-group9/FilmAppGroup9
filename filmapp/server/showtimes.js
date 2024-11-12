
const url = 'https://www.finnkino.fi/xml/Schedule/'
import React from 'react'

const naytosajat = () =>{
    fetch(url)
    .then(response => {
    if(!response.ok){
        throw new Error("Error: " + response.statusText)
    }
})
    .then(xmlText => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlText, "application/xml")

        console.log(xmlDoc)
        console.log("testi1")


    })
    .catch(error => {
        console.error('Virhe:', error)
    })
}

console.log(naytosajat())
