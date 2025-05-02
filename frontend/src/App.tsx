import { Routes, Route } from 'react-router';
import AuthPage from './pages/authPage';

function App() {
  return (
    <Routes>
      <Route path="/authPage/:auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
