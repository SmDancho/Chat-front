import { MainPage } from './pages/main';
import { Auth } from './components/Auth';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<Auth />} />
      <Route path={'/mails'} element={<MainPage />} />
    </Routes>
  );
}

export default App;
