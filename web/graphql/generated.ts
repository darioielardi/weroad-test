import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type CreateTourInput = {
  endingDate: Scalars['DateTime'];
  name: Scalars['String'];
  price: Scalars['Float'];
  startingDate: Scalars['DateTime'];
  travelId: Scalars['String'];
};

export type CreateTravelInput = {
  description: Scalars['String'];
  name: Scalars['String'];
  numberOfDays: Scalars['Int'];
  slug: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTour: Tour;
  createTravel: Travel;
  deleteTravel: Scalars['Boolean'];
  removeTour: Tour;
  updateTour: Tour;
  updateTravel: Travel;
};

export type MutationCreateTourArgs = {
  data: CreateTourInput;
};

export type MutationCreateTravelArgs = {
  data: CreateTravelInput;
};

export type MutationDeleteTravelArgs = {
  id: Scalars['String'];
};

export type MutationRemoveTourArgs = {
  id: Scalars['Int'];
};

export type MutationUpdateTourArgs = {
  data: UpdateTourInput;
};

export type MutationUpdateTravelArgs = {
  data: UpdateTravelInput;
};

export type PaginatedTours = {
  __typename?: 'PaginatedTours';
  hasMore: Scalars['Boolean'];
  items: Array<Tour>;
};

export type PaginatedTravels = {
  __typename?: 'PaginatedTravels';
  hasMore: Scalars['Boolean'];
  items: Array<Travel>;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  tour: Tour;
  toursByTravel: PaginatedTours;
  travel: Travel;
  travels: PaginatedTravels;
};

export type QueryTourArgs = {
  id: Scalars['Int'];
};

export type QueryToursByTravelArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']>;
  dateTo?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  priceFrom?: InputMaybe<Scalars['Int']>;
  priceTo?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ToursSortBy>;
  travelSlug: Scalars['String'];
};

export type QueryTravelArgs = {
  id: Scalars['String'];
};

export type QueryTravelsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
}

export type Tour = {
  __typename?: 'Tour';
  createdAt: Scalars['DateTime'];
  endingDate: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  price: Scalars['Float'];
  startingDate: Scalars['DateTime'];
  travel: Travel;
  updatedAt: Scalars['DateTime'];
};

export enum ToursSortBy {
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC',
}

export type Travel = {
  __typename?: 'Travel';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  name: Scalars['String'];
  numberOfDays: Scalars['Float'];
  slug: Scalars['String'];
  tours: Array<Tour>;
  updatedAt: Scalars['DateTime'];
};

export type UpdateTourInput = {
  endingDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  startingDate?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateTravelInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  numberOfDays?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  role: Role;
  updatedAt: Scalars['DateTime'];
};

export type TravelsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;

export type TravelsQuery = {
  __typename?: 'Query';
  travels: {
    __typename?: 'PaginatedTravels';
    hasMore: boolean;
    items: Array<{
      __typename?: 'Travel';
      id: string;
      name: string;
      slug: string;
      isPublic: boolean;
    }>;
  };
};

export const TravelsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Travels' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'offset' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'travels' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'offset' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'isPublic' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'hasMore' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TravelsQuery, TravelsQueryVariables>;
