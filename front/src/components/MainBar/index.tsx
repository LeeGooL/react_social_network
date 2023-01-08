import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export interface MainBarProps {
  isAuthenticated: boolean;
  onSignout: () => void;
}

export const MainBar: FC<MainBarProps> = ({ isAuthenticated, onSignout }) => (
  <AppBar position="static">
    <Container>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Social network
        </Typography>

        <Button component={Link} to="/users" color="inherit">
          Users
        </Button>

        {isAuthenticated ? (
          <Button color="inherit" onClick={onSignout}>
            Logout
          </Button>
        ) : (
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </Container>
  </AppBar>
);
