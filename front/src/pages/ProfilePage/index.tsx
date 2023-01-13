import Container from '@mui/material/Container';
import { FC } from 'react';
import { ProfileHeader } from 'src/components';

export const ProfilePage: FC = () => {
  return (
    <Container sx={{ pt: 2 }}>
      {/* <Card>
        <SideMenu />
      </Card> */}

      <ProfileHeader
        user={{
          name: 'Egor',
          surname: 'Burunkov',
          id: 1,
          status: 'мой статус',
          avatar: '',
        }}
        mode="friend"
      />
    </Container>
  );
};
