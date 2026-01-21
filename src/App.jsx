import { useState } from 'react'
import JsonInput from './components/JsonInput'
import FlashcardDeck from './components/FlashcardDeck'
import sampleData from '../data/animal-facts.json'

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

let wasCorrect = null

function App() {
  const [cards, setCards] = useState([])
  const [currentDeck, setCurrentDeck] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [incorrectCards, setIncorrectCards] = useState(new Set())
  const [phase, setPhase] = useState('input') // 'input' | 'studying' | 'complete'

  const handleStart = (parsedCards) => {
    setCards(parsedCards)
    const shuffled = shuffleArray(parsedCards)
    setCurrentDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIncorrectCards(new Set())
    setPhase('studying')
  }

  const handleFlip = () => {
    setIsFlipped(true)
  }

  const handleMark = (isCorrect) => {
    if (!isCorrect) {
      setIncorrectCards(prev => new Set([...prev, currentDeck[currentIndex]]))
    }

    wasCorrect = isCorrect
    setIsFlipped(false)
    setIsTransitioning(true)

  }

  const handleFlipComplete = () => {
    if (wasCorrect === null) return
    setIsTransitioning(false)

    if (currentIndex < currentDeck.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // End of round
      const incorrect = !wasCorrect
        ? new Set([...incorrectCards, currentDeck[currentIndex]])
        : incorrectCards

      if (incorrect.size > 0) {
        // Start new round with incorrect cards
        const nextDeck = shuffleArray([...incorrect])
        setCurrentDeck(nextDeck)
        setCurrentIndex(0)
        setIncorrectCards(new Set())
      } else {
        // All done!
        setPhase('complete')
      }
    }

    wasCorrect = null
  }

  const handleReset = () => {
    const shuffled = shuffleArray(cards)
    setCurrentDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIncorrectCards(new Set())
    setPhase('studying')
  }

  const handleNewDeck = () => {
    setCards([])
    setCurrentDeck([])
    setCurrentIndex(0)
    setIsFlipped(false)
    setIncorrectCards(new Set())
    setPhase('input')
  }

  return (
    <div className="app">
      <h1>Flashcards</h1>

      {phase === 'input' && (
        <JsonInput onStart={handleStart} sampleData={sampleData} />
      )}

      {phase === 'studying' && (
        <FlashcardDeck
          card={currentDeck[currentIndex]}
          isFlipped={isFlipped}
          isTransitioning={isTransitioning}
          onFlip={handleFlip}
          onMark={handleMark}
          onFlipComplete={handleFlipComplete}
          currentIndex={currentIndex}
          totalCards={currentDeck.length}
        />
      )}

      {phase === 'complete' && (
        <div className="complete">
          <h2>All Done!</h2>
          <p>You've mastered all the cards.</p>
          <div className="complete-buttons">
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleNewDeck}>New Deck</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
