export const TokenComment = {
  INLINE_START: "INLINE_START",
  INLINE_END: "INLINE_END",
  MULTILINE_START: "MULTILINE_START",
  MULTILINE_END: "MULTILINE_END",
} as const;

export type TokenCommentType = (typeof TokenComment)[keyof typeof TokenComment];

export interface ITokenConfig {
  isSeparator?: boolean;
  shouldBeIgnored?: boolean;
  comment?: TokenCommentType;
}
