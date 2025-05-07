import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SuperheroList from "./components/HeroList/SuperheroList";
import SuperheroDetails from "./components/HeroDetails/SuperheroDetails";
import SuperheroForm from "./components/HeroForm/SuperheroForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SuperheroList />} />
          <Route path="/superhero/:id" element={<SuperheroDetails />} />
          <Route path="/add" element={<SuperheroForm />} />
          <Route path="/edit/:id" element={<SuperheroForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
