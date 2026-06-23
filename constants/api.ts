import Constants from "expo-constants";

function getExpoHost(): string | undefined {
  const hostUri =
    (Constants.expoConfig?.hostUri as string | undefined) ??
    (Constants.expoGoConfig?.hostUri as string | undefined);

  if (!hostUri) {
    return undefined;
  }

  return hostUri.split(":")[0];
}

export const API_BASE_URI =
  process.env.EXPO_PUBLIC_API_URL ||
  (getExpoHost() ? `http://${getExpoHost()}:3000` : "http://localhost:3000");
