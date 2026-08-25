'use client';

import { createContext, useContext, useMemo } from 'react';

const StudioPermissionsContext = createContext({
  role: 'read_only',
  roleLabel: 'read only',
  isReadOnly: true,
  canManageRequests: false,
  canManageInbox: false,
  canManageMentors: false,
  canManageSessions: false,
  canAddNotes: false,
});

export function StudioPermissionsProvider({ member, children }) {
  const value = useMemo(() => {
    const role = member?.role || 'read_only';
    const canCoordinate = role === 'admin' || role === 'coordinator';
    const canEditSessions = canCoordinate || role === 'editor';
    return {
      role,
      roleLabel: role.replaceAll('_', ' '),
      isReadOnly: role === 'read_only' || !member?.is_active,
      canManageRequests: canCoordinate,
      canManageInbox: canCoordinate,
      canManageMentors: canCoordinate,
      canManageSessions: canEditSessions,
      canAddNotes: canCoordinate,
    };
  }, [member]);

  return <StudioPermissionsContext.Provider value={value}>{children}</StudioPermissionsContext.Provider>;
}

export function useStudioPermissions() {
  return useContext(StudioPermissionsContext);
}
