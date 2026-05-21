interface NicknameColorPair {
  nicknameText: string;
  avatarBackground: string;
  avatarText: string;
}

const nicknameColorPairs: NicknameColorPair[] = [
  {
    nicknameText: "#6d28d9",
    avatarBackground: "#ede9fe",
    avatarText: "#6d28d9",
  },
  {
    nicknameText: "#be123c",
    avatarBackground: "#ffe4e6",
    avatarText: "#be123c",
  },
  {
    nicknameText: "#b45309",
    avatarBackground: "#fef3c7",
    avatarText: "#b45309",
  },
  {
    nicknameText: "#1d4ed8",
    avatarBackground: "#dbeafe",
    avatarText: "#1d4ed8",
  },
  {
    nicknameText: "#c2410c",
    avatarBackground: "#ffedd5",
    avatarText: "#c2410c",
  },
  {
    nicknameText: "#a21caf",
    avatarBackground: "#fae8ff",
    avatarText: "#a21caf",
  },
  {
    nicknameText: "#0e7490",
    avatarBackground: "#cffafe",
    avatarText: "#0e7490",
  },
  {
    nicknameText: "#b91c1c",
    avatarBackground: "#fee2e2",
    avatarText: "#b91c1c",
  },
];

const nicknameColorsByUserId = new Map<number, NicknameColorPair>();

export const getNicknameColorPair = (userId: number): NicknameColorPair => {
  const existingColorPair = nicknameColorsByUserId.get(userId);

  if (existingColorPair) {
    return existingColorPair;
  }

  const colorPair =
    nicknameColorPairs[Math.floor(Math.random() * nicknameColorPairs.length)];
  nicknameColorsByUserId.set(userId, colorPair);

  return colorPair;
};
