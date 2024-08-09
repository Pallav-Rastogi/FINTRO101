// admin/src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [price, setPrice] = useState('');
  const [remainingQuantity, setRemainingQuantity] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/price', {
        value: parseFloat(price),
        remainingQuantity: parseInt(remainingQuantity),
      });
      alert('Price updated successfully');
      setPrice('');
      setRemainingQuantity('');
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error updating price');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="New Price"
          required
        />
        <input
          type="number"
          value={remainingQuantity}
          onChange={(e) => setRemainingQuantity(e.target.value)}
          placeholder="Remaining Quantity"
          required
        />
        <button type="submit">Update Price</button>
      </form>
    </div>
  );
}

export default App;