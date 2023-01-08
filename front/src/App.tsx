import { FC, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainBar } from './components/MainBar';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { UsersPage } from './pages/UsersPage';
import { useAppDispatch, useAppSelector } from './redux';
import { signout } from './redux/slices/session';

export const App: FC = () => {
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.session);

  const onSignout = useCallback(() => {
    dispatch(signout());
  }, [dispatch]);

  return (
    <>
      <MainBar isAuthenticated={isAuthenticated} onSignout={onSignout} />

      <Routes>
        <Route path="*" element={<p>Hello</p>} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registration" element={<RegistrationPage />} />
      </Routes>
    </>
  );
};
