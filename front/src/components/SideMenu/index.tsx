import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

export const SideMenu = () => {
  return (
    <nav aria-label="main mailbox folders">
      <List>
        <ListItem disablePadding dense>
          <ListItemButton component={Link} to="/profile">
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Моя страница" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding dense>
          <ListItemButton component={Link} to="/friends">
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Друзья" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding dense>
          <ListItemButton component={Link} to="/chats">
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="Мои сообщения" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding dense>
          <ListItemButton component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Мои настройки" />
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  );
};
