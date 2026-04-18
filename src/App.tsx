import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Documentation — Your questions, answered
      </p>

      <div>
        <h3>Explore Vite</h3>
        <p>Learn more</p>

        <h3>Connect with us</h3>
        <p>Join the Vite community</p>

        <ul>
          <li>GitHub</li>
          <li>Discord</li>
          <li>X.com</li>
          <li>Bluesky</li>
        </ul>
      </div>
    </>
  )
}

export default App