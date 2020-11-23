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

export default {
  title: 'DataTable',
  component: DataTable,
  args: {
    data: narniaData,
  },
}

const Template = (args) => <DataTable {...args} />

export const Basic = Template.bind({})
Basic.args = {
  columnDefs: [
    {
      name: 'title',
    },
    {
      name: 'year',
    },
  ],
}

export const CustomHeader = Template.bind({})
CustomHeader.args = {
  columnDefs: [
    {
      name: 'title',
      header: 'Book',
    },
    {
      name: 'year',
      header: 'Publication year',
    },
  ],
}

export const CustomSize = Template.bind({})
CustomSize.args = {
  columnDefs: [
    {
      name: 'title',
    },
    {
      name: 'year',
      size: '200px',
    },
  ],
}

export const CustomRender = Template.bind({})
CustomRender.args = {
  columnDefs: [
    {
      name: 'title',
      render: ({ title }) => <i>{title}</i>,
    },
    {
      name: 'year',
    },
  ],
}
