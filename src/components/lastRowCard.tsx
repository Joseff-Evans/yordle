import { useState } from 'react'
import { FC } from 'react'

interface CardProps {
    defaultSubmitAnswer: boolean;
    animationDelay: number;
    letter: string;
    word: string;
    index: number;
}

const Card: FC<CardProps> = ({defaultSubmitAnswer,animationDelay,letter,word,index}) => {
    const [submitAnswer, setSubmitAnswer] = useState<boolean>(defaultSubmitAnswer)
    const [checkCorrect, setCheckCorrect] = useState<boolean>(false)

    return (
        <div 
        style={{animationDelay: String(animationDelay) + "ms"}}
        className={"guessBox" + 
        (checkCorrect ? !word.includes(letter) ? " miss" : word[index] === letter ? " correct" : " close" : "") + 
        (submitAnswer ? " lastGuess" : "")}
        onAnimationEnd={() => setSubmitAnswer(false)}
        onAnimationStart={() => setCheckCorrect(true)}
        ><div>{letter} {submitAnswer}</div></div>   
    )
}

export default Card;