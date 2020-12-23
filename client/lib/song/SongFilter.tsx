import _ from 'lodash'
import styled, { css } from 'styled-components'

import { ActiveFilters } from '~/router/filters'
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
  activeFilters: ActiveFilters
  addFilter: (key: string, value: string) => void
  removeFilter: (key: string) => void
}

export function SongFilter({
  filters,
  activeFilters,
  addFilter,
  removeFilter,
}: SongFilterProps) {
  return (
    <FilterBox>
      {filters.map(({ key, options }) => (
        <FilterCategory key={key}>
          <FilterLabel>{_.startCase(key)}</FilterLabel>
          <FilterOptionGrid>
            {options.map(({ name, count }) => {
              const isActive =
                options.length === 1 || activeFilters[key] === name
              return (
                <FilterOption
                  active={isActive}
                  key={name}
                  onClick={() => {
                    if (isActive) {
                      removeFilter(key)
                    } else {
                      addFilter(key, name)
                    }
                  }}
                >
                  {name} ({count})
                </FilterOption>
              )
            })}
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

const FilterOption = styled.div<{ active: boolean }>`
  margin: 2px;
  padding: 5px 10px;

  font-weight: bold;

  border: 2px solid ${color('black')};
  border-radius: 3px;
  cursor: pointer;

  ${(p) =>
    p.active &&
    css`
      color: ${color('white')};
      background: ${color('darkTeal')};
    `}
`
