/* TODO: this file should be autogenerated by graphql-code-generator */

export type SearchSongsQuery = {
  songs: ReadonlyArray<{
    slug: string
    title: string
    artist: string
    themes: ReadonlyArray<string>
    recommendedKey: string
    timeSignature: [number, number]
    bpm: number
  }>
  filters: ReadonlyArray<{
    key: string
    options: ReadonlyArray<{
      name: string
      count: number
    }>
  }>
}

type SearchSongsQueryVariables = {
  search: string
}

export const useSearchSongs = ({
  variables: { search },
}: {
  variables: SearchSongsQueryVariables
}) => {
  const allSongs = [
    {
      slug: 'blessed-be-your-name',
      title: 'Blessed Be Your Name',
      artist: 'Matt Redman',
      themes: ['Praise', 'Worship', 'Devotion'],
      recommendedKey: 'A',
      timeSignature: [4, 4] as [number, number],
      bpm: 140,
    },
    {
      slug: 'build-my-life',
      title: 'Build My Life',
      artist: 'Housefires',
      themes: ['Worship', 'Love', 'Witness'],
      recommendedKey: 'E',
      timeSignature: [4, 4] as [number, number],
      bpm: 68,
    },
    {
      slug: 'ever-be',
      title: 'Ever Be',
      artist: 'Bethel Music',
      themes: ['Faithfulness', 'Worship'],
      recommendedKey: 'E',
      timeSignature: [4, 4] as [number, number],
      bpm: 72,
    },
    {
      slug: 'give-me-faith',
      title: 'Give Me Faith',
      artist: 'Elevation Worship',
      themes: ['Faith', 'Surrender', 'Comfort'],
      recommendedKey: 'G',
      timeSignature: [4, 4] as [number, number],
      bpm: 78,
    },
    {
      slug: 'here-i-am-to-worship',
      title: 'Here I Am to Worship',
      artist: 'Michael W. Smith',
      themes: ['Worship'],
      recommendedKey: 'D',
      timeSignature: [4, 4] as [number, number],
      bpm: 72,
    },
    {
      slug: 'i-could-sing-of-your-love-forever',
      title: 'I Could Sing of Your Love Forever',
      artist: 'Delirious?',
      themes: ['Worship', 'Love'],
      recommendedKey: 'E',
      timeSignature: [4, 4] as [number, number],
      bpm: 72,
    },
    {
      slug: "they'll-know-we-are-christians-by-our-love",
      title: "They'll Know We Are Christians by Our Love",
      artist: 'Peter Scholtes',
      themes: ['Love', 'Outreach', 'Unity'],
      recommendedKey: 'Em',
      timeSignature: [4, 4] as [number, number],
      bpm: 80,
    },
  ]

  return {
    data: {
      songs: allSongs.filter(({ title }) =>
        title.match(new RegExp(search, 'i')),
      ),
      filters: [
        {
          key: 'recommendedKey',
          options: [
            { name: 'A', count: 1 },
            { name: 'E', count: 3 },
            { name: 'G', count: 1 },
            { name: 'D', count: 1 },
            { name: 'Em', count: 1 },
          ],
        },
        {
          key: 'bpm',
          options: [
            { name: '68', count: 1 },
            { name: '72', count: 3 },
            { name: '78', count: 1 },
            { name: '80', count: 1 },
            { name: '140', count: 1 },
          ],
        },
        {
          key: 'timeSignature',
          options: [{ name: '4/4', count: 7 }],
        },
        {
          key: 'themes',
          options: [
            { name: 'Comfort', count: 1 },
            { name: 'Devotion', count: 1 },
            { name: 'Faith', count: 1 },
            { name: 'Faithfulness', count: 1 },
            { name: 'Love', count: 3 },
            { name: 'Outreach', count: 1 },
            { name: 'Praise', count: 1 },
            { name: 'Surrender', count: 1 },
            { name: 'Unity', count: 1 },
            { name: 'Witness', count: 1 },
            { name: 'Worship', count: 5 },
          ],
        },
      ],
    } as SearchSongsQuery,
  }
}
