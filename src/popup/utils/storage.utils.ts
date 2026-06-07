/** UTF-8 byte size of a string, as shown in the Size column. */
export function byteSize(value: string): number {
  return new TextEncoder().encode(value).length
}
