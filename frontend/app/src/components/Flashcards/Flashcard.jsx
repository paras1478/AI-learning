import { useState } from "react";

const Flashcard = ({flashcard , onToggleStar}) => {
    const [isFlipped , setIsFlipped]  = useState(flase);
 
    const handelflip = () => {
      setIsFlipped(!isFlipped);
    };
     return(
    <div>
        Flashcard
    </div>
  )
}

export default Flashcard;
