import { Schema, Style, Definition, Options } from "../types";

export function createStyle<T extends {}>(style: T extends Definition ? T : Style<T>): Style<T> {
  if ("create" in style) {
    return style as Style<T>;
  }



  return {

    create(props) {
      return {
        attributes: {
          viewBox: "0 0 64 64",
        },
        body: "",
      }
    },
  }
}
