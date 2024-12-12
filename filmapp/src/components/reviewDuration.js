const DurationFormat = (duration) => {
    try{
        const hours = Math.floor(duration/60)
    const minutes = duration -hours*60
    return (hours.toString()+"h "+ minutes.toString()+ "min")
    }catch(error){
        console.error(error)
    }
    
}

export {DurationFormat}