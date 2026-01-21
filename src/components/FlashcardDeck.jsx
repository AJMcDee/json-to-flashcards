import Flashcard from './Flashcard'

function FlashcardDeck({ card, isFlipped, isTransitioning, onFlip, onMark, onFlipComplete, currentIndex, totalCards }) {
  return (
    <div className="flashcard-container">
      <div className="progress">
        Card {currentIndex + 1} of {totalCards}
      </div>

      <Flashcard
        front={card.front}
        back={card.back}
        isFlipped={isFlipped}
        isTransitioning={isTransitioning}
        onFlip={onFlip}
        onFlipComplete={onFlipComplete}
      />

      {isFlipped && (
        <div className="mark-buttons">
          <button className="incorrect" onClick={() => onMark(false)}>
            ✗
          </button>
          <button className="correct" onClick={() => onMark(true)}>
            ✓
          </button>
        </div>
      )}
    </div>
  )
}

export default FlashcardDeck
