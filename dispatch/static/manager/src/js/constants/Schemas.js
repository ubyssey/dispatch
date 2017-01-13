import { Schema, arrayOf } from 'normalizr'

export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')
export const topicSchema = new Schema('topics')
export const tagSchema = new Schema('tags')
export const imageSchema = new Schema('images')
export const articleSchema = new Schema('articles')

articleSchema.define({
  section: sectionSchema,
  authors: arrayOf(personSchema),
  tags: arrayOf(tagSchema),
  topic: topicSchema,
  featured_image: {
    image: imageSchema,
  }
})

imageSchema.define({
  authors: arrayOf(personSchema)
});
