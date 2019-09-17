import Story from '~/stories'

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

Story('DataTable').add('Basic DataTable', () => (
  <DataTable
    data={narniaData}
    columnDefs={[
      {
        name: 'title',
      },
      {
        name: 'year',
      },
    ]}
  />
))
