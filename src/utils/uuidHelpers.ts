export const UUID_PREFIXES = {
  POS: 'pos-',
  CUSTOMER: 'cust-',
  ORDER: 'ord-',
  // Add other prefixes here as needed
} as const;

export type UuidPrefix = keyof typeof UUID_PREFIXES;

/**
 * Strips any known prefix from a prefixed UUID string
 * @param prefixedId - The UUID that might have a prefix (e.g., "pos-1234...")
 * @returns The clean UUID without any prefix
 */
export function stripUuidPrefix(prefixedId: string): string {
  if (!prefixedId) return prefixedId;
  
  // Check for all known prefixes
  for (const prefix of Object.values(UUID_PREFIXES)) {
    if (prefixedId.startsWith(prefix)) {
      return prefixedId.slice(prefix.length);
    }
  }
  
  return prefixedId;
}

/**
 * Generates a new UUID with the specified prefix
 * @param prefix - The prefix to add (e.g., "POS" for "pos-")
 * @returns A new UUID with the prefix
 */
export function generatePrefixedUuid(prefix: UuidPrefix): string {
  const uuid = uuidv4();
  return `${UUID_PREFIXES[prefix]}${uuid}`;
}

/**
 * Adds a prefix to a clean UUID
 * @param uuid - The clean UUID without prefix
 * @param prefix - The prefix to add (e.g., "pos-")
 * @returns The UUID with the prefix added
 */
export function addUuidPrefix(uuid: string, prefix: string): string {
  if (!uuid) return uuid;
  return `${prefix}${uuid}`;
}

/**
 * Validates if a string is a valid UUID (with or without known prefixes)
 * @param str - The string to validate
 * @returns boolean indicating if it's a valid UUID after prefix removal
 */
export function isValidUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const cleanUuid = stripUuidPrefix(str);
  return uuidRegex.test(cleanUuid);
}
