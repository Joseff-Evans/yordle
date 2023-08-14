import { useEffect, useState, useCallback } from 'react'
import lolWords from "./util/fiveLetterLeagueWords.json"
import Card from './components/lastRowCard'

function App() {
  const [word, setWord] = useState<string>("")
  const [prettyWord, setPrettyWord] = useState<string>("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState<string>("")
  const [validRow, setValidRow] = useState<boolean>(true)
  const [validChars, setValidChars] = useState<string[]>([])
  const [closeChars, setCloseChars] = useState<string[]>([])
  const [invalidChars, setInvalidChars] = useState<string[]>([])
  const [submitAnswer, setSubmitAnswer] = useState<boolean>(false)
  const [streak, setStreak] = useState<number>(0)

  const winner = guesses[guesses.length-1] === word;

  const letters = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","ENTER","Z","X","C","V","B","N","M","BACKSPACE"];

  useEffect(() => {
    updateWord();
  },[])

  function updateWord()  {
    let tempWord = lolWords[Math.floor(Math.random() * lolWords.length)];
    let cleanWord = tempWord.toUpperCase().split('').filter(letter => letters.includes(letter)).join('');
    
    setGuesses([])
    setValidChars([])
    setCloseChars([])
    setCurrentGuess("")
    setInvalidChars([])
    setWord(cleanWord)
    setPrettyWord(tempWord)
  }

  const addGuessLetter = useCallback((letter : string) => { 

    if (winner || guesses.length === 6) {
      if ( letter === "ENTER" ) {
        updateWord()
        return
      } else {
        return
      }
    }

    if ( letter === "BACKSPACE" ) {
      setCurrentGuess((prev) => prev.substring(0,prev.length-1));
    } else if ( letter === "ENTER" ) {

      if(currentGuess.length < 5 ) {setValidRow(false);return}
      setGuesses(prev => [...prev, currentGuess])
      setCurrentGuess("")
      setSubmitAnswer(true)

      let perfectMatches : string[] = validChars;
      let closeMatches : string[] = closeChars;
      let invalidMatches : string[] = invalidChars;
      for(let i = 0; i < word.length; i++) {
        if ( !validChars.includes(currentGuess[i]) || !invalidChars.includes(currentGuess[i]) ){

        if(word[i] === currentGuess[i]) {
          if(closeMatches.includes(currentGuess[i])) closeMatches.splice(closeMatches.indexOf(currentGuess[i]),1)
          perfectMatches.push(currentGuess[i])
        } else if ( word.includes(currentGuess[i]) ) {
          if(!closeMatches.includes(currentGuess[i])) closeMatches.push(currentGuess[i])
        } else {
          invalidMatches.push(currentGuess[i])
        }

      }
      }

      if(currentGuess === word) {
        setStreak(prev => prev+1)
      } else if (guesses.length === 5) {
        setStreak(0)
      }

      setValidChars(prev => [...prev,...perfectMatches])
      setInvalidChars(prev => [...prev,...invalidMatches])
      setCloseChars(prev => [...prev,...closeMatches])

    } else {
      if(currentGuess.length >= 5 ) return

      setCurrentGuess((prev) => prev + letter);
    }
  },
  [currentGuess,word]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {   

      e.preventDefault();
      
      const key = e.key.toUpperCase();

      if (!key.match(/^[a-zA-Z]$|(BACKSPACE)|(ENTER)/) || e.altKey || e.ctrlKey) return

      addGuessLetter(key);
      
    };

    document.addEventListener("keydown",handler);

    return () => {
      document.removeEventListener("keydown",handler);
    }
  });

  return (
    <div className="container">
      <div onClick={() => guesses.length === 6 || winner ? updateWord() : ""} className="wordPanel">
        <div className="message">{guesses.length === 6 ? "Better luck next time!" : winner ? "Congratulations!" : "\u{00A0}"}</div>
        <div>{guesses.length === 6 ? "Word: " + prettyWord + " • " : "\u{00A0}"}{guesses.length === 6 || winner ? "Click here or press enter to" + (winner ? " continue" : " reset") : "\u{00A0}"}</div>
      </div>
      <div className="guessContainer">
        {guesses.map((guessWord, RowIndex) => 
          <div className="guessContainerRow" key={"Row " + RowIndex}>
          {guessWord.split('').map((letter,index) =>
          <Card key={String(RowIndex) + ":" + String(index)}
          defaultSubmitAnswer={submitAnswer} 
          animationDelay={index*100}
          letter={letter}
          word={word}
          index={index} />
          )}
          </div>
        )}
        { guesses.length < 6 &&
        <div onAnimationEnd={() => setValidRow(true)} className={"guessContainerRow" + (validRow ? "" : " invalid")} key={"Row " + guesses.length}>
        {
          Array.apply(null, Array(5)).map(function () {}).map((_,index) =>
            <div key={String(guesses.length) + ":" + String(index)} className={"guessBox" + (typeof currentGuess.split('')[index] === 'undefined' ? "" : " active")}>
              <div>{currentGuess.split('')[index]}</div>
              </div>
          )
        }
        </div>
        }
        {Array.apply(null, Array( Math.max(0,(5-guesses.length))) ).map(function () {}).map(
          (_, index) =>
            <div className="guessContainerRow" key={"Row " + (guesses.length + index + 1)}>  
            {Array.apply(null, Array(5)).map(function () {}).map(
              (_, index) =>
              <div key={"Blank " + String(index)} className="guessBox"><div></div></div>
            )}          
            </div>
          )
        }
      </div>
        <div>Streak: {streak}</div>
      <div className="keyboard">
        <div className="row">
      {letters.slice(0,10).map(letter =>
        <div key={letter}><button
        onClick={() => addGuessLetter(letter)} 
        className={letter + (validChars.includes(letter) ? " correct" : closeChars.includes(letter) ? " close" : invalidChars.includes(letter) ? "  miss" : "")}
        onKeyPress={e => console.log(e.keyCode)}>
          {letter}
        </button></div>
      )}
      </div>
      <div className="row">
      {letters.slice(10,19).map(letter =>
        <div key={letter}><button onKeyPress={e => e.keyCode === 13 ? addGuessLetter(letter) : ""} onClick={() => addGuessLetter(letter)} className={letter + (validChars.includes(letter) ? " correct" : closeChars.includes(letter) ? " close" : invalidChars.includes(letter) ? "  miss" : "")}>{letter}</button></div>
      )}
      </div>
      
      <div className="row">
          {letters.slice(19,28).map(letter =>
            <div key={letter}>
              <button onKeyPress={e => e.keyCode === 13 ? addGuessLetter(letter) : ""} onClick={() => addGuessLetter(letter)} className={letter + (validChars.includes(letter) ? " correct" : closeChars.includes(letter) ? " close" : invalidChars.includes(letter) ? "  miss" : "")}>
              {letter === "BACKSPACE" ? "\u{02190}" : letter === "ENTER" ? "\u{021A9}" : letter}
              </button></div>
          )}
      </div>
      </div>
    </div>
  )
}

export default App
