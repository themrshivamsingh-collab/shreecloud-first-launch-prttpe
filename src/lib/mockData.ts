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
