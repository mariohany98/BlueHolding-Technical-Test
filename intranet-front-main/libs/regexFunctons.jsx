export const extractMentionedIds = (inputString) => {
  const regex = /@\[.*?\]\((\d+)\)/g;
  const mentionedIds = [];
  let match;

  while ((match = regex.exec(inputString))) {
    const mentioned_id = parseInt(match[1]);
    mentionedIds.push({ mentioned_id });
  }

  return mentionedIds;
};