import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import JsonInput from './components/JsonInput'

describe('JsonInput', () => {
  it('shows error for invalid JSON', () => {
    const onStart = vi.fn()
    render(<JsonInput onStart={onStart} sampleData={[]} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'not json' } })
    fireEvent.click(screen.getByText('Start'))

    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument()
    expect(onStart).not.toHaveBeenCalled()
  })

  it('shows error when JSON is not an array', () => {
    const onStart = vi.fn()
    render(<JsonInput onStart={onStart} sampleData={[]} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '{"front": "a", "back": "b"}' } })
    fireEvent.click(screen.getByText('Start'))

    expect(screen.getByText('JSON must be an array')).toBeInTheDocument()
    expect(onStart).not.toHaveBeenCalled()
  })

  it('shows error when item missing front/back keys', () => {
    const onStart = vi.fn()
    render(<JsonInput onStart={onStart} sampleData={[]} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '[{"front": "a"}]' } })
    fireEvent.click(screen.getByText('Start'))

    expect(screen.getByText(/missing "front" or "back"/)).toBeInTheDocument()
    expect(onStart).not.toHaveBeenCalled()
  })

  it('calls onStart with valid JSON', () => {
    const onStart = vi.fn()
    render(<JsonInput onStart={onStart} sampleData={[]} />)

    const textarea = screen.getByRole('textbox')
    const validJson = '[{"front": "Q1", "back": "A1"}, {"front": "Q2", "back": "A2"}]'
    fireEvent.change(textarea, { target: { value: validJson } })
    fireEvent.click(screen.getByText('Start'))

    expect(onStart).toHaveBeenCalledWith([
      { front: 'Q1', back: 'A1' },
      { front: 'Q2', back: 'A2' }
    ])
  })

  it('loads sample data into textarea', () => {
    const sampleData = [{ front: 'Sample Q', back: 'Sample A' }]
    render(<JsonInput onStart={vi.fn()} sampleData={sampleData} />)

    fireEvent.click(screen.getByText('Load Sample'))

    const textarea = screen.getByRole('textbox')
    expect(textarea.value).toContain('Sample Q')
    expect(textarea.value).toContain('Sample A')
  })
})

describe('App', () => {
  it('shows input phase initially', () => {
    render(<App />)
    expect(screen.getByText('Load Sample')).toBeInTheDocument()
    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  it('transitions to studying phase after valid input', () => {
    render(<App />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {
      target: { value: '[{"front": "Q1", "back": "A1"}]' }
    })
    fireEvent.click(screen.getByText('Start'))

    expect(screen.getByText('Card 1 of 1')).toBeInTheDocument()
    expect(screen.getByText('Q1')).toBeInTheDocument()
  })

  it('flips card on click and shows mark buttons', () => {
    render(<App />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {
      target: { value: '[{"front": "Q1", "back": "A1"}]' }
    })
    fireEvent.click(screen.getByText('Start'))

    // Click card to flip
    fireEvent.click(screen.getByText('Q1'))

    // Mark buttons should appear
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('shows complete screen when all cards marked correct', () => {
    render(<App />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {
      target: { value: '[{"front": "Q1", "back": "A1"}]' }
    })
    fireEvent.click(screen.getByText('Start'))

    // Flip and mark correct
    fireEvent.click(screen.getByText('Q1'))
    fireEvent.click(screen.getByText('✓'))

    expect(screen.getByText('All Done!')).toBeInTheDocument()
  })

  it('repeats incorrect cards', () => {
    render(<App />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {
      target: { value: '[{"front": "Q1", "back": "A1"}, {"front": "Q2", "back": "A2"}]' }
    })
    fireEvent.click(screen.getByText('Start'))

    // Get first card front text
    const firstCard = screen.getByText(/Q[12]/)
    const firstFront = firstCard.textContent

    // Flip and mark incorrect
    fireEvent.click(firstCard)
    fireEvent.click(screen.getByText('✗'))

    // Get second card
    const secondCard = screen.getByText(/Q[12]/)

    // Flip and mark correct
    fireEvent.click(secondCard)
    fireEvent.click(screen.getByText('✓'))

    // Should show the incorrect card again (card 1 of 1)
    expect(screen.getByText('Card 1 of 1')).toBeInTheDocument()
    expect(screen.getByText(firstFront)).toBeInTheDocument()
  })

  it('reset button reshuffles same cards', () => {
    render(<App />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {
      target: { value: '[{"front": "Q1", "back": "A1"}]' }
    })
    fireEvent.click(screen.getByText('Start'))

    // Complete the deck
    fireEvent.click(screen.getByText('Q1'))
    fireEvent.click(screen.getByText('✓'))

    // Click reset
    fireEvent.click(screen.getByText('Reset'))

    // Should be back in studying phase
    expect(screen.getByText('Card 1 of 1')).toBeInTheDocument()
  })

  it('new deck button returns to input phase', () => {
    render(<App />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {
      target: { value: '[{"front": "Q1", "back": "A1"}]' }
    })
    fireEvent.click(screen.getByText('Start'))

    // Complete the deck
    fireEvent.click(screen.getByText('Q1'))
    fireEvent.click(screen.getByText('✓'))

    // Click new deck
    fireEvent.click(screen.getByText('New Deck'))

    // Should be back in input phase
    expect(screen.getByText('Load Sample')).toBeInTheDocument()
  })
})
