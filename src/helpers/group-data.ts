export const groupDataByParam = <T>(data: T[], param: keyof T) =>
  data.reduce(
    (acc, curr) => {
      const key = curr[param] as string
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(curr)
      return acc
    },
    {} as Record<string, T[]>
  )
