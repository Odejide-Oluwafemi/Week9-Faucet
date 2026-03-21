import { type CaipNetwork, createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { liskSepolia as liskSepoliaTestnet } from "@reown/appkit/networks";


// 1. Get projectId
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID as string;

if (!projectId) {
  throw new Error(
    "VITE_APPKIT_PROJECT_ID is not set. Create a free project at https://cloud.reown.com and add it to your .env file."
  );
}

export const liskSepoliaTestnetNetwork: CaipNetwork = {
  ...liskSepoliaTestnet,
  id: 4202,
  chainNamespace: "eip155",
  caipNetworkId: "eip155:4202",
};

// 2. Set the networks
const networks: [CaipNetwork, ...CaipNetwork[]] = [
  liskSepoliaTestnetNetwork,
];

// 3. Create a metadata object - optional
const metadata = {
  name: "Femi Token DApp",
  description: "week9-faucet-assignment",
  url: "",
  icons: [""],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  allowUnsupportedChain: false,
  allWallets: "SHOW",
  defaultNetwork: liskSepoliaTestnet,
  enableEIP6963: true,
  features: {
    analytics: false,
    allWallets: true,
    email: false,
    socials: [],
  },
});

appkit.switchNetwork(liskSepoliaTestnetNetwork);