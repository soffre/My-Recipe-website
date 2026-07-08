import { gql } from '@apollo/client/core';

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes(order_by: { created_at: desc }) {
      id
      title
      description
      image_url
      author_id
      author {
        id
        name
        avatar_url
      }
    }
  }
`;
