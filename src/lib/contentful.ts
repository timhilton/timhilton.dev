import * as contentful from 'contentful';

import type { Entry, EntryFieldTypes } from "contentful";

export interface AboutFields {
  contentTypeId: "home",
  fields: {
    elevatorPitch: EntryFieldTypes.Text
    about: EntryFieldTypes.RichText
  }
}

export type AboutContent = Entry<AboutFields>

export interface PortfolioFields {
  contentTypeId: "portfolioItem",
  fields: {
    project: EntryFieldTypes.Text,
    description: EntryFieldTypes.Text,
    url: EntryFieldTypes.Text,
    tech: EntryFieldTypes.Text[],
    role: EntryFieldTypes.Text,
    demoUrl: EntryFieldTypes.Text,
    imageUrl: EntryFieldTypes.Text,
    isProtected: EntryFieldTypes.Boolean
    password: EntryFieldTypes.Text
  }
}

export interface BlogItem {
  contentTypeId: 'blogPost',
  fields: {
    title: EntryFieldTypes.Text,
    body: EntryFieldTypes.Text
  }
}

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});