function parseRule(text) {
  if (!text.startsWith("/") || !text.includes("-")) {
    return null;
  }

  const [command, ...responseParts] = text.split("-");
  const response = responseParts.join("-").trim();

  if (!command.trim() || !response) {
    return null;
  }

  return {
    command: command.trim(),
    response,
  };
}

module.exports = parseRule;