import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainBar } from './components/MainBar';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { UsersPage } from './pages/UsersPage';

export const App: FC = () => (
  <>
    <MainBar />

    <Routes>
      <Route path="*" element={<p>Hello</p>} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="registration" element={<RegistrationPage />} />
    </Routes>
  </>
);
