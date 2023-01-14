import { CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from 'src/components';
import { useAppSelector } from 'src/redux';
import { useGetRelationshipQuery } from 'src/redux/services/relationship';
import { useGetUserQuery } from 'src/redux/services/users';

export const ProfilePage: FC = () => {
  let params = useParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.session);
  const userId = useMemo(() => {
    if ('userId' in params) return parseInt(params.userId as string, 10);

    if (isAuthenticated) {
      return user.id;
    }

    throw Error("UserId can't be found");
  }, [isAuthenticated, params, user]);

  const {
    data: profile,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
  } = useGetUserQuery(userId, { skip: !userId });
  const {
    data: relationship,
    isLoading: isRelationshipLoading,
    isSuccess: isRelationshipSuccess,
  } = useGetRelationshipQuery(userId, { skip: !userId });

  const mode = useMemo(() => {
    if (!relationship) {
      return 'guest';
    }

    if (relationship.hasRequestFrom) return 'request';
    if (relationship.isFriend) return 'friend';
    if (relationship.isOwn) return 'own';

    return 'user';
  }, [relationship]);

  if (isUserLoading || !isUserSuccess || isRelationshipLoading || !isRelationshipSuccess) {
    return (
      <Container sx={{ pt: 2 }}>
        <Card sx={{ p: 3 }}>
          <CardHeader title="Загрузка. . ." />
          <CardContent sx={{ p: 0, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!profile || !relationship) {
    return (
      <Container sx={{ pt: 2 }}>
        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CardHeader title="Ошибка." />
          <CardContent sx={{ p: 0 }}>
            <Typography>Что-то пошло не так!</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ pt: 2 }}>
      {/* <Card>
        <SideMenu />
      </Card> */}

      <Card sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        {isUserLoading || !isUserSuccess || isRelationshipLoading || !isRelationshipSuccess ? (
          <CircularProgress sx={{ m: 'auto 0' }} />
        ) : (
          <ProfileHeader user={profile} mode={mode} />
        )}
      </Card>
    </Container>
  );
};
