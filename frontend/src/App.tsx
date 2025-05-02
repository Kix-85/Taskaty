import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Messages from "./pages/messages";
import "./App.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome Home 🏠</h1>
      <button onClick={() => navigate("/messages")}>Go to Messages</button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  );
}