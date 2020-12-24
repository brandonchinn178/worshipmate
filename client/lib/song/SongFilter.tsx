import * as _ from 'lodash'
import styled, { css } from 'styled-components'

import { color, font } from '~/theme'

import {
  ActiveFilters,
  AvailableFilterOptions,
  AvailableFilters,
  FilterHandler,
  FilterNames,
} from './filters'

type SongFilterContext = {
  activeFilters: ActiveFilters
  filterHandler: FilterHandler
}

type SongFilterProps = SongFilterContext & {
  availableFilters: AvailableFilters
}

export function SongFilter({ availableFilters, ...props }: SongFilterProps) {
  return (
    <FilterBox>
      {_.map(availableFilters, (options, name) => (
        <SongFilterSection
          key={name}
          filterName={name as FilterNames}
          filterOptions={options}
          {...props}
        />
      ))}
    </FilterBox>
  )
}

type SongFilterSectionProps<Name extends FilterNames> = SongFilterContext & {
  filterName: Name
  filterOptions: AvailableFilterOptions<Name>
}

function SongFilterSection<Name extends FilterNames>({
  filterName,
  filterOptions,
  activeFilters,
  filterHandler,
}: SongFilterSectionProps<Name>) {
  return (
        <FilterCategory>
          <FilterLabel>{_.startCase(filterName)}</FilterLabel>
          <FilterOptionGrid>
            {filterOptions.map(({ value, valueDisplay, count }) => {
              const isActive =
                filterOptions.length === 1 || activeFilters[filterName] === value
              return (
                <FilterOption
                  active={isActive}
                  key={valueDisplay}
                  onClick={() => {
                    if (isActive) {
                      filterHandler.removeFilter(filterName)
                    } else {
                      filterHandler.addFilter(filterName, value)
                    }
                  }}
                >
                  {valueDisplay} ({count})
                </FilterOption>
              )
            })}
          </FilterOptionGrid>
        </FilterCategory>
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
