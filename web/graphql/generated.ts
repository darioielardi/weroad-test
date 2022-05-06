import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: string;
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
  id: Scalars['String'];
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
  Editor = 'EDITOR'
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
  PriceDesc = 'PRICE_DESC'
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


export type TravelsQuery = { __typename?: 'Query', travels: { __typename?: 'PaginatedTravels', hasMore: boolean, items: Array<{ __typename?: 'Travel', id: string, name: string, slug: string, isPublic: boolean, numberOfDays: number }> } };

export type TravelQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TravelQuery = { __typename?: 'Query', travel: { __typename?: 'Travel', id: string, name: string, slug: string, description: string, numberOfDays: number, isPublic: boolean } };

export type CreateTravelMutationVariables = Exact<{
  data: CreateTravelInput;
}>;


export type CreateTravelMutation = { __typename?: 'Mutation', createTravel: { __typename?: 'Travel', id: string } };

export type UpdateTravelMutationVariables = Exact<{
  data: UpdateTravelInput;
}>;


export type UpdateTravelMutation = { __typename?: 'Mutation', updateTravel: { __typename?: 'Travel', id: string } };

export type DeleteTravelMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTravelMutation = { __typename?: 'Mutation', deleteTravel: boolean };

export type ToursByTravelQueryVariables = Exact<{
  travelSlug: Scalars['String'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type ToursByTravelQuery = { __typename?: 'Query', toursByTravel: { __typename?: 'PaginatedTours', hasMore: boolean, items: Array<{ __typename?: 'Tour', id: string, name: string, startingDate: string, endingDate: string, price: number }> } };

export type TourQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TourQuery = { __typename?: 'Query', tour: { __typename?: 'Tour', id: string, name: string, startingDate: string, endingDate: string, price: number } };

export type CreateTourMutationVariables = Exact<{
  data: CreateTourInput;
}>;


export type CreateTourMutation = { __typename?: 'Mutation', createTour: { __typename?: 'Tour', id: string } };

export type UpdateTourMutationVariables = Exact<{
  data: UpdateTourInput;
}>;


export type UpdateTourMutation = { __typename?: 'Mutation', updateTour: { __typename?: 'Tour', id: string } };


export const Travels = gql`
    query Travels($limit: Int!, $offset: Int!) {
  travels(limit: $limit, offset: $offset) {
    items {
      id
      name
      slug
      isPublic
      numberOfDays
    }
    hasMore
  }
}
    `;
export const Travel = gql`
    query Travel($id: String!) {
  travel(id: $id) {
    id
    name
    slug
    description
    numberOfDays
    isPublic
  }
}
    `;
export const CreateTravel = gql`
    mutation CreateTravel($data: CreateTravelInput!) {
  createTravel(data: $data) {
    id
  }
}
    `;
export const UpdateTravel = gql`
    mutation UpdateTravel($data: UpdateTravelInput!) {
  updateTravel(data: $data) {
    id
  }
}
    `;
export const DeleteTravel = gql`
    mutation DeleteTravel($id: String!) {
  deleteTravel(id: $id)
}
    `;
export const ToursByTravel = gql`
    query ToursByTravel($travelSlug: String!, $limit: Int!, $offset: Int!) {
  toursByTravel(travelSlug: $travelSlug, limit: $limit, offset: $offset) {
    items {
      id
      name
      startingDate
      endingDate
      price
    }
    hasMore
  }
}
    `;
export const Tour = gql`
    query Tour($id: String!) {
  tour(id: $id) {
    id
    name
    startingDate
    endingDate
    price
  }
}
    `;
export const CreateTour = gql`
    mutation CreateTour($data: CreateTourInput!) {
  createTour(data: $data) {
    id
  }
}
    `;
export const UpdateTour = gql`
    mutation UpdateTour($data: UpdateTourInput!) {
  updateTour(data: $data) {
    id
  }
}
    `;