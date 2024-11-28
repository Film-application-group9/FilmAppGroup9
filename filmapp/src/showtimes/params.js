import React from 'react'

const AreaList = () => {  
    const list = ["Pääkaupunkiseutu",
    "Espoo",
    "Espoo: OMENA",
    "Espoo: SELLO",
    "Helsinki",
    "Helsinki: ITIS",
    "Helsinki: KINOPALATSI",
    "Helsinki: TENNISPALATSI",
    "Vantaa: FLAMINGO",
    "Jyväskylä: FANTASIA",
    "Kuopio: SCALA",
    "Lahti: KUVAPALATSI",
    "Lappeenranta: STRAND",
    "Oulu: PLAZA",
    "Pori: PROMENADI",
    "Tampere",
    "Tampere: CINE ATLAS",
    "Tampere: PLEVNA",
    "Turku ja Raisio",
    "Turku: KINOPALATSI",
    "Raisio: LUXE MYLLY"
] 

return list 
}

const PVM = () => {
    const today = new Date()
    const week = []
    const formattedWeek=[]
    //week.push(today)
    for(let i = 1; i< 7; i++){
        const day = new Date()
        day.setDate(today.getDate() + i)
        week.push(day)
    }

    for(let day of week){
        const dayNumber = day.getDate().toString()
        const month = (day.getMonth() + 1).toString()
        const year = day.getFullYear().toString()
        const date = dayNumber + "." + month +"."+year
        formattedWeek.push(date)
    }

    return formattedWeek
}

const AreaID = (area) => {
const taulukko = [{"area": "Kaikki teatterit", "id":1029},
                    { "area": "Pääkaupunkiseutu", "id": 1014},
                    {"area": "Espoo", "id": 1012},
                    {"area": "Espoo: OMENA", "id": 1039},
                    {"area": "Espoo: SELLO", "id": 1038},
                    {"area": "Helsinki", "id": 1002},
                    {"area": "Helsinki: ITIS", "id":1045},
                    {"area": "Helsinki: KINOPALATSI", "id":1031},
                    {"area": "Helsinki: MAXIM", "id":1032},
                    {"area": "Helsinki: TENNISPALATSI", "id":1033},
                    {"area": "Vantaa: FLAMINGO", "id": 1013},
                    {"area": "Jyväskylä: FANTASIA", "id":1015},
                    {"area": "Kuopio: SCALA", "id":1016},
                    {"area": "Lahti: KUVAPALATSI", "id": 1017},
                    {"area": "Lappeenranta: STRAND", "id":1041},
                    {"area": "Oulu: PLAZA", "id": "1018"},
                    {"area": "Pori: PROMENADI", "id": 1019},
                    {"area": "Tampere", "id":1021},
                    {"area": "Tampere: CINE ATLAS", "id": 1034},
                    {"area": "Tampere: PLEVNA", "id":1035},
                    {"area": "Turku ja Raisio", "id":1047},
                    {"area": "Turku: KINOPALATSI", "id":1022},
                    {"area": "Raisio: LUXE MYLLY", "id":1046}
]
    try {
        const obj = taulukko.find(obj1 => obj1.area === area)
        const id = obj["id"]
        return id
    }catch (error){
        return ("Error: ")
    }
    

}



export {AreaList, PVM, AreaID}