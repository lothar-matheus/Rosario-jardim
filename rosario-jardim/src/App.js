import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.png';
import { database } from './dataBase';
import { ref, onValue } from "firebase/database";

function App() {
  const [catalogo, setCatalogo] = useState({});

  useEffect(() => {
    const catalogoRef = ref(database, 'catalogo');
    onValue(catalogoRef, (snapshot) => {
      const data = snapshot.val();
      setCatalogo(data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h2>SEJA BEM-VINDO</h2>
          <img src={logo} alt="Rosário Jardim Logo" className="logo" />
        </div>
      </header>
      <div className='catalogo'>
        <h3>Veja o nosso catálogo</h3>
        <ul>
          {Object.keys(catalogo).map((key) => (
            <li key={key}>{key}: {catalogo[key]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
