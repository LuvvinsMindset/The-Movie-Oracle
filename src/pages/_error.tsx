import { NextPage } from 'next';
import ErrorMessage from '@/error-handling/ErrorMessage';

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode, message }) => {
  return <ErrorMessage statusCode={statusCode} message={message} />;
};

const notFoundStatusCode = 404;

ErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = err?.statusCode ?? res?.statusCode ?? notFoundStatusCode;
  const message =
    err?.message ??
    res?.statusMessage ??
    (statusCode === notFoundStatusCode ? 'Not Found' : undefined);
  return { statusCode, message };
};

export default ErrorPage;
