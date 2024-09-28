import React, { useState, useEffect } from 'react';
import { ref, push, update, remove, get } from 'firebase/database';
import { database, storage } from './dataBase';
import { getAuth } from 'firebase/auth';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';

const Home = ({ catalogo, adicionarAoCarrinho, sendWhatsAppMessage }) => {
  const [newItem, setNewItem] = useState({ name: '', price: '', image: null });
  const [editItem, setEditItem] = useState({ id: '', name: '', price: '' });
  const [localCatalogo, setLocalCatalogo] = useState(catalogo);

  useEffect(() => {
    setLocalCatalogo(catalogo);
  }, [catalogo]);

  const handleImageUpload = async () => {
    if (!newItem.image) return null;

    try {
      const imageRef = storageRef(storage, `plants/${newItem.image.name}`);
      const snapshot = await uploadBytes(imageRef, newItem.image);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  };

  const handleAdd = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Você não está logado.');
      return;
    }

    if (!newItem.name || !newItem.price) {
      alert('Nome e preço são obrigatórios.');
      return;
    }

    try {
      const imageUrl = await handleImageUpload();
      const catalogoRef = ref(database, 'catalogo');
      await push(catalogoRef, { name: newItem.name, price: newItem.price, imageUrl });
      setNewItem({ name: '', price: '', image: null });

      const snapshot = await get(catalogoRef);
      setLocalCatalogo(snapshot.val());
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item. Tente novamente.');
    }
  };

  const handleEdit = async (key, name, price) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Você não está logado.');
      return;
    }

    if (!name || !price) {
      alert('Nome e preço são obrigatórios.');
      return;
    }

    try {
      const catalogoRef = ref(database, `catalogo/${key}`);
      await update(catalogoRef, { name, price });

      const snapshot = await get(ref(database, 'catalogo'));
      setLocalCatalogo(snapshot.val());
      setEditItem({ id: '', name: '', price: '' });
    } catch (error) {
      console.error('Erro ao editar item:', error);
      alert('Erro ao editar item. Tente novamente.');
    }
  };

  const handleRemove = async (key) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Você não está logado.');
      return;
    }

    try {
      const catalogoRef = ref(database, `catalogo/${key}`);
      await remove(catalogoRef);

      const snapshot = await get(ref(database, 'catalogo'));
      setLocalCatalogo(snapshot.val());
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item. Tente novamente.');
    }
  };

  return (
    <div className='home-container'>
      <div className='catalogo-header'>
        <h1>Veja o Catálogo atual</h1>
      </div>

      {/* Formulário de adição de item */}
      <div className='add-item-form'>
        <input
          type='text'
          placeholder='Nome da planta'
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type='text'
          placeholder='Preço'
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type='file'
          onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
        />
        <button className='buttonAdd' onClick={handleAdd}>Adicionar</button>
      </div>

      {/* Exibição do catálogo */}
      <div className='catalogo-list'>
        {localCatalogo ? (
          <ul>
            {Object.entries(localCatalogo).map(([key, value]) => (
              <li key={key} className='catalogo-item'>
                {editItem.id === key ? (
                  <div className='edit-item'>
                    <input
                      type='text'
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                    <input
                      type='text'
                      value={editItem.price}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    />
                    <button onClick={() => handleEdit(key, editItem.name, editItem.price)}>Salvar</button>
                  </div>
                ) : (
                  <div className='item-display'>
                    {value.name}: R$ {value.price}{' '}
                    {value.imageUrl && <img src={value.imageUrl} alt={value.name} className='item-image' />}
                    <div className='item-actions'>
                      
                      <button onClick={() => handleRemove(key)}>Remover</button>
                      <button onClick={() => setEditItem({ id: key, name: value.name, price: value.price })}>Editar</button>
                    </div>
                  </div>
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
