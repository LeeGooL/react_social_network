import { FC, useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainBar } from './components';
import { ChatsPage, FriendsPage, LoginPage, ProfilePage, RegistrationPage, SettingsPage, UsersPage } from './pages';
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
        <Route path="/users" element={<UsersPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" replace /> : <LoginPage />} />
        <Route
          path="/registration"
          element={isAuthenticated ? <Navigate to="/profile" replace /> : <RegistrationPage />}
        />

        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <LoginPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
        <Route path="/chats" element={isAuthenticated ? <ChatsPage /> : <Navigate to="/login" replace />} />
        <Route path="/friends" element={isAuthenticated ? <FriendsPage /> : <Navigate to="/login" replace />} />

        <Route path="*" element={isAuthenticated ? <ProfilePage /> : <LoginPage />} />
      </Routes>
    </>
  );
};
