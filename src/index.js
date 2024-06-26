import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';

import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { Ways } from './components/utils/Ways';
import { Store } from './stores/store';
const store = new Store();

export const Context = createContext({store});
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <>

    <Context.Provider value={{store}}>
      <ChakraProvider toastOptions={{
        defaultOptions: {
          position: 'top',
          duration: 5000,
          isClosable: true
        }
      }}>
        <Ways/>
      </ChakraProvider>
    </Context.Provider>

  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
