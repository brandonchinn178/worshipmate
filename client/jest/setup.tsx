import '@testing-library/jest-dom/extend-expect'
import 'snapshot-diff/extend-expect'

jest.mock('~/ui-kit/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
  }
})
