/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A helper for when you need an object, but you don't care about
 * the contents of the object.
 */
export const mkMock = (): any => new Proxy({}, { get: () => mkMock() })
