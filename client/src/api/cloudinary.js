import { apolloClient } from './client';
import { GET_CLOUDINARY_SIGNATURE } from './operations/actions';

const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

function assertUploadConfiguration() {
  if (!cloudinaryCloudName) {
    throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME environment variable.');
  }
}

function getSignaturePayload(data) {
  const payload = data?.getCloudinarySignature;

  if (!payload?.signature || !payload?.timestamp || !payload?.apiKey || !payload?.folder) {
    throw new Error('Cloudinary signature response is incomplete.');
  }

  return payload;
}

export async function uploadImageToCloudinary(file, folder) {
  assertUploadConfiguration();

  const { data } = await apolloClient.query({
    query: GET_CLOUDINARY_SIGNATURE,
    variables: { folder },
    fetchPolicy: 'no-cache',
  });

  const signaturePayload = getSignaturePayload(data);
  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', signaturePayload.apiKey);
  formData.append('timestamp', String(signaturePayload.timestamp));
  formData.append('signature', signaturePayload.signature);
  formData.append('folder', signaturePayload.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error('Cloudinary image upload failed.');
  }

  const uploadResult = await uploadResponse.json();

  if (!uploadResult.secure_url) {
    throw new Error('Cloudinary upload response did not include a secure_url.');
  }

  return uploadResult.secure_url;
}
