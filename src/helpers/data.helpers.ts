export const parseUserData = (
  data: Record<string, unknown>
): UserNamespace.Info => {
  return {
    id: String(data.id),
    username: String(data.username),
    email: String(data.email),
  };
};
