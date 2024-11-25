import type { APIRoute } from 'astro';
import { getProjectData } from '../../../lib/projects';

export const POST: APIRoute = async ({ params, request }) => {
  console.log('API route called with params:', params);

  try {
    const { id } = params;

    // Log the raw request body
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);

    // Parse the body manually
    let password;
    try {
      const bodyData = JSON.parse(rawBody);
      password = bodyData.password;
    } catch (e: any) {
      console.error('Failed to parse request body:', e);
      return new Response(JSON.stringify({
        error: 'Invalid request body',
        details: e.message
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Processing request for project:', id);

    if (!id) {
      console.error('No project ID provided');
      return new Response(JSON.stringify({ error: 'Project ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const projectData = await getProjectData(id, password);
    console.log('Project data retrieved:', projectData ? 'success' : 'not found');

    if (!projectData) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(projectData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({
      error: 'Invalid password or server error',
      details: error.message
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};