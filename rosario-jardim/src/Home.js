// Home.js
import React, { useState, useEffect } from 'react';
import { ref, push, update, remove, get } from 'firebase/database';
import { database } from './dataBase';

const Home = ({ catalogo, adicionarAoCarrinho, sendWhatsAppMessage, user }) => {
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [editItem, setEditItem] = useState({ id: '', name: '', price: '' });
  const [localCatalogo, setLocalCatalogo] = useState(catalogo);

  useEffect(() => {
    setLocalCatalogo(catalogo);
  }, [catalogo]);

  // Verificação de autorização
  const isAuthorized = user && user.email === 'rosario.jardimLN@gmail.com';

  useEffect(() => {
    console.log("Is authorized:", isAuthorized);
  }, [isAuthorized]);

  const handleAdd = async () => {
    if (!isAuthorized) {
      alert('Você não tem permissão para adicionar itens.');
      return;
    }
    try {
      const catalogoRef = ref(database, 'catalogo');
      await push(catalogoRef, { [newItem.name]: newItem.price });
      setNewItem({ name: '', price: '' });
      const snapshot = await get(catalogoRef);
      setLocalCatalogo(snapshot.val());
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item. Tente novamente.');
    }
  };

  const handleRemove = async (key) => {
    if (!isAuthorized) {
      alert('Você não tem permissão para remover itens.');
      return;
    }
    try {
      const itemRef = ref(database, `catalogo/${key}`);
      await remove(itemRef);
      const catalogoRef = ref(database, 'catalogo');
      const snapshot = await get(catalogoRef);
      setLocalCatalogo(snapshot.val());
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item. Tente novamente.');
    }
  };

  const handleEdit = async (key, newName, newPrice) => {
    if (!isAuthorized) {
      alert('Você não tem permissão para editar itens.');
      return;
    }
    try {
      const itemRef = ref(database, `catalogo/${key}`);
      await update(itemRef, { [newName]: newPrice });
      setEditItem({ id: '', name: '', price: '' });
      const catalogoRef = ref(database, 'catalogo');
      const snapshot = await get(catalogoRef);
      setLocalCatalogo(snapshot.val());
    } catch (error) {
      console.error('Erro ao editar item:', error);
      alert('Erro ao editar item. Tente novamente.');
    }
  };

  return (
    <div className='divHome'>
      <div className='catalogo'>
        <h3>Catálogo atual</h3>
        <input
          type="text"
          placeholder="Nome da planta"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Preço"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button onClick={handleAdd}>Adicionar</button>
        {localCatalogo ? (
          <ul>
            {Object.entries(localCatalogo).map(([key, value]) => (
              <li key={key}>
                {editItem.id === key ? (
                  <>
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editItem.price}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    />
                    <button onClick={() => handleEdit(key, editItem.name, editItem.price)}>Salvar</button>
                  </>
                ) : (
                  <>
                    {key}: R${value}{" "}
                    <button onClick={() => sendWhatsAppMessage(key, value)}>Comprar</button>
                    <button onClick={() => adicionarAoCarrinho(key, value)}>Carrinho</button>
                    {isAuthorized && (
                      <>
                        <button onClick={() => handleRemove(key)}>Remover</button>
                        <button onClick={() => setEditItem({ id: key, name: key, price: value })}>Editar</button>
                      </>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Carregando catálogo...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
