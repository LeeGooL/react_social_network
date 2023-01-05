import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: '10%',
      left: '10%',
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

export const UsersPage = () => {
  return (
    <Container sx={{ p: 2 }}>
      <Card>
        <CardHeader title="Пользователи:" />

        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }} dense>
            {[1, 2, 3].map((item) => (
              <ListItem key={item} sx={{ p: 0 }}>
                <ListItemButton component={Link} to="/users/1">
                  <ListItemAvatar>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                    >
                      <Avatar
                        src="\sets\hair-style-street-fashion-beautiful-girl.jpg"
                        variant="rounded"
                        sx={{ width: '40px' }}
                      />
                    </StyledBadge>
                  </ListItemAvatar>
                  <ListItemText primary="Алексей Данчин" secondary="Мой статус" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};
