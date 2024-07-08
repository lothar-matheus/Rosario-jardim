import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import logo from './logo.png';
import logoCarrinho from './carrinhoLogo.png';
import logoAdmin from './adminLogo.png';
import { database } from './dataBase';
import { ref, onValue } from "firebase/database";
import Login from './Login';
import Home from './Home';

function App() {
  const [catalogo, setCatalogo] = useState({});
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const catalogoRef = ref(database, 'catalogo');
    onValue(catalogoRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Dados do catálogo:', data);
      setCatalogo(data);
    });
  }, []);

  const sendWhatsAppMessage = (item, price) => {
    const phoneNumber = "5585997177690";
    const message = `Olá, gostaria de comprar o ${item} por R$${price}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const adicionarAoCarrinho = (item, price) => {
    setCarrinho([...carrinho, { item, price }]);
  };

  const sendWhatsAppMessagePush = () => {
    const phoneNumber = "5585997177690";
    const message = `Olá, gostaria de comprar os seguintes itens:\n\n${carrinho.map((produto) => `${produto.item}: R$${produto.price}`).join('\n')}\n\nTotal: R$${carrinho.reduce((total, produto) => total + parseFloat(produto.price), 0)}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h2>SEJA BEM-VINDO</h2>
            <img src={logo} alt="Rosário Jardim Logo" className="logo" />
            <img src={logoCarrinho} alt="Carrinho Logo" className="carrinhoLogo" onClick={sendWhatsAppMessagePush} style={{ cursor: 'pointer' }} />
            <img src={logoAdmin} alt='Admin Logo' className='adminLogo' onClick={() => window.location.href = '/login'} style={{ cursor: 'pointer' }} />
          </div>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/" element={
            <div className='catalogo'>
              <h3>Veja o nosso catálogo</h3>
              {catalogo ? (
                <ul>
                  {Object.entries(catalogo).map(([key, value]) => (
                    <li key={key}>
                      {key}: R${value}{" "}
                      <button onClick={() => sendWhatsAppMessage(key, value)}>Comprar</button>
                      <button onClick={() => adicionarAoCarrinho(key, value)}>Carrinho</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Carregando catálogo...</p>
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
