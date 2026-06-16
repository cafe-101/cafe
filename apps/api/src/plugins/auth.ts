import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createClient } from '@supabase/supabase-js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: any;
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify, opts) => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  fastify.decorate('supabase', supabase);

  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new Error('No authorization header');
      }
      
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new Error('Unauthorized');
      }

      request.user = user;
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

export default fp(authPlugin);
