
import { Collaborator } from './types';
import { useFetchCollaborators } from './collaborators/fetchCollaborators';
import { useInviteCollaborator } from './collaborators/inviteCollaborator';
import { useInvitationResponse } from './collaborators/respondToInvitation';
import { useFetchInvitations } from './collaborators/fetchInvitations';
import { useRemoveCollaborator } from './collaborators/removeCollaborator';

export function useCollaboratorApi() {
  const { fetchCollaborators } = useFetchCollaborators();
  const { inviteCollaborator } = useInviteCollaborator();
  const { respondToInvitation } = useInvitationResponse();
  const { fetchPendingInvitations } = useFetchInvitations();
  const { removeCollaborator } = useRemoveCollaborator();

  return {
    fetchCollaborators,
    inviteCollaborator,
    removeCollaborator,
    respondToInvitation,
    fetchPendingInvitations
  };
}
