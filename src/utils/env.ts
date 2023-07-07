export function loadEnvVar<T extends string | boolean | number>(
  key: string,
  defaultVal?: T,
) {
  let envVar = process.env[key] as T;
  if (envVar != null && defaultVal != null) {
    if (typeof defaultVal === "number") {
      envVar = Number(envVar) as T;
    } else if (typeof defaultVal === "boolean") {
      envVar = (envVar === "true") as unknown as T;
    }
  }
  return envVar ?? defaultVal;
}
