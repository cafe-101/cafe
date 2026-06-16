import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify, opts) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  fastify.decorate('supabase', supabase);

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const token = authHeader.replace(/^bearer\s+/i, '');
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error('Unauthorized');
      }

      request.user = user;
    } catch (err) {
      request.log.error(err, 'Authentication failed');
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

export default fp(authPlugin);
