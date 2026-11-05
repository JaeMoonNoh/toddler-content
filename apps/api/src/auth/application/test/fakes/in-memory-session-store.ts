import { SessionStore } from '../../ports/session-store';

export class InMemorySessionStore extends SessionStore {
  readonly sessions = new Map<string, { userId: string; expiresAt: Date }>();

  async create(userId: string, expiresAt: Date): Promise<string> {
    const token = `token-${this.sessions.size + 1}`;
    this.sessions.set(token, { userId, expiresAt });
    return token;
  }

  async userIdOf(token: string, now: Date): Promise<null | string> {
    const session = this.sessions.get(token);
    return session && session.expiresAt > now ? session.userId : null;
  }

  async delete(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async deleteAllOf(userId: string): Promise<void> {
    for (const [token, session] of this.sessions) if (session.userId === userId) this.sessions.delete(token);
  }
}
