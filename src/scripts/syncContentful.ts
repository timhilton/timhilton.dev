import { mkdir, writeFile } from 'fs/promises';

import type { Document } from '@contentful/rich-text-types'
import type { Entry } from 'contentful';
import type { PortfolioFields } from '../lib/contentful.ts';
import { contentfulClient } from '../lib/contentful.ts';
import { createHash } from 'crypto';
import path from 'path';

// Project store types
interface ProjectData {
  title: string;
  description: string;
  tech: string[];
  role: string;
  demoUrl: string;
  url?: string;
  imageUrl: string;
  awards: Document;
}

interface ProtectedProject extends ProjectData {
  passwordHash: string;
}

interface ProjectStore {
  [key: string]: ProjectData | ProtectedProject;
}

function hashPassword(password: string): string {
  return createHash('sha256')
    .update(password)
    .digest('hex');
}

async function syncContentfulToJson() {
  try {
    const entries = await contentfulClient.getEntries<PortfolioFields>({
      content_type: 'portfolioItem',
    });

    const projects: ProjectStore = {};

    entries.items.forEach((entry: Entry<any>) => {
      // Explicitly type the fields after casting
      const fields = entry.fields as {
        project: string;
        description: string;
        url?: string;
        tech: string[];
        role: string;
        demoUrl: string;
        imageUrl: string;
        isProtected: boolean;
        password?: string;
        awards: Document
      };

      const projectData: ProjectData = {
        title: fields.project ?? '',
        description: fields.description ?? '', // Use empty string if missing
        tech: fields.tech ?? [], // Use empty array if missing
        role: fields.role ?? '', // Use empty string if missing
        demoUrl: fields.demoUrl ?? '', // Use empty string if missing
        url: fields.url, // Allow undefined
        imageUrl: fields.imageUrl ?? '', // Use empty string if missing
        awards: fields.awards ?? ''
      };

      const projectId = fields.project.toLowerCase().replace(/\s+/g, '-');

      if (fields.isProtected) {
        if (!fields.password) {
          console.warn(`Warning: Protected project ${projectId} has no password set`);
          return;
        }

        projects[projectId] = {
          ...projectData,
          passwordHash: hashPassword(fields.password),
        };
      } else {
        projects[projectId] = projectData;
      }
    });

    const filePath = path.join(process.cwd(), 'src/data/projects.json');

    // Ensure the 'data' directory exists before writing the file
    const dirPath = path.dirname(filePath);
    try {
      await mkdir(dirPath, { recursive: true }); // Create the directory if it doesn't exist
    } catch (err) {
      console.error('Error creating directory:', err);
      throw err;
    }

    await writeFile(filePath, JSON.stringify(projects, null, 2));

    console.log('Successfully synced Contentful projects to projects.json');
  } catch (error) {
    console.error('Error syncing Contentful data:', error);
    throw error;
  }
}

// Run the sync
syncContentfulToJson();