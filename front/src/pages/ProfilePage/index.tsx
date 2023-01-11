import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { FC } from 'react';
import { SideMenu } from 'src/components';

export const ProfilePage: FC = () => {
  return (
    <Container sx={{ pt: 2 }}>
      <Card>
        <SideMenu />
      </Card>
    </Container>
  );
};
