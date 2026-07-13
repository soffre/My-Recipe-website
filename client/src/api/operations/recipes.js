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

export const CREATE_RECIPE_MUTATION = gql`
  mutation CreateRecipe(
    $title: String!
    $description: String!
    $prepTime: Int!
    $cookTime: Int!
    $servings: Int!
    $cuisine: String!
    $thumbnailUrl: String!
    $images: [String!]!
    $ingredients: [Recipe_Ingredient_Insert_Input!]!
    $instructions: [Recipe_Instruction_Insert_Input!]!
  ) {
    insert_Recipes_one(
      object: {
        title: $title
        description: $description
        prep_time: $prepTime
        cook_time: $cookTime
        servings: $servings
        cuisine: $cuisine
        thumbnail_url: $thumbnailUrl
        image_gallery: $images
        ingredients: { data: $ingredients }
        instructions: { data: $instructions }
      }
    ) {
      id
      title
    }
  }
`;