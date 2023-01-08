import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { ChangeEvent, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlag } from 'src/hooks/useFlag';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { signin } from 'src/redux/slices/session';
import { isEmail } from 'src/utils';

export const LoginPage = () => {
  const dispatch = useAppDispatch();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const logApi = useFlag();

  const { isLoadingSignIn } = useAppSelector((state) => state.session);

  const signinHandler = useCallback(() => {
    dispatch(signin(formState))
      .unwrap()
      .catch((error) => {
        logApi.up();
        setError(
          typeof error === 'string'
            ? error
            : 'data' in error
            ? JSON.stringify(error.data)
            : 'message' in error
            ? error.message
            : 'Что-то не так!',
        );
      })
      .finally(() => setFormState((state) => ({ ...state, password: '' })));
  }, [dispatch, formState, logApi]);

  return (
    <Container sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Card
          sx={{
            width: '50%',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <CardMedia
            component="img"
            image="/sets/earth-and-galaxy-elements-of-this-image-furnished-by-nasa.jpg"
            alt="Live from space album cover"
          />
        </Card>

        <Card
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              signinHandler();
            }
          }}
        >
          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="email"
              variant="outlined"
              value={formState.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormState((state) => ({ ...state, email: e.target.value }))
              }
              fullWidth
              type="text"
              disabled={isLoadingSignIn}
            />

            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>

              <OutlinedInput
                id="password"
                type={isShowPassword ? 'text' : 'password'}
                value={formState.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormState((state) => ({ ...state, password: e.target.value }))
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setIsShowPassword((isShowen) => !isShowen)}
                      edge="end"
                    >
                      {isShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                disabled={isLoadingSignIn}
              />
            </FormControl>

            <Collapse in={logApi.flag}>
              <Alert severity="error" onClose={logApi.down}>
                <AlertTitle>Error</AlertTitle>
                <pre>{error}</pre>
              </Alert>
            </Collapse>
          </CardContent>

          <CardActions sx={{ pl: 3, pr: 3, display: 'flex', flexDirection: 'column' }}>
            <LoadingButton
              loading={isLoadingSignIn}
              loadingPosition="end"
              fullWidth
              variant="contained"
              disabled={Object.values(formState).some((value) => !value.length) || !isEmail(formState.email)}
              onClick={signinHandler}
            >
              Регистрация
            </LoadingButton>

            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              или <Link to="/registration">зарегистрируйтесь</Link>
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};
