// Mock data for frontend-only / demo mode

export const MOCK_SERVERS = [
  {
    id: "abc123",
    internalId: 1,
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    name: "Survival SMP",
    description: "Main survival server",
    status: null,
    isSuspended: false,
    isInstalling: false,
    limits: { memory: 4096, disk: 10240, cpu: 200 },
    featureLimits: { databases: 2, allocations: 3, backups: 5 },
    sftpDetails: { ip: "node1.shreecloud.com", port: 2022 },
    node: "Node-01",
    allocation: { ip: "192.168.1.10", port: 25565 },
  },
  {
    id: "def456",
    internalId: 2,
    uuid: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Creative Build",
    description: "Creative building server",
    status: null,
    isSuspended: false,
    isInstalling: false,
    limits: { memory: 2048, disk: 5120, cpu: 100 },
    featureLimits: { databases: 1, allocations: 1, backups: 3 },
    sftpDetails: { ip: "node2.shreecloud.com", port: 2022 },
    node: "Node-02",
    allocation: { ip: "192.168.1.11", port: 25566 },
  },
  {
    id: "ghi789",
    internalId: 3,
    uuid: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    name: "Minigames Hub",
    description: "Minigames and events",
    status: "starting",
    isSuspended: false,
    isInstalling: false,
    limits: { memory: 8192, disk: 20480, cpu: 400 },
    featureLimits: { databases: 4, allocations: 5, backups: 10 },
    sftpDetails: { ip: "node1.shreecloud.com", port: 2022 },
    node: "Node-01",
    allocation: { ip: "192.168.1.12", port: 25567 },
  },
];

export const MOCK_CONSOLE_LOGS = [
  { time: "10:32:01", level: "info", message: "[Server] Starting Minecraft server version 1.20.4" },
  { time: "10:32:03", level: "info", message: "[Server] Loading properties..." },
  { time: "10:32:03", level: "info", message: "[Server] Default game type: SURVIVAL" },
  { time: "10:32:05", level: "info", message: "[Server] Preparing level \"world\"" },
  { time: "10:32:08", level: "info", message: "[Server] Preparing start region for dimension minecraft:overworld" },
  { time: "10:32:12", level: "info", message: "[Server] Done (11.234s)! For help, type \"help\"" },
  { time: "10:32:12", level: "info", message: "[Server] Server is now running on 0.0.0.0:25565" },
  { time: "10:33:45", level: "info", message: "[Server] ShreePlayer joined the game" },
  { time: "10:34:02", level: "info", message: "[Server] CraftMaster99 joined the game" },
  { time: "10:35:18", level: "warn", message: "[Server] Can't keep up! Is the server overloaded?" },
  { time: "10:36:01", level: "info", message: "[Server] RedstonePro joined the game" },
];

export const MOCK_RESOURCES = {
  current_state: "running",
  is_suspended: false,
  resources: {
    memory_bytes: 1887436800,
    cpu_absolute: 34.2,
    disk_bytes: 2147483648,
    network_rx_bytes: 52428800,
    network_tx_bytes: 15728640,
    uptime: 7200000,
  },
};

export const MOCK_SERVER_DETAILS = {
  name: "Survival SMP",
  limits: { memory: 4096, disk: 10240, cpu: 200 },
  feature_limits: { databases: 2, allocations: 3, backups: 5 },
  description: "Main survival server",
};

// Mock file system for demo mode
export type MockFile = {
  name: string;
  is_file: boolean;
  size: number;
  modified_at: string;
  content?: string;
  children?: MockFile[];
};

const now = "2026-03-22T14:30:00Z";
const yesterday = "2026-03-21T10:15:00Z";
const lastWeek = "2026-03-15T08:00:00Z";

export const MOCK_FILE_SYSTEM: MockFile[] = [
  {
    name: "plugins", is_file: false, size: 0, modified_at: now, children: [
      { name: "EssentialsX.jar", is_file: true, size: 5242880, modified_at: now },
      { name: "WorldEdit.jar", is_file: true, size: 3145728, modified_at: yesterday },
      { name: "LuckPerms.jar", is_file: true, size: 4194304, modified_at: lastWeek },
      { name: "Vault.jar", is_file: true, size: 1048576, modified_at: lastWeek },
      { name: "PlaceholderAPI.jar", is_file: true, size: 2097152, modified_at: yesterday },
      {
        name: "EssentialsX", is_file: false, size: 0, modified_at: now, children: [
          { name: "config.yml", is_file: true, size: 28672, modified_at: now, content: `# EssentialsX Configuration\n\n# Set the locale for messages\nlocale: en\n\n# Teleport settings\nteleport:\n  cooldown: 5\n  delay: 3\n  invulnerability: 4\n\n# Economy settings\neconomy:\n  starting-balance: 1000\n  currency-symbol: '$'\n  max-money: 10000000000\n  min-money: -10000\n\n# Homes\nhomes:\n  max: 3\n  set-on-death: false\n\n# Spawn\nspawn:\n  on-join: true\n  on-death: true\n  priority: essentials\n\n# Chat format\nchat:\n  format: '{DISPLAYNAME}: {MESSAGE}'\n  group-format: true` },
          { name: "userdata", is_file: false, size: 0, modified_at: now, children: [
            { name: "550e8400-e29b-41d4-a716-446655440000.yml", is_file: true, size: 1024, modified_at: now, content: "# Player data\nmoney: 5420.50\nhomes:\n  home:\n    world: world\n    x: 128\n    y: 64\n    z: -256\nlast-login: 2026-03-22T14:30:00Z" },
          ]},
        ]
      },
      {
        name: "LuckPerms", is_file: false, size: 0, modified_at: lastWeek, children: [
          { name: "config.yml", is_file: true, size: 16384, modified_at: lastWeek, content: `# LuckPerms Configuration\n\nserver: global\nstorage-method: h2\n\n# Messaging\nmessaging-service: none\nauto-op: false\n\n# Permission calculation\napply-wildcards: true\napply-regex: true\napply-shorthand: true` },
        ]
      },
    ]
  },
  {
    name: "world", is_file: false, size: 0, modified_at: now, children: [
      { name: "level.dat", is_file: true, size: 8192, modified_at: now },
      { name: "session.lock", is_file: true, size: 4, modified_at: now },
      {
        name: "region", is_file: false, size: 0, modified_at: now, children: [
          { name: "r.0.0.mca", is_file: true, size: 1048576, modified_at: now },
          { name: "r.0.1.mca", is_file: true, size: 524288, modified_at: now },
          { name: "r.1.0.mca", is_file: true, size: 786432, modified_at: yesterday },
          { name: "r.1.1.mca", is_file: true, size: 262144, modified_at: yesterday },
        ]
      },
      {
        name: "datapacks", is_file: false, size: 0, modified_at: lastWeek, children: [
          { name: "vanilla", is_file: false, size: 0, modified_at: lastWeek, children: [] },
        ]
      },
    ]
  },
  {
    name: "world_nether", is_file: false, size: 0, modified_at: yesterday, children: [
      { name: "level.dat", is_file: true, size: 4096, modified_at: yesterday },
      { name: "region", is_file: false, size: 0, modified_at: yesterday, children: [
        { name: "r.0.0.mca", is_file: true, size: 524288, modified_at: yesterday },
      ]},
    ]
  },
  {
    name: "world_the_end", is_file: false, size: 0, modified_at: lastWeek, children: [
      { name: "level.dat", is_file: true, size: 4096, modified_at: lastWeek },
    ]
  },
  {
    name: "logs", is_file: false, size: 0, modified_at: now, children: [
      { name: "latest.log", is_file: true, size: 245760, modified_at: now, content: `[10:32:01 INFO]: Starting Minecraft server version 1.20.4\n[10:32:03 INFO]: Loading properties...\n[10:32:03 INFO]: Default game type: SURVIVAL\n[10:32:05 INFO]: Preparing level "world"\n[10:32:08 INFO]: Preparing start region for dimension minecraft:overworld\n[10:32:12 INFO]: Done (11.234s)! For help, type "help"\n[10:33:45 INFO]: ShreePlayer joined the game\n[10:34:02 INFO]: CraftMaster99 joined the game\n[10:35:18 WARN]: Can't keep up! Is the server overloaded?\n[10:36:01 INFO]: RedstonePro joined the game` },
      { name: "2026-03-21-1.log.gz", is_file: true, size: 102400, modified_at: yesterday },
      { name: "2026-03-20-1.log.gz", is_file: true, size: 98304, modified_at: lastWeek },
    ]
  },
  { name: "server.properties", is_file: true, size: 2048, modified_at: now, content: `#Minecraft server properties\nserver-port=25565\nmax-players=20\ndifficulty=normal\ngamemode=survival\nlevel-name=world\nlevel-seed=\nmotd=\\u00A7bShreeCloud \\u00A7f- Survival SMP\nspawn-protection=16\nview-distance=12\nsimulation-distance=10\nonline-mode=true\nwhite-list=false\nspawn-npcs=true\nspawn-animals=true\nspawn-monsters=true\ngenerate-structures=true\nallow-nether=true\nallow-flight=false\nenable-command-block=false\nmax-world-size=29999984\nplayer-idle-timeout=0\nforce-gamemode=false\nhardcore=false\npvp=true\nenable-rcon=false` },
  { name: "bukkit.yml", is_file: true, size: 3072, modified_at: lastWeek, content: `# Bukkit Configuration\nsettings:\n  allow-end: true\n  warn-on-overload: true\n  permissions-file: permissions.yml\n  update-folder: update\n  plugin-profiling: false\n  connection-throttle: 4000\n  query-plugins: true\n  deprecated-verbose: default\n  shutdown-message: Server closed\n  minimum-api: none\n  use-map-color-cache: true\nspawn-limits:\n  monsters: 70\n  animals: 10\n  water-animals: 5\n  water-ambient: 20\n  water-underground-creature: 5\n  axolotls: 5\n  ambient: 15\nchunk-gc:\n  period-in-ticks: 600\nticks-per:\n  animal-spawns: 400\n  monster-spawns: 1\n  water-spawns: 1\n  water-ambient-spawns: 1\n  water-underground-creature-spawns: 1\n  axolotl-spawns: 1\n  ambient-spawns: 1\n  autosave: 6000` },
  { name: "spigot.yml", is_file: true, size: 4096, modified_at: lastWeek, content: `# Spigot Configuration\nsettings:\n  debug: false\n  bungeecord: false\n  timeout-time: 60\n  restart-on-crash: true\n  restart-script: ./start.sh\n  player-shuffle: 0\n  user-cache-size: 1000\n  save-user-cache-on-stop-only: false\n  moved-wrongly-threshold: 0.0625\n  moved-too-quickly-multiplier: 10.0\n  netty-threads: 4\n  attribute:\n    maxHealth:\n      max: 2048.0\n    movementSpeed:\n      max: 2048.0\n    attackDamage:\n      max: 2048.0\nworld-settings:\n  default:\n    verbose: true\n    merge-radius:\n      item: 2.5\n      exp: 3.0\n    item-despawn-rate: 6000\n    view-distance: default` },
  { name: "paper.yml", is_file: true, size: 5120, modified_at: lastWeek, content: `# Paper Configuration\n\nsettings:\n  max-joins-per-tick: 3\n  track-plugin-scoreboards: false\n  fix-entity-position-desync: true\n  use-display-name-in-quit-message: false\n\nworld-settings:\n  default:\n    auto-save-interval: -1\n    max-auto-save-chunks-per-tick: 24\n    prevent-moving-into-unloaded-chunks: true\n    anti-xray:\n      enabled: true\n      engine-mode: 1\n      max-block-height: 64` },
  { name: "eula.txt", is_file: true, size: 128, modified_at: lastWeek, content: `#By changing the setting below to TRUE you are indicating your agreement to our EULA.\n#Mon Mar 15 08:00:00 UTC 2026\neula=true` },
  { name: "server.jar", is_file: true, size: 41943040, modified_at: lastWeek },
  { name: "start.sh", is_file: true, size: 256, modified_at: lastWeek, content: `#!/bin/bash\njava -Xms512M -Xmx4096M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -jar server.jar nogui` },
  { name: "banned-players.json", is_file: true, size: 64, modified_at: lastWeek, content: `[]` },
  { name: "banned-ips.json", is_file: true, size: 64, modified_at: lastWeek, content: `[]` },
  { name: "ops.json", is_file: true, size: 256, modified_at: now, content: `[\n  {\n    "uuid": "550e8400-e29b-41d4-a716-446655440000",\n    "name": "ShreePlayer",\n    "level": 4,\n    "bypassesPlayerLimit": true\n  }\n]` },
  { name: "whitelist.json", is_file: true, size: 512, modified_at: yesterday, content: `[\n  {\n    "uuid": "550e8400-e29b-41d4-a716-446655440000",\n    "name": "ShreePlayer"\n  },\n  {\n    "uuid": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",\n    "name": "CraftMaster99"\n  },\n  {\n    "uuid": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",\n    "name": "RedstonePro"\n  }\n]` },
  { name: "permissions.yml", is_file: true, size: 128, modified_at: lastWeek, content: `# Permissions configuration` },
  { name: "help.yml", is_file: true, size: 2048, modified_at: lastWeek, content: `# Help configuration\ngeneral-topics:\n  Default:\n    shortText: Default help page\n    fullText: Welcome to ShreeCloud SMP!\n    permission: ''` },
];

// Helper to resolve a path in mock file system
export function getMockFiles(path: string): MockFile[] {
  if (path === "/" || path === "") return MOCK_FILE_SYSTEM;
  const parts = path.replace(/^\//, "").split("/");
  let current: MockFile[] = MOCK_FILE_SYSTEM;
  for (const part of parts) {
    const found = current.find(f => f.name === part && !f.is_file);
    if (!found || !found.children) return [];
    current = found.children;
  }
  return current;
}

export function getMockFileContent(path: string): string {
  const parts = path.replace(/^\//, "").split("/");
  let current: MockFile[] = MOCK_FILE_SYSTEM;
  for (let i = 0; i < parts.length - 1; i++) {
    const found = current.find(f => f.name === parts[i] && !f.is_file);
    if (!found || !found.children) return "// File not found";
    current = found.children;
  }
  const file = current.find(f => f.name === parts[parts.length - 1] && f.is_file);
  return file?.content || "// Binary file — cannot display contents";
}
