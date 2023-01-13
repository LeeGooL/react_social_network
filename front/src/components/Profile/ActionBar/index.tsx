import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FC } from 'react';

interface ProfileActionBarProps {
  mode: 'guest' | 'own' | 'user' | 'friend' | 'request';
  onRequest: () => void;
  onRevoke: () => void;
  onRemove: () => void;
}

export const ProfileActionBar: FC<ProfileActionBarProps> = ({ mode, onRequest, onRevoke, onRemove }) => {
  if (mode === 'guest' || mode === 'own') return null;

  return (
    <Box display="flex" justifyContent="center" marginTop={2}>
      {mode === 'friend' && (
        <ButtonGroup variant="contained" size="small">
          <Button>написать сообщение</Button>
          <Button color="secondary" onClick={onRemove}>
            удалить из друзей
          </Button>
        </ButtonGroup>
      )}

      {mode === 'user' && (
        <Button color="primary" variant="contained" size="small" onClick={onRequest}>
          добавить в друзья
        </Button>
      )}

      {mode === 'request' && (
        <Button color="secondary" variant="contained" size="small" onClick={onRevoke}>
          отозвать запрос
        </Button>
      )}
    </Box>
  );
};
