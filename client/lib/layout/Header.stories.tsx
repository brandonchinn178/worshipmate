import { Story } from '@storybook/react'

import { Header, HeaderProps } from './Header'

export default {
  title: 'Header',
  component: Header,
}

const Template: Story<HeaderProps> = (args) => <Header {...args} />

export const StandardHeader = Template.bind({})
