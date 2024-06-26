import { mainnet, polygon, sepolia } from 'wagmi/chains'
import { createConfig, http } from 'wagmi'
import { getDefaultConfig } from 'connectkit';

  export const wagmiConfig = createConfig({
    chains: [mainnet, polygon, sepolia], 
    transports: { 
      // [mainnet.id]: http(), 
      // [polygon.id]: http(), 
      // [sepolia.id]: http(), 
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_ID}`,
      ),      
      [polygon.id]: http(
        `https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_ALCHEMY_ID}`,
      ),
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_ID}`,
      ),
    },
  })

  /*
  // Choose which chains you'd like to show
const connectKitConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, polygon, sepolia],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_ID}`,
      ),      
      [polygon.id]: http(
        `https://polygonzkevm-mainnet.g.alchemy.com/v2${process.env.NEXT_PUBLIC_POLYGON_ALCHEMY_ID}`,
      ),
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_ID}`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "SponsorCoin Exchange",

    // Optional App Info
    appDescription: "SponsorCoin Exchange",
    appUrl: "https://family.com", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);
*/
