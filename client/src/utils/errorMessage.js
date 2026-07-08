function readNestedMessage(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if (typeof value.message === 'string') {
    return value.message;
  }

  if (typeof value.error === 'string') {
    return value.error;
  }

  if (value.error && typeof value.error === 'object') {
    return readNestedMessage(value.error);
  }

  return null;
}

export function getFriendlyErrorMessage(error, fallbackMessage) {
  const graphQlError = error?.graphQLErrors?.find((item) => item?.message);
  const extensionMessage = error?.graphQLErrors
    ?.map((item) => readNestedMessage(item?.extensions))
    .find(Boolean);
  const networkMessage = readNestedMessage(error?.networkError);

  return (
    extensionMessage ||
    graphQlError?.message ||
    networkMessage ||
    error?.message ||
    fallbackMessage
  );
}
