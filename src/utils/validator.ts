export class Validator {
  ValidateFalsyFields<T extends Object>(
    data: T,
    exceptions: Array<keyof T> = []
  ) {
    const ParamsSplitIntoEntries: Array<Array<keyof T>> = Object.entries(data);

    const falsyFields = ParamsSplitIntoEntries.filter(([key, value]) =>
      exceptions.includes(key) ? false : !value
    ).map(([key]) => key);

    if (falsyFields.length === 0) return null;

    const errorMessage =
      falsyFields.join(", ") +
      (falsyFields.length === 1 ? " is a empty field" : " are empty fields");

    return new Error(errorMessage);
  }
}
