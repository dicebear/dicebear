import { Schema } from "../types";

export function createSchema<T extends Schema>(schema: T): T {
  return schema;
}
