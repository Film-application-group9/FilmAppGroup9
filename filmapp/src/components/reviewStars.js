import React, { useState} from "react";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import { IconContext } from "react-icons";
import "../styles/Stars.css"


const RevStars = (rating) => {
  let fullStars = Math.floor(rating)
  let partialStar = rating - fullStars
  let starArray =[]
  console.log("Full stars: ", fullStars)
  console.log("Partial star: ", partialStar)
  for (let i = 0; i < fullStars; i++) {
    starArray.push(
      <IconContext.Provider value={{color: "gold" }}>
            <FaStar className="star"/>
            </IconContext.Provider>
    );
}
  if(partialStar >= 0.25 && partialStar < 0.75){
    starArray.push(
      <IconContext.Provider value={{ color: "gold"}}>
      <FaStarHalf className="star"/>
      </IconContext.Provider>
      );
  }else if(partialStar>= 0.75){
    starArray.push(
      <IconContext.Provider value={{ color: "gold"}}>
      <FaStar className="star"/>
      </IconContext.Provider>
    )
  }
  return starArray

}

const Stars = ({rating}) =>{
  if(rating != null){
      let ratingFloat = parseFloat(rating)
      console.log("ratingFloat type: ", typeof ratingFloat)
      let starArray = RevStars(ratingFloat)
      return(<label>
          <span className="Rating">{"Rating: "}</span>{rating}{" "}{starArray.map(item => item)}
      </label>)
  }
  
}

export {RevStars, Stars}