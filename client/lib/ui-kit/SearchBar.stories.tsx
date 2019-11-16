import { useState } from 'react'

import { Story } from '~stories'

import SearchBar from './SearchBar'

function SearchStory({ initial }: { initial?: string }) {
  const [result, setResult] = useState(initial)

  return (
    <div>
      <SearchBar initial={initial} onSubmit={setResult} />
      {result && <p style={{ marginTop: '10px' }}>Current search: {result}</p>}
    </div>
  )
}

Story('SearchBar')
  .add('Search test', () => <SearchStory />)
  .add('With initial', () => <SearchStory initial="start!" />)
