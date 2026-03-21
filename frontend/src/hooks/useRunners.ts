import { useRunnersContext } from "../context/useRunnersContext";

// Re-export the context hook as the default so all consumers (useContracts etc.)
// share a single BrowserProvider / signer instance, preventing duplicate
// getSigner() calls that cause AppKit to reset the wallet connection.
const useRunners = () => useRunnersContext();

export default useRunners;
