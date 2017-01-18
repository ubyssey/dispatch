import { Schema, arrayOf } from 'normalizr'

export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')
export const topicSchema = new Schema('topics')
export const tagSchema = new Schema('tags')
export const imageSchema = new Schema('images')
export const articleSchema = new Schema('articles')
export const templateSchema = new Schema('templates')

articleSchema.define({
  section: sectionSchema,
  authors: arrayOf(personSchema),
  tags: arrayOf(tagSchema),
  topic: topicSchema,
  template: templateSchema,
  featured_image: {
    image: imageSchema,
  }
})

imageSchema.define({
  authors: arrayOf(personSchema)
})
