export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  TimeSignature: [number, number]
}

export type Query = {
  __typename?: 'Query'
  /** Return the currently authenticated user, or null if not authenticated. */
  me?: Maybe<User>
  song?: Maybe<Song>
  songs: Array<Song>
}

export type QuerySongArgs = {
  slug: Scalars['String']
}

export type QuerySongsArgs = {
  query?: Maybe<Scalars['String']>
  filters?: Maybe<SearchFilters>
}

export type Mutation = {
  __typename?: 'Mutation'
  addSong: Song
  updateSong?: Maybe<Song>
}

export type MutationAddSongArgs = {
  data: AddSongInput
}

export type MutationUpdateSongArgs = {
  id: Scalars['ID']
  data: UpdateSongInput
}

export type Song = {
  __typename?: 'Song'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
  artist: Artist
  recommendedKey: Scalars['String']
  timeSignature: Scalars['TimeSignature']
  bpm: Scalars['Int']
  themes: Array<Theme>
}

export type Artist = {
  __typename?: 'Artist'
  id: Scalars['ID']
  slug: Scalars['String']
  name: Scalars['String']
}

export type Theme = {
  __typename?: 'Theme'
  id: Scalars['ID']
  slug: Scalars['String']
  name: Scalars['String']
}

export type SearchFilters = {
  recommendedKey?: Maybe<Scalars['String']>
  bpm?: Maybe<Scalars['Int']>
  timeSignature?: Maybe<Scalars['TimeSignature']>
}

export type AddSongInput = {
  /** If a slug is not provided, a default one will be generated from the title. */
  slug?: Maybe<Scalars['String']>
  title: Scalars['String']
  artist: Scalars['String']
  recommendedKey: Scalars['String']
  timeSignature: Scalars['TimeSignature']
  bpm: Scalars['Int']
}

export type UpdateSongInput = {
  slug?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  artist?: Maybe<Scalars['String']>
  recommendedKey?: Maybe<Scalars['String']>
  timeSignature?: Maybe<Scalars['TimeSignature']>
  bpm?: Maybe<Scalars['Int']>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  name: Scalars['String']
}
