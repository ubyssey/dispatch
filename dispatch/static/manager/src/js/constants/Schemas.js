import { Schema, arrayOf } from 'normalizr'

export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')
export const topicSchema = new Schema('topics')

// Article Schema
export const articleSchema = new Schema('articles')

articleSchema.define({
  authors: arrayOf(personSchema),
  topic: topicSchema,
  section: sectionSchema
})

// Image Schema
export const imageSchema = new Schema('images')

imageSchema.define({
  authors: arrayOf(personSchema)
});
