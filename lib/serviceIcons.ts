// Service icon mapping utility
// Maps normalized service names to their corresponding icon paths

export interface ServiceIcon {
  path: string
  alt: string
  type: 'svg' | 'png'
}

// Normalize service name for consistent matching
export function normalizeServiceName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '') // Remove special characters and spaces
}

// Service icon mapping
const serviceIconMap: Record<string, ServiceIcon> = {
  // Streaming Services
  netflix: {
    path: '/icons/netflix.svg',
    alt: 'Netflix',
    type: 'svg'
  },
  spotify: {
    path: '/icons/spotify.svg',
    alt: 'Spotify',
    type: 'svg'
  },
  disneyplus: {
    path: '/icons/disney-plus.svg',
    alt: 'Disney+',
    type: 'svg'
  },
  disney: {
    path: '/icons/disney-plus.svg',
    alt: 'Disney+',
    type: 'svg'
  },
  hulu: {
    path: '/icons/hulu.svg',
    alt: 'Hulu',
    type: 'svg'
  },
  hbo: {
    path: '/icons/hbo-max.svg',
    alt: 'HBO Max',
    type: 'svg'
  },
  hbomax: {
    path: '/icons/hbo-max.svg',
    alt: 'HBO Max',
    type: 'svg'
  },
  amazonprime: {
    path: '/icons/amazon-prime.svg',
    alt: 'Amazon Prime',
    type: 'svg'
  },
  prime: {
    path: '/icons/amazon-prime.svg',
    alt: 'Amazon Prime',
    type: 'svg'
  },
  apple: {
    path: '/icons/apple-tv.svg',
    alt: 'Apple TV+',
    type: 'svg'
  },
  appletv: {
    path: '/icons/apple-tv.svg',
    alt: 'Apple TV+',
    type: 'svg'
  },
  paramount: {
    path: '/icons/paramount-plus.svg',
    alt: 'Paramount+',
    type: 'svg'
  },
  paramountplus: {
    path: '/icons/paramount-plus.svg',
    alt: 'Paramount+',
    type: 'svg'
  },
  peacock: {
    path: '/icons/peacock.svg',
    alt: 'Peacock',
    type: 'svg'
  },
  crunchyroll: {
    path: '/icons/crunchyroll.svg',
    alt: 'Crunchyroll',
    type: 'svg'
  },
  funimation: {
    path: '/icons/funimation.svg',
    alt: 'Funimation',
    type: 'svg'
  },

  // Music Services
  tidal: {
    path: '/icons/tidal.svg',
    alt: 'Tidal',
    type: 'svg'
  },
  deezer: {
    path: '/icons/deezer.svg',
    alt: 'Deezer',
    type: 'svg'
  },
  applemusic: {
    path: '/icons/apple-music.svg',
    alt: 'Apple Music',
    type: 'svg'
  },
  youtube: {
    path: '/icons/youtube-music.svg',
    alt: 'YouTube Music',
    type: 'svg'
  },
  youtubemusic: {
    path: '/icons/youtube-music.svg',
    alt: 'YouTube Music',
    type: 'svg'
  },

  // Gaming Services
  xbox: {
    path: '/icons/xbox-game-pass.svg',
    alt: 'Xbox Game Pass',
    type: 'svg'
  },
  xboxgamepass: {
    path: '/icons/xbox-game-pass.svg',
    alt: 'Xbox Game Pass',
    type: 'svg'
  },
  playstation: {
    path: '/icons/playstation-plus.svg',
    alt: 'PlayStation Plus',
    type: 'svg'
  },
  psplus: {
    path: '/icons/playstation-plus.svg',
    alt: 'PlayStation Plus',
    type: 'svg'
  },
  nintendo: {
    path: '/icons/nintendo-online.svg',
    alt: 'Nintendo Online',
    type: 'svg'
  },
  nintendoonline: {
    path: '/icons/nintendo-online.svg',
    alt: 'Nintendo Online',
    type: 'svg'
  },
  steam: {
    path: '/icons/steam.svg',
    alt: 'Steam',
    type: 'svg'
  },
  epic: {
    path: '/icons/epic-games.svg',
    alt: 'Epic Games',
    type: 'svg'
  },
  epicgames: {
    path: '/icons/epic-games.svg',
    alt: 'Epic Games',
    type: 'svg'
  },

  // Software & Productivity
  adobe: {
    path: '/icons/adobe-creative-cloud.svg',
    alt: 'Adobe Creative Cloud',
    type: 'svg'
  },
  adobecreativecloud: {
    path: '/icons/adobe-creative-cloud.svg',
    alt: 'Adobe Creative Cloud',
    type: 'svg'
  },
  microsoft: {
    path: '/icons/microsoft-365.svg',
    alt: 'Microsoft 365',
    type: 'svg'
  },
  microsoft365: {
    path: '/icons/microsoft-365.svg',
    alt: 'Microsoft 365',
    type: 'svg'
  },
  office: {
    path: '/icons/microsoft-365.svg',
    alt: 'Microsoft 365',
    type: 'svg'
  },
  figma: {
    path: '/icons/figma.svg',
    alt: 'Figma',
    type: 'svg'
  },
  notion: {
    path: '/icons/notion.svg',
    alt: 'Notion',
    type: 'svg'
  },
  slack: {
    path: '/icons/slack.svg',
    alt: 'Slack',
    type: 'svg'
  },
  zoom: {
    path: '/icons/zoom.svg',
    alt: 'Zoom',
    type: 'svg'
  },
  dropbox: {
    path: '/icons/dropbox.svg',
    alt: 'Dropbox',
    type: 'svg'
  },
  google: {
    path: '/icons/google-workspace.svg',
    alt: 'Google Workspace',
    type: 'svg'
  },
  googleworkspace: {
    path: '/icons/google-workspace.svg',
    alt: 'Google Workspace',
    type: 'svg'
  },

  // Fitness & Health
  peloton: {
    path: '/icons/peloton.svg',
    alt: 'Peloton',
    type: 'svg'
  },
  fitbit: {
    path: '/icons/fitbit.svg',
    alt: 'Fitbit',
    type: 'svg'
  },
  myfitnesspal: {
    path: '/icons/myfitnesspal.svg',
    alt: 'MyFitnessPal',
    type: 'svg'
  },
  headspace: {
    path: '/icons/headspace.svg',
    alt: 'Headspace',
    type: 'svg'
  },
  calm: {
    path: '/icons/calm.svg',
    alt: 'Calm',
    type: 'svg'
  },

  // Food & Delivery
  doordash: {
    path: '/icons/doordash.svg',
    alt: 'DoorDash',
    type: 'svg'
  },
  uber: {
    path: '/icons/uber-eats.svg',
    alt: 'Uber Eats',
    type: 'svg'
  },
  ubereats: {
    path: '/icons/uber-eats.svg',
    alt: 'Uber Eats',
    type: 'svg'
  },
  instacart: {
    path: '/icons/instacart.svg',
    alt: 'Instacart',
    type: 'svg'
  },
  hello: {
    path: '/icons/hello-fresh.svg',
    alt: 'Hello Fresh',
    type: 'svg'
  },
  hellofresh: {
    path: '/icons/hello-fresh.svg',
    alt: 'Hello Fresh',
    type: 'svg'
  },

  // Other Popular Services
  audible: {
    path: '/icons/audible.svg',
    alt: 'Audible',
    type: 'svg'
  },
  kindle: {
    path: '/icons/kindle-unlimited.svg',
    alt: 'Kindle Unlimited',
    type: 'svg'
  },
  kindleunlimited: {
    path: '/icons/kindle-unlimited.svg',
    alt: 'Kindle Unlimited',
    type: 'svg'
  },
  chegg: {
    path: '/icons/chegg.svg',
    alt: 'Chegg',
    type: 'svg'
  },
  grammarly: {
    path: '/icons/grammarly.svg',
    alt: 'Grammarly',
    type: 'svg'
  },
  nordvpn: {
    path: '/icons/nordvpn.svg',
    alt: 'NordVPN',
    type: 'svg'
  },
  expressvpn: {
    path: '/icons/expressvpn.svg',
    alt: 'ExpressVPN',
    type: 'svg'
  },
  lastpass: {
    path: '/icons/lastpass.svg',
    alt: 'LastPass',
    type: 'svg'
  },
  bitwarden: {
    path: '/icons/bitwarden.svg',
    alt: 'Bitwarden',
    type: 'svg'
  }
}

// Get service icon by name
export function getServiceIcon(serviceName: string): ServiceIcon | null {
  const normalizedName = normalizeServiceName(serviceName)
  return serviceIconMap[normalizedName] || null
}

// Get fallback icon for unknown services
export function getFallbackIcon(): ServiceIcon {
  return {
    path: '/icons/default-service.svg',
    alt: 'Service',
    type: 'svg'
  }
}

// Check if service has a specific icon
export function hasServiceIcon(serviceName: string): boolean {
  const normalizedName = normalizeServiceName(serviceName)
  return normalizedName in serviceIconMap
} 