// src/pages/api/project/[id].ts
import type { APIRoute } from 'astro';
import { getProjectData } from '../../../lib/projects';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const { password } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Project ID is required' }), {
        status: 400,
      });
    }

    const projectData = await getProjectData(id, password);
    
    if (!projectData) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(projectData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid password or server error' }), {
      status: 401,
    });
  }
};
