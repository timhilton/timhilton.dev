import { readFile, writeFile } from 'fs/promises';

import type { Document } from '@contentful/rich-text-types';
import { createHash } from 'crypto';
import path from 'path';

// Define more specific interfaces for better type safety
export interface BaseProjectData {
  title: string;
  description: string;
  tech: string[];
  role: string;
  demoUrl: string;
  url?: string;
  imageUrl: string;
  isProtected: boolean;
  awards: Document;
}

export interface PublicProject extends BaseProjectData {
  id: string;
  isProtected: false;
}

export interface ProtectedProject extends BaseProjectData {
  id: string;
  isProtected: true;
  passwordHash: string;
}

export interface ProtectedProjectResponse extends Omit<ProtectedProject, 'passwordHash'> {}

export type Project = PublicProject | ProtectedProject;

// Define the raw data structure as it exists in projects.json
interface RawProjectData {
  title: string;
  description: string;
  tech: string[];
  role: string;
  demoUrl: string;
  url?: string;
  imageUrl: string;
  awards: Document;
}

interface RawProtectedProjectData extends RawProjectData {
  passwordHash: string;
}

interface ProjectStore {
  [key: string]: RawProjectData | RawProtectedProjectData;
}

// Secure hash function using SHA-256
function hashPassword(password: string): string {
  const hash = createHash('sha256')
    .update(password)
    .digest('hex');
  return hash;
}

// Compare password hash securely (constant-time comparison)
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Type guard to check if a project is protected
function isProtectedProject(project: RawProjectData | RawProtectedProjectData): project is RawProtectedProjectData {
  return 'passwordHash' in project;
}

// Load projects from JSON file
async function loadProjects(): Promise<ProjectStore> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading projects:', error);
    return {};
  }
}

// Get all projects with basic info (no protected data)
export async function getAllProjects(): Promise<Project[]> {
  const projects = await loadProjects();
  
  return Object.entries(projects).map(([id, data]) => {
    const baseProject = {
      id,
      title: data.title,
      description: data.description,
      tech: data.tech,
      role: data.role,
      demoUrl: data.demoUrl,
      url: data.url,
      imageUrl: data.imageUrl,
      awards: data.awards
    };

    if (isProtectedProject(data)) {
      return {
        ...baseProject,
        isProtected: true,
      } as ProtectedProject;
    }

    return {
      ...baseProject,
      isProtected: false,
    } as PublicProject;
  });
}

// Get single project data (with password verification for protected projects)
export async function getProjectData(
  projectId: string,
  password?: string
): Promise<Project | null> {
  try {
    const projects = await loadProjects();
    const projectData = projects[projectId];

    if (!projectData) {
      return null;
    }

    const baseProject = {
      id: projectId,
      title: projectData.title,
      description: projectData.description,
      tech: projectData.tech,
      role: projectData.role,
      demoUrl: projectData.demoUrl,
      url: projectData.url,
      imageUrl: projectData.imageUrl,
      awards: projectData.awards
    };

    // Check if project is protected
    if (isProtectedProject(projectData)) {
      // If no password provided for protected project
      if (!password) {
        throw new Error('Password required');
      }

      // Verify password
      const hashedPassword = hashPassword(password);

      if (!secureCompare(hashedPassword, projectData.passwordHash)) {
        throw new Error('Invalid password');
      }

      // Return protected project data without the password hash
      return {
        ...baseProject,
        isProtected: true,
      } as ProtectedProject;
    }

    // Return unprotected project data
    return {
      ...baseProject,
      isProtected: false,
    } as PublicProject;
  } catch (error) {
    throw error;
  }
}

// Utility function to add a new project (for admin use)
export async function addProject(
  projectId: string,
  projectData: Omit<BaseProjectData, 'isProtected'>,
  password?: string
): Promise<void> {
  try {
    const projects = await loadProjects();
    const baseProject: RawProjectData = {
      title: projectData.title,
      description: projectData.description,
      tech: projectData.tech,
      role: projectData.role,
      demoUrl: projectData.demoUrl,
      url: projectData.url,
      imageUrl: projectData.imageUrl,
      awards: projectData.awards
    };

    if (password) {
      projects[projectId] = {
        ...baseProject,
        passwordHash: hashPassword(password),
      };
    } else {
      projects[projectId] = baseProject;
    }

    // Save updated projects
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    await writeFile(filePath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
}
