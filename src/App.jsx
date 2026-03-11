import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JavaPage from "./pages/JavaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/java" element={<JavaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;