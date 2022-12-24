import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export const MainBar = () => (
  <AppBar position="static">
    <Container>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Social network
        </Typography>

        <Button color="inherit">Login</Button>
      </Toolbar>
    </Container>
  </AppBar>
);
