import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from 'src/redux/services/users';

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

export const UsersPage = () => {
  const { data: users, isLoading, isSuccess /*,  error */ } = useGetUsersQuery();

  if (isLoading || !isSuccess) {
    return (
      <Container sx={{ p: 2 }}>
        <Card>
          <CardHeader title="Загрузка..." />
          <CardContent sx={{ p: 0 }}>
            <Box justifyContent="center" display="flex">
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!users) {
    return (
      <Container sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography>Что-то пошло не так!</Typography>
            {/* <pre>
              {error &&
                (typeof error === 'string'
                  ? error
                  : 'data' in error
                  ? JSON.stringify(error.data)
                  : 'message' in error
                  ? error.message
                  : 'Что-то не так!')}
            </pre> */}
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 2 }}>
      <Card>
        <CardHeader title="Пользователи:" />

        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }} dense>
            {users && users.length ? (
              users.map(({ id, name, surname, status, avatar }) => (
                <ListItem key={id} sx={{ p: 0 }}>
                  <ListItemButton component={Link} to={`/profile/${id}`}>
                    <ListItemAvatar>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                      >
                        <Avatar src={avatar} variant="rounded" sx={{ width: '40px' }} />
                      </StyledBadge>
                    </ListItemAvatar>
                    <ListItemText primary={`${name} ${surname}`} secondary={status} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box justifyContent="center" display="flex">
                <Typography>
                  Пользователей еще нет. Стань <Link to="/registration">первым</Link>!
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};
