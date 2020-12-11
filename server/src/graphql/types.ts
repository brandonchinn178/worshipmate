/** AUTO GENERATED. DO NOT MODIFY **/
/* eslint-disable */
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
  ID: number
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * A filter value must be of a type corresponding to the filter name:
   *
   * - RECOMMENDED_KEY: String
   * - BPM: Int
   * - TIME_SIGNATURE: [Int, Int]
   * - THEMES: [String, String, ...]
   */
  FilterValue: unknown
}

export type Query = {
  __typename?: 'Query'
  searchSongs?: Maybe<SongSearchResult>
}

export type QuerySearchSongsArgs = {
  query?: Maybe<Scalars['String']>
  filters?: Maybe<Array<SearchFilter>>
}

export type Song = {
  __typename?: 'Song'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
  recommendedKey: Scalars['String']
  timeSignature: TimeSignature
  bpm: Scalars['Int']
}

export type TimeSignature = {
  __typename?: 'TimeSignature'
  top: Scalars['Int']
  bottom: Scalars['Int']
}

export enum FilterName {
  RECOMMENDED_KEY = 'RECOMMENDED_KEY',
  BPM = 'BPM',
  TIME_SIGNATURE = 'TIME_SIGNATURE',
  THEMES = 'THEMES',
}

export type SearchFilter = {
  name: FilterName
  value: Scalars['FilterValue']
}

export type SongSearchResult = {
  __typename?: 'SongSearchResult'
  songs: Array<Song>
  availableFilters: Array<AvailableFilter>
}

export type AvailableFilter = {
  __typename?: 'AvailableFilter'
  name: FilterName
  options: Array<AvailableFilterValue>
}

export type AvailableFilterValue = {
  __typename?: 'AvailableFilterValue'
  value: Scalars['FilterValue']
  valueDisplay: Scalars['String']
  count: Scalars['Int']
}
