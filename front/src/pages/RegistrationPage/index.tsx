import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { isEmail } from '../../utils';

interface FormState {
  email: string;
  name: string;
  surname: string;
  password: string;
  passwordConfirmation: string;
}

export const RegistrationPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    name: '',
    surname: '',
    password: '',
    passwordConfirmation: '',
  });
  const [isValidation, setIsValidation] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

  const areAllFieldsNotEmpty = Object.values(formState).every((item) => item.length);

  const isValidationOkay = useMemo(
    () =>
      isEmail(formState.email) &&
      formState.password.length >= 3 &&
      formState.passwordConfirmation === formState.password,
    [formState],
  );

  const registrationHandler = useCallback(() => {
    console.log({ formState });
  }, [formState]);

  return (
    <Container sx={{ p: 2 }}>
      <Card sx={{ p: 2 }}>
        <CardHeader title="Регистрация нового пользователя" />

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={formState.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, email: e.target.value })}
            {...(isValidation &&
              !isEmail(formState.email) && {
                error: true,
                helperText: 'Не подходит под формат почты',
              })}
          />

          <TextField
            label="имя"
            variant="outlined"
            fullWidth
            required
            type="text"
            value={formState.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, name: e.target.value })}
            {...(isValidation &&
              !formState.name.length && {
                error: !formState.name.length,
                helperText: 'Введите имя',
              })}
          />

          <TextField
            label="фамилия"
            variant="outlined"
            fullWidth
            required
            type="text"
            value={formState.surname}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, surname: e.target.value })}
            {...(isValidation &&
              !formState.surname.length && {
                error: !formState.surname.length,
                helperText: 'Введите фамилию',
              })}
          />

          <FormControl variant="outlined" fullWidth required error={isValidation && formState.password.length < 3}>
            <InputLabel htmlFor="password">Password</InputLabel>

            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, password: e.target.value })}
              value={formState.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />

            {isValidation && formState.password.length < 3 && (
              <FormHelperText id="passwordErrorText">Пароль должен быть длиной не менее 3-х символов</FormHelperText>
            )}
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            required
            error={isValidation && formState.passwordConfirmation !== formState.password}
          >
            <InputLabel htmlFor="passwordConfirmation">Confirm password</InputLabel>

            <OutlinedInput
              id="passwordConfirmation"
              type={showPasswordConfirmation ? 'text' : 'password'}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormState({ ...formState, passwordConfirmation: e.target.value })
              }
              value={formState.passwordConfirmation}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password confirmation visibility"
                    onClick={handleClickShowPasswordConfirmation}
                    edge="end"
                  >
                    {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="confirm password"
            />

            {isValidation && formState.passwordConfirmation !== formState.password && (
              <FormHelperText id="passwordConfirmationErrorText">Пароли должны совпадать</FormHelperText>
            )}
          </FormControl>
        </CardContent>

        <CardActions>
          <Button
            variant="contained"
            fullWidth
            disabled={!areAllFieldsNotEmpty || (isValidation && !isValidationOkay)}
            onClick={() => {
              setIsValidation(true);

              if (isValidationOkay) registrationHandler();
            }}
          >
            Регистрация
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};
