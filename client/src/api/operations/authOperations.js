import { gql } from '@apollo/client/core';

export const SIGN_UP_USER = gql`
  mutation SignUpUser($email: String!, $password: String!, $name: String!, $avatarUrl: String) {
    signupUser(arg1: { email: $email, password: $password, name: $name, avatarUrl: $avatarUrl }) {
      message
      code
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(arg1: { email: $email, password: $password }) {
      message
      code
      token
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(arg1: { email: $email }) {
      message
      code
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($code: String!, $email: String!) {
    verifyEmail(verCode: { code: $code, email: $email }) {
      message
      code
      success
    }
  }
`;

export const RESEND_CODE = gql`
  mutation ResendCode($actionType: String!, $email: String!) {
    resendCode(arg1: {actionType: $actionType, email: $email }) {
      message
      code
    }
  }
`;

export const PASSWORD_RESET = gql`
  mutation PasswordReset(
    $email: String!
    $newPassword: String!
    $confirmNewPassword: String!
    $secretCode: String!
  ) {
    passwordReset(
      input: {
        inputs: {
          email: $email
          newPassword: $newPassword
          confirmNewPassowrd: $confirmNewPassword
          secretCode: $secretCode
        }
      }
    ) {
      message
      code
    }
  }
`;
