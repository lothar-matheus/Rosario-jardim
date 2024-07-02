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
      console.log('Dados do catálogo:', data);
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
  {catalogo ? (
    <ul>
      {Object.entries(catalogo).map(([key, value]) => (
        <li key={key}>{key}: {value}</li>
      ))}
    </ul>
  ) : (
    <p>Carregando catálogo...</p>
  )}
</div>
    </div>
  );
}

export default App;
