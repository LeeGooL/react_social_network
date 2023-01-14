import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { ProfileActionBar } from 'src/components';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: '11.5%',
      left: '11.5%',
      transform: 'translate(-2%, -2%)',
      width: '50%',
      height: '50%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

interface ProfileHeaderProps {
  user: UserDataType;
  mode: 'guest' | 'own' | 'user' | 'friend' | 'request';
  onRequest?: () => void;
  onRevoke?: () => void;
  onRemove?: () => void;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  user: { name, surname, status },
  mode,
  onRequest = () => {},
  onRevoke = () => {},
  onRemove = () => {},
}) => {
  return (
    <>
      <Box>
        <StyledBadge overlap="rectangular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} variant="dot">
          <Avatar alt="" src="/sets/avatar.png" variant="square" sx={{ width: 200, height: 200 }} />
        </StyledBadge>
      </Box>

      <Box flex="0 1 100%">
        <Typography variant="h3" textAlign="center">
          {`${name} ${surname}`}
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          {status}
        </Typography>

        <ProfileActionBar mode={mode} onRequest={onRequest} onRevoke={onRevoke} onRemove={onRemove} />
      </Box>
    </>
  );
};
