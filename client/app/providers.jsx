'use client';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useEffect, useState } from 'react';
import { loadFromStorage } from '../store/slices/authSlice';

function StorageLoader({ setReady }) {
  useEffect(() => {
    store.dispatch(loadFromStorage());
    setReady(true);
  }, []);
  return null;
}

export default function Providers({ children }) {
  const [ready, setReady] = useState(false);

  return (
    <Provider store={store}>
      <StorageLoader setReady={setReady} />
      {ready ? children : null}
    </Provider>
  );
}