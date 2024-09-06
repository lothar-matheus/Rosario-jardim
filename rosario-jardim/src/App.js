import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './logo.png';
import logoCarrinho from './carrinhoLogo.png';
import logoAdmin from './adminLogo.png';
import { database, auth } from './dataBase';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Login';
import Home from './Home';

function App() {
  const [catalogo, setCatalogo] = useState({});
  const [carrinho, setCarrinho] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Usuário atual:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const catalogoRef = ref(database, 'catalogo');
    onValue(catalogoRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Dados do catálogo:', data);
      setCatalogo(data);
    });
  }, []);

  const sendWhatsAppMessage = (item, price) => {
    const phoneNumber = '5585997177690';
    const message = `Olá, gostaria de comprar o ${item} por R$${price}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const adicionarAoCarrinho = (item, price) => {
    setCarrinho([...carrinho, { item, price }]);
  };

  const sendWhatsAppMessagePush = () => {
    const phoneNumber = '5585997177690';
    const message = `Olá, gostaria de comprar os seguintes itens:\n\n${carrinho
      .map((produto) => `${produto.item}: R$${produto.price}`)
      .join('\n')}\n\nTotal: R$${carrinho.reduce(
      (total, produto) => total + parseFloat(produto.price),
      0
    )}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    //zarar o carrinho quando o usuário já estiver no whatszap do cliente

    setCarrinho([]);

  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h2>SEJA BEM-VINDO</h2>
          <img src={logo} alt="Rosário Jardim Logo" className="logo" />
          <img
            src={logoCarrinho}
            alt="Carrinho Logo"
            className="carrinhoLogo"
            onClick={sendWhatsAppMessagePush}
            style={{ cursor: 'pointer' }}


            /*<button>Plantas</buttons>
              <button>Artesanatos</buttons>
            */
            
          />
          <div className='carrinhoLogo'>
            {carrinho.length >0 && <span className='cart-count'>{carrinho.length}</span>}
          </div>
          <img
            src={logoAdmin}
            alt="Admin Logo"
            className="adminLogo"
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <div className="catalogo">
              <h3>Veja o nosso catálogo</h3>
              {catalogo ? (
               <ul>
               {Object.entries(catalogo).map(([key, value]) => (
                 <li key={key} className="catalogo-item">
                   {value.imageUrl && (
                     <img src={value.imageUrl} alt={value.name} />
                   )}
                   <div className="item-info">
                     <h4>{value.name}</h4>
                     <p>R$ {value.price}</p>
                     <div className="item-buttons">
                       <button onClick={() => sendWhatsAppMessage(value.name, value.price)}>Comprar</button>
                       <button onClick={() => adicionarAoCarrinho(value.name, value.price)}>Carrinho</button>
                       
                     </div>
                   </div>
                 </li>
               ))}
             </ul>
             
              ) : (
                <p>Carregando catálogo...</p>
              )}
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <Home
              catalogo={catalogo}
              adicionarAoCarrinho={adicionarAoCarrinho}
              sendWhatsAppMessage={sendWhatsAppMessage}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
