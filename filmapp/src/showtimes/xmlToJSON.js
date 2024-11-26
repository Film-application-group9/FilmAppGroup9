
import XMLParser from 'react-xml-parser'
const xmlToJson = (xmlText) => {
    const json = new XMLParser().parseFromString(xmlText)
    return json
}

export {xmlToJson}