import { storiesOf } from '@storybook/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import theme from '~/theme'

import DataTable from './DataTable'

const narniaData = [
  {
    title: 'The Lion, the Witch, and the Wardrobe',
    year: 1950,
  },
  {
    title: 'Prince Caspian',
    year: 1951,
  },
  {
    title: 'The Voyage of the Dawn Treader',
    year: 1952,
  },
  {
    title: 'The Silver Chair',
    year: 1953,
  },
  {
    title: 'The Horse and His Boy',
    year: 1954,
  },
  {
    title: "The Magician's Nephew",
    year: 1955,
  },
  {
    title: 'The Last Battle',
    year: 1956,
  },
]

const narniaColumnDefs = [
  {
    name: 'title',
  },
  {
    name: 'year',
  },
]

storiesOf('DataTable', module).add('Basic DataTable', () => (
  <ThemeProvider theme={theme}>
    <>
      <h1>Basic DataTable</h1>
      <DataTable data={narniaData} columnDefs={narniaColumnDefs} />
    </>
  </ThemeProvider>
))
