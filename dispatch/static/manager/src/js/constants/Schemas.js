import { Schema, arrayOf } from 'normalizr'

export const sectionSchema = new Schema('sections')
export const personSchema = new Schema('persons')
export const topicSchema = new Schema('topics')
export const tagSchema = new Schema('tags')
export const imageSchema = new Schema('images')
export const articleSchema = new Schema('articles')
export const pageSchema = new Schema('pages')
export const templateSchema = new Schema('templates')
export const fileSchema = new Schema('files')
export const zoneSchema = new Schema('zones')
export const widgetSchema = new Schema('widgets')

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

pageSchema.define({
  template: templateSchema,
  featured_image: {
    image: imageSchema,
  }
})

imageSchema.define({
  authors: arrayOf(personSchema)
})

zoneSchema.define({
  widget: widgetSchema
})
