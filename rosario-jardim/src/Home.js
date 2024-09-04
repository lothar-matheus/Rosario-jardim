import React, { useState, useEffect } from 'react';
import { ref, push, update, remove, get } from 'firebase/database';
import { database, storage } from './dataBase'; // Certifique-se de configurar o storage no arquivo 'dataBase'
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
    const imageRef = storageRef(storage, `plants/${newItem.image.name}`);
    const snapshot = await uploadBytes(imageRef, newItem.image);
    return await getDownloadURL(snapshot.ref);
  };

  const handleAdd = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Você não está logado.');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(); // Faz o upload da imagem e obtém a URL
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
        <input
          type="file"
          onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
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
                    {value.name}: R$ {value.price}{" "}
                    {value.imageUrl && <img src={value.imageUrl} alt={value.name} style={{ width: '50px', height: '50px' }} />}
                    <button onClick={() => sendWhatsAppMessage(value.name, value.price)}>Comprar</button>
                    <button onClick={() => adicionarAoCarrinho(value.name, value.price)}>Carrinho</button>
                    <button onClick={() => handleRemove(key)}>Remover</button>
                    <button onClick={() => setEditItem({ id: key, name: value.name, price: value.price })}>Editar</button>
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
