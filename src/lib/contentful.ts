import * as contentful from 'contentful';
import * as dotenv from 'dotenv';

import type { Entry, EntryFieldTypes } from "contentful";

dotenv.config();

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
    awards: EntryFieldTypes.RichText
    outcome: EntryFieldTypes.Text
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
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NODE_ENV === 'development'
    ? process.env.CONTENTFUL_PREVIEW_TOKEN!
    : process.env.CONTENTFUL_DELIVERY_TOKEN!,
  host: process.env.NODE_ENV === 'development' ? "preview.contentful.com" : "cdn.contentful.com",
});