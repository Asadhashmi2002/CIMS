import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => setIsOpen(!isOpen)}>Toggle Content</button>
        
        {/* Ternary operator example */}
        {isOpen ? (
          <div className="content-box">
            <h2>This content is visible</h2>
            <p>This is how a ternary operator should be formatted in React JSX</p>
          </div>
        ) : null}
        
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
