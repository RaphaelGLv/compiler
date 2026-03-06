import type { ITokenConfig } from "./token-config";

export const TokenSuffix = {
  KEYWORD: "_KEYWORD",
  OPERATOR: "_OPERATOR",
  LITERAL: "_LITERAL",
  TYPE: "_TYPE",
} as const;

export interface IToken {
  regex: RegExp;
  value: string;
  config?: ITokenConfig;
}
