import { createContext, useContext } from 'react';

import { AFService } from '@/application/services/services.type';
import { Role, UserWorkspaceInfo } from '@/application/types';

// Internal context for authentication layer
// This context is only used within the app provider layers
export interface AuthInternalContextType {
  service: AFService | undefined; // Service instance from useService
  userWorkspaceInfo?: UserWorkspaceInfo;
  currentWorkspaceId?: string;
  isAuthenticated: boolean;
  onChangeWorkspace: (workspaceId: string) => Promise<void>;
}

export const AuthInternalContext = createContext<AuthInternalContextType | null>(null);

// Hook to access auth internal context
export function useAuthInternal() {
  const context = useContext(AuthInternalContext);

  if (!context) {
    throw new Error('useAuthInternal must be used within an AuthInternalProvider');
  }

  return context;
}

/**
 * Whether the current user may DELETE content (pages, rows, board groups/fields).
 *
 * SECURITY: deleting content is Owner-only; Members may edit but not delete. This
 * mirrors the Owner enforcement on the server's delete endpoints. Fails closed
 * (returns false) outside an auth context — e.g. publish pages, which have no
 * delete affordances anyway.
 */
export function useCanDeleteContent(): boolean {
  const context = useContext(AuthInternalContext);

  return context?.userWorkspaceInfo?.selectedWorkspace?.role === Role.Owner;
}

/**
 * Whether the current user may MOVE pages between spaces/parents.
 *
 * SECURITY: moving pages is Owner-only; Members may edit but not reorganize the
 * workspace. Mirrors the Owner enforcement on the server's move-page endpoint.
 */
export function useCanMoveContent(): boolean {
  const context = useContext(AuthInternalContext);

  return context?.userWorkspaceInfo?.selectedWorkspace?.role === Role.Owner;
}
