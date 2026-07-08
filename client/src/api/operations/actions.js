import { gql } from '@apollo/client/core';

export const GET_CLOUDINARY_SIGNATURE = gql`
  query GetCloudinarySignature($folder: String!) {
    getCloudinarySignature(folder: $folder) {
      signature
      timestamp
      apiKey
      folder
    }
  }
`;
