import { Story } from '@storybook/react'
import { useState } from 'react'

import SearchBar from './SearchBar'

export default {
  title: 'SearchBar',
  component: SearchBar,
  argTypes: {
    initial: {
      table: { disable: true },
    },
    onSubmit: {
      table: { disable: true },
    },
  },
}

const Template: Story<{ initial?: string }> = ({ initial }) => {
  const [result, setResult] = useState(initial)
  return (
    <div>
      <SearchBar initial={initial} onSubmit={setResult} />
      {result && <p style={{ marginTop: '10px' }}>Current search: {result}</p>}
    </div>
  )
}

export const Basic = Template.bind({})

export const WithInitial = Template.bind({})
WithInitial.args = {
  initial: 'start!',
}
