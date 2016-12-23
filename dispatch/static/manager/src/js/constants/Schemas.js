import { Schema, arrayOf } from 'normalizr'

export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')
export const topicSchema = new Schema('topics')
export const tagSchema = new Schema('tags')

// Article Schema
export const articleSchema = new Schema('articles')

articleSchema.define({
  section: sectionSchema,
  authors: arrayOf(personSchema),
  tags: arrayOf(tagSchema),
  topic: topicSchema
})

// Image Schema
export const imageSchema = new Schema('images')

imageSchema.define({
  authors: arrayOf(personSchema)
});
