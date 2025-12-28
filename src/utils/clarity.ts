import {
  ClarityValue,
  uintCV,
  intCV,
  bufferCV,
  boolCV,
  principalCV,
  stringAsciiCV,
  stringUtf8CV,
  responseOkCV,
  responseErrorCV,
  noneCV,
  someCV,
  listCV,
  tupleCV,
} from "@stacks/transactions";

/**
 * Convert ClarityValue to the format expected by Stacks API
 */
export function clarityValueToApiFormat(cv: ClarityValue): any {
  switch (cv.type) {
    case 1: // uintCV
      return {
        type: "uint",
        value: cv.value.toString(),
      };
    case 2: // intCV
      return {
        type: "int",
        value: cv.value.toString(),
      };
    case 3: // bufferCV
      return {
        type: "buffer",
        value: cv.value.toString("hex"),
      };
    case 4: // boolCV
      return {
        type: "bool",
        value: cv.value,
      };
    case 5: // principalCV
      return {
        type: "principal",
        value: cv.value.address,
      };
    case 6: // stringAsciiCV
      return {
        type: "string-ascii",
        value: cv.value,
      };
    case 7: // stringUtf8CV
      return {
        type: "string-utf8",
        value: cv.value,
      };
    case 8: // responseOkCV
      return {
        type: "response",
        value: {
          ok: clarityValueToApiFormat(cv.value),
        },
      };
    case 9: // responseErrorCV
      return {
        type: "response",
        value: {
          error: clarityValueToApiFormat(cv.value),
        },
      };
    case 10: // noneCV
      return {
        type: "none",
      };
    case 11: // someCV
      return {
        type: "some",
        value: clarityValueToApiFormat(cv.value),
      };
    case 12: // listCV
      return {
        type: "list",
        value: cv.value.map((item) => clarityValueToApiFormat(item)),
      };
    case 13: // tupleCV
      return {
        type: "tuple",
        value: Object.fromEntries(
          Object.entries(cv.data).map(([key, value]) => [
            key,
            clarityValueToApiFormat(value),
          ])
        ),
      };
    default:
      return cv;
  }
}

