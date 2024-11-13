import {JSDOM} from 'jsdom'
import axios from 'axios'

const naytosajat = async () =>{
    // GET-pyyntö URL:lle
    try{
    let response = await axios.get('https://www.finnkino.fi/xml/Schedule/', {timeout: 7000,
        headers: {'Accept':'*/*',
            'Content-Type': 'text/xml',
                'Connection':'keep-alive',
                'Transfer-Encoding':'chunked',
                'User-Agent': 'axios/1.7.7',
                'Accept-Encoding':'gzip, deflate, br'
        }
    })
    let data = await response.data
    //console.log("Data:",data)
    }   catch(error) {
    console.error('Virhe:', error);
};
}


/*
const naytosajat = () =>{
    return new Promise((resolve, reject) => {
    const url = 'https://www.finnkino.fi/xml/Schedule/'
    fetch(url,{
        method: 'GET',
        headers: {
        'Content-Type': 'application/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
        }
    })
    .then(response => {
    if(!response.ok){
        throw new Error("Error: " + response.statusText)
    }
})
    .then(xmlText => {
        const dom = new JSDOM(xmlText, {contentType: "application/xml"})
        const document = dom.window.document
        const testi = xmlString.querySelector("root")
        
        return document
        console.log("TESTI")
        
    })
    .catch(error => {
        console.error('Virhe:', error)
    })
}
)}*/


//console.log(naytosajat())

export {naytosajat}