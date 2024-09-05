export const getItemTime = <T extends { timestamp: string }>(item: T): number =>
  new Date(item.timestamp).getTime()
