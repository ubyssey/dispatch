import { Schema, arrayOf } from 'normalizr'

export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')

// Article Schema
export const articleSchema = new Schema('articles')

articleSchema.define({
  authors: arrayOf(personSchema)
})

// Image Schema
export const imageSchema = new Schema('images')

imageSchema.define({
  authors: arrayOf(personSchema)
});
