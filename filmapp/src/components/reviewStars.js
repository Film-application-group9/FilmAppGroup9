import React, { useState} from "react";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import { IconContext } from "react-icons";


const RevStars = (rating) => {
  let fullStars = Math.floor(rating)
  let partialStar = rating - fullStars
  let starArray =[]
  console.log("Full stars: ", fullStars)
  console.log("Partial star: ", partialStar)
  for (let i = 0; i < fullStars; i++) {
    starArray.push(
      <IconContext.Provider value={{ color: "gold"}}>
            <FaStar/>
            </IconContext.Provider>
    );
}
  if(partialStar >= 0.25 && partialStar < 0.75){
    starArray.push(
      <IconContext.Provider value={{ color: "gold"}}>
      <FaStarHalf color='gold'/>
      </IconContext.Provider>
      );
  }else if(partialStar>= 0.75){
    starArray.push(
      <IconContext.Provider value={{ color: "gold"}}>
      <FaStar/>
      </IconContext.Provider>
    )
  }
  return starArray

}

export {RevStars}