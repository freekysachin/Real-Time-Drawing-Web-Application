import React from "react";
import Main from './components/Canvas/Main'
import Header from './components/Header/Header'

function App() {
  return (
   <div className="flex flex-col h-screen p-0">
      <Header />
      <Main />
   </div>
  );
}

export default App;
