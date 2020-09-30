import React, { FormEvent, useState } from 'react';
import Styled from './styled';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'components';
import emailValidator from 'helpers/validators/isValidEmail';
import { Field } from 'helpers/interfaces/Field';
import accountService from 'services/account';
import useResponseMessage from 'helpers/hooks/useResponseMessage';
import ExternalLayout from 'layouts/External';

function SendEmailScreen() {
  const { t } = useTranslation();
  const history = useHistory();
  const { dispatchMessage } = useResponseMessage();

  const [email, setEmail] = useState<Field>({ value: '', isValid: false });
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email.isValid) {
      setLoading(true);

      accountService
        .sendCode(email.value)
        .then(() => {
          setSuccessDialogVisible(true);
        })
        .catch((err) => {
          dispatchMessage(err?.response?.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <ExternalLayout>
      <>
        <Styled.SubTitle>{t('RECOVERY_PASS')}</Styled.SubTitle>

        <Styled.Form onSubmit={handleSubmit}>
          <Styled.Field
            onChangeValue={(field: Field) => setEmail(field)}
            label={t('EMAIL')}
            name="email"
            type="email"
            invalidMessage={t('INVALID_EMAIL')}
            validation={emailValidator}
          />

          <Styled.Submit
            isLoading={isLoading}
            isDisabled={!email.isValid}
            text={t('SEND_CODE_EMAIL')}
            type="submit"
            rounded
          />

          <Styled.BackToLogin
            onClick={() => history.push('/login')}
            outline
            text={t('BACK_LOGIN')}
            rounded
          />
        </Styled.Form>

        <Dialog
          isVisible={successDialogVisible}
          confirmText={t('CONFIRM')}
          message={t('SUCCESS_SEND_EMAIL')}
          onConfirm={() => history.push('/login')}
        />
      </>
    </ExternalLayout>
  );
}

export default SendEmailScreen;