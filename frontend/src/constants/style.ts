export const HIGHLIGHT_COMMENT_SX = {
  backgroundColor: "warning.light",
  borderColor: "warning.main",
  borderWidth: 2,
  transform: "scale(1.01)",
  boxShadow: 3,
};

export const HIGHLIGHT_COMMENTS_SX = {
  ...HIGHLIGHT_COMMENT_SX,
  p: 2,
};

export const CLAMP_TEXT_SX = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});
