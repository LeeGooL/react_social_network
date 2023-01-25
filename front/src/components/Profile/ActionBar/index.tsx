import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { FC } from 'react';

interface ProfileActionBarProps {
  mode: 'guest' | 'own' | 'user' | 'friend' | 'request';
  onRequest: () => void;
  onRevoke: () => void;
  onRemove: () => void;
  isLoading: boolean;
}

export const ProfileActionBar: FC<ProfileActionBarProps> = ({ mode, onRequest, onRevoke, onRemove, isLoading }) => {
  if (mode === 'guest' || mode === 'own') return null;

  console.log({ mode });

  return (
    <Box display="flex" justifyContent="center" marginTop={2}>
      {mode === 'friend' && (
        <ButtonGroup variant="contained" size="small">
          <Button>написать сообщение</Button>
          <LoadingButton
            loading={isLoading}
            color="secondary"
            variant="contained"
            onClick={onRemove}
          >
            <span>удалить из друзей</span>
          </LoadingButton>
        </ButtonGroup>
      )}

      {mode === 'user' && (
        <LoadingButton loading={isLoading} color="primary" variant="contained" size="small" onClick={onRequest}>
          <span>добавить в друзья</span>
        </LoadingButton>
      )}

      {mode === 'request' && (
        <LoadingButton loading={isLoading} color="secondary" variant="contained" size="small" onClick={onRevoke}>
          <span>отозвать запрос</span>
        </LoadingButton>
      )}
    </Box>
  );
};
