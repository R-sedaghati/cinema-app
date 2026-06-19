import formatDateToYMD from "./formatDateToYMD";

const ObjectUtils = {
  hasAllKeys: (obj: Record<string, any>, keys: string | string[]): boolean => {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    return keyArray.every((key) => key in obj);
  },
  pruneEmptyValues: (
    obj: Record<string, any>,
    recursive: boolean = false,
  ): void => {
    for (const key in obj) {
      const value = obj[key];

      const isDate = value instanceof Date;
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      const isEmptyObject =
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !isDate &&
        Object.keys(value).length === 0;

      if (
        value === null ||
        value === undefined ||
        value === "" ||
        isEmptyArray ||
        isEmptyObject
      ) {
        delete obj[key];
      } else if (
        recursive &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !isDate
      ) {
        ObjectUtils.pruneEmptyValues(value, true);
        if (Object.keys(value).length === 0) {
          delete obj[key];
        }
      }
    }
  },
  formatDateFields: (
    obj: Record<string, any>,
    recursive: boolean = false,
  ): void => {
    for (const key in obj) {
      const value = obj[key];

      if (value instanceof Date) {
        obj[key] = formatDateToYMD(value);
      } else if (
        recursive &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        ObjectUtils.formatDateFields(value, true);
      }
    }
  },
  stringifyArrays: (
    obj: Record<string, any>,
    recursive: boolean = false,
  ): void => {
    for (const key in obj) {
      const value = obj[key];

      if (Array.isArray(value)) {
        obj[key] = value.join(",");
      } else if (
        recursive &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        ObjectUtils.stringifyArrays(value, true);
      }
    }
  },
  hasMeaningfulValues: (
    obj: Record<string, any>,
    skipKeys: string | string[] = [],
    recursive: boolean = false,
  ): boolean => {
    const skip = Array.isArray(skipKeys) ? skipKeys : [skipKeys];

    for (const key in obj) {
      if (skip.includes(key)) continue;

      const value = obj[key];

      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        continue;
      }

      const isDate = value instanceof Date;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !isDate
      ) {
        if (recursive) {
          if (ObjectUtils.hasMeaningfulValues(value, skip, true)) {
            return true;
          }
        } else {
          continue;
        }
      } else {
        return true;
      }
    }

    return false;
  },
};

export default ObjectUtils;
