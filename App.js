import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './src/routes';

export default function App() {
  return (
    // barStyle faz a Status bar (barra onde tem a bateria e etc) ficar branca
    <> 
    <StatusBar barStyle='light-content' backgroundColor='7D40E7'/> 
    <Routes />
    </> // coloca-se essa chave vazia pois nao pode ter um componente em baxio do outro que nao façam parte do mesmo componente
  );
}


