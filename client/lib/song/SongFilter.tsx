import _ from 'lodash'
import styled from 'styled-components'

import { color, font } from '~/theme'

type FilterOption = {
  name: string
  count: number
}

type Filter = {
  key: string
  options: readonly FilterOption[]
}

type SongFilterProps = {
  filters: readonly Filter[]
}

export default function SongFilter({ filters }: SongFilterProps) {
  return (
    <FilterBox>
      {filters.map(({ key, options }) => (
        <FilterCategory key={key}>
          <FilterLabel>{_.startCase(key)}</FilterLabel>
          <FilterOptionGrid>
            {options.map(({ name, count }) => (
              <FilterOption key={name}>
                {name} ({count})
              </FilterOption>
            ))}
          </FilterOptionGrid>
        </FilterCategory>
      ))}
    </FilterBox>
  )
}

const FilterBox = styled.div`
  padding: 20px;

  border: 1px solid ${color('black')};
  box-shadow: 0 0 4px ${color('lightGray')};
`

const FilterCategory = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const FilterLabel = styled.h1`
  ${font('label')}
  color: ${color('darkTeal')};
  font-size: 1.5em;
`

const FilterOptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const FilterOption = styled.div`
  margin: 2px;
  padding: 3px 7px;

  font-weight: bold;

  border: 1px solid ${color('black')};
  border-radius: 3px;
`
