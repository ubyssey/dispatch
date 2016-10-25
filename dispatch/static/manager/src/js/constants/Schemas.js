import { Schema, arrayOf } from 'normalizr'

export const articleSchema = new Schema('articles')
export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')

// Image Schema
export const imageSchema = new Schema('images')

imageSchema.define({
  authors: arrayOf(personSchema)
});
