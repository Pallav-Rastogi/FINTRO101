// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [price, setPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [position, setPosition] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserData(storedUserId);
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/price/current');
      setPrice(response.data);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setPosition(response.data.position);
      setPnl(response.data.pnl);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleOrder = async (action) => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        userId,
        quantity,
        action,
      });
      setPosition(response.data.newPosition);
      setPnl(response.data.newPnl);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username: event.target.username.value,
        password: event.target.password.value,
      });
      setUserId(response.data.userId);
      localStorage.setItem('userId', response.data.userId);
      fetchUserData(response.data.userId);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  if (!userId) {
    return (
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Mock Trading Platform</h1>
      <p>Current Price: {price ? price.value : 'Loading...'}</p>
      <p>Your Position: {position}</p>
      <p>Your PNL: {pnl}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min="1"
      />
      <button onClick={() => handleOrder('buy')}>Buy</button>
      <button onClick={() => handleOrder('sell')}>Sell</button>
    </div>
  );
}

export default App;