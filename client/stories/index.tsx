import { StoryApi } from '@storybook/addons'
import { storiesOf } from '@storybook/react'
import { ReactElement } from 'react'

export const Story = (name: string): StoryApi<ReactElement> =>
  storiesOf(name, module)
