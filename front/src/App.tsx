import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainBar } from './components/MainBar';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';

export const App: FC = () => (
  <>
    <MainBar />

    <Routes>
      <Route path="*" element={<p>Hello</p>} />
      <Route path="login" element={<LoginPage />} />
      <Route path="registration" element={<RegistrationPage />} />
    </Routes>
  </>
);
