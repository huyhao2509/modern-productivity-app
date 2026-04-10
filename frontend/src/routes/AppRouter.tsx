import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App.tsx';
import ProjectsPage from '../pages/ProjectsPage.tsx';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
