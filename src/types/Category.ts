export type Category = {
  name: string
  description: string
  hexColor: string | null
}

export type CategoryNoDescription = Omit<Category, 'description'>

export type CategoryWithHotness = Category & {
  hotness: number
}
