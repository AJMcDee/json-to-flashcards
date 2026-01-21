function Flashcard({ front, back, isFlipped, isTransitioning, onFlip, onFlipComplete }) {
  const handleTransitionEnd = (e) => {
    // Only trigger when flipping back to front (isFlipped becomes false)
    if (e.propertyName === 'transform' && !isFlipped && onFlipComplete) {
      onFlipComplete()
    }
  }

  return (
    <div className="flashcard" onClick={!isFlipped ? onFlip : undefined}>
      <div
        className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flashcard-front">
          {!isTransitioning && front}
        </div>
        <div className="flashcard-back">
          {back}
        </div>
      </div>
    </div>
  )
}

export default Flashcard
