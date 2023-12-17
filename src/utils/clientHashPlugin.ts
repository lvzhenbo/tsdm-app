import { registerPlugin } from '@capacitor/core';

export interface ClientHashPlugin {
  getClientHash(options: { value: string }): Promise<{ value: string }>;
}

const ClientHash = registerPlugin<ClientHashPlugin>('ClientHash');

export default ClientHash;
