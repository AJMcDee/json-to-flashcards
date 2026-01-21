import { useState } from 'react'

function JsonInput({ onStart, sampleData }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleLoadSample = () => {
    setText(JSON.stringify(sampleData, null, 2))
    setError('')
  }

  const handleStart = () => {
    try {
      const parsed = JSON.parse(text)

      if (!Array.isArray(parsed)) {
        setError('JSON must be an array')
        return
      }

      if (parsed.length === 0) {
        setError('Array must not be empty')
        return
      }

      for (let i = 0; i < parsed.length; i++) {
        if (!parsed[i].front || !parsed[i].back) {
          setError(`Item ${i + 1} is missing "front" or "back" key`)
          return
        }
      }

      setError('')
      onStart(parsed)
    } catch (e) {
      setError('Invalid JSON: ' + e.message)
    }
  }

  return (
    <div className="json-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Paste JSON array here, e.g. [{"front": "Question", "back": "Answer"}]'
      />
      <div className="buttons">
        <button className="load-sample" onClick={handleLoadSample}>
          Load Sample
        </button>
        <button className="start" onClick={handleStart}>
          Start
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default JsonInput
