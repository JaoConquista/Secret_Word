// CSS
import './App.css';

// React
import { useState , useCallback, useEffect} from 'react';

//Data
import wordList from "./data/words.jsx";

//Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game"  
import GameOver from "./components/GameOver"


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters,setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const[guesses,setGuesses] = useState(3)
  const[score,setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //Pick random category
    const categories = Object.keys(words)
    const category = categories[
      Math.floor(Math.random() 
      * Object.keys(categories).length)]

    //Pick random word
    const word = 
    words[category][Math.floor(Math.random()* words[category].length)]

    return {word, category}
  },[words]);
  //Start the game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    //pick word and pick category
    const {word, category} = pickWordAndCategory()
    
    //Create array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //Fill states
    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  },[pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //check if letter has already been used
    if( 
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
      ){
        return;
      }


    // push guessed letter remove
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters,normalizedLetter])
    }else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if(guesses <= 0) {
      
      setGameStage(stages[2].name)

      //reset all states
      clearLetterStates()
    }
  },[guesses]);
  
  // check win condition
  useEffect(() => {
     
    const uniqueLetters = [... new Set(letters)]
    //Set só deixa itens únicos em um array    

    //win condition
    if(guessedLetters.length == uniqueLetters.length){
      //Restart the game
      startGame();
      
      
      setScore((actualScore) => actualScore += 100)
      setGuesses(3)
    }
    
  },[guessedLetters])
  //Restart the game  


  const retry = () => {
    setScore(0)
    setGuesses(3)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame= {startGame}/>}
      {gameStage === "game" && <Game 
        verifyLetter={verifyLetter}
        pickeWord = {pickedWord}
        pickedCategory={pickedCategory}
        letters = {letters}
        guessedLetters = {guessedLetters}
        wrongLetters = {wrongLetters}
        guesses = {guesses}
        score = {score}
        />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App
