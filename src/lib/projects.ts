import { readFile, writeFile } from 'fs/promises';

// src/lib/projects.ts
import { createHash } from 'crypto';
import path from 'path';

interface ProjectData {
  description: string;
  tech: string[];
  role: string;
  demoUrl: string;
  slug?: string;
}

interface ProtectedProject extends ProjectData {
  passwordHash: string;
}

interface ProjectStore {
  [key: string]: ProjectData | ProtectedProject;
}

// Secure hash function using SHA-256
function hashPassword(password: string): string {
  return createHash('sha256')
    .update(password)
    .digest('hex');
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

export async function getProjectData(
  projectId: string,
  password?: string
): Promise<ProjectData | null> {
  try {
    const projects = await loadProjects();
    const project = projects[projectId];

    if (!project) {
      return null;
    }

    // Check if project is protected
    if ('passwordHash' in project) {
      // If no password provided for protected project
      if (!password) {
        throw new Error('Password required');
      }

      // Verify password
      const hashedPassword = hashPassword(password);
      if (!secureCompare(hashedPassword, project.passwordHash)) {
        throw new Error('Invalid password');
      }

      // Return project data without the password hash
      const { passwordHash, ...projectData } = project;
      return projectData;
    }

    // Return unprotected project data
    return project;
  } catch (error) {
    console.error('Error getting project data:', error);
    throw error;
  }
}

// Utility function to add a new project (for admin use)
export async function addProject(
  projectId: string,
  projectData: ProjectData,
  password?: string
): Promise<void> {
  try {
    const projects = await loadProjects();

    if (password) {
      const passwordHash = hashPassword(password);
      projects[projectId] = {
        ...projectData,
        passwordHash,
      };
    } else {
      projects[projectId] = projectData;
    }

    // Save updated projects
    const filePath = path.join(process.cwd(), 'src/data/projects.json');
    await writeFile(filePath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
}
