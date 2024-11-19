


const JSONtoList = (obj, alueBool) =>{
    if(obj != null){
    let jsonarray = []
    try{
        let children1 = obj.children[1].children
        let show
        let showlist={}
        for(show of children1){
            let json_obj = {"Time":null, "Title":null, "Place":null}
            let children2 = show.children.find(item => item.name == "Title")
            json_obj["Title"] = (children2.value)
            let children3 = show.children.find(item => item.name == "dttmShowStart")
            let showtime = children3.value
            let index = showtime.indexOf("T")
            let time = showtime.substring(index+1)
            json_obj["Time"] = time
            
            if(alueBool == true){
                let children4 =show.children.find(item => item.name == "Theatre")
                let place = children4.value
                json_obj["Place"]=place
            }
            jsonarray.push(json_obj)
        }

        //let children2 = children1.children
        //let children3 = JSON.parse(children2)
        return (jsonarray)
    }catch(error){
        console.error(error)
        return ["ERROR"]
    }
}}

export {JSONtoList}