export type RequireFormat<T, P extends keyof T> = Required<{ [k in P]: T[k] }> & { [k in Exclude<keyof T, P>]: T[k] }

export default {}