function Flashcard({ front, back, isFlipped, isTransitioning, onFlip, onFlipComplete }) {
  const handleTransitionEnd = (e) => {
    if (e.propertyName === 'transform' && !isFlipped && onFlipComplete) {
      onFlipComplete()
    }
  }

  return (
    <div className="flashcard" onClick={!isFlipped ? onFlip : undefined}>
      <div
        className={`flashcard-inner ${isFlipped ? 'flipped' : ''} ${isTransitioning ? 'transitioning' : ''}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flashcard-front">
          {front}
        </div>
        <div className="flashcard-back">
          {back}
        </div>
      </div>
    </div>
  )
}

export default Flashcard
