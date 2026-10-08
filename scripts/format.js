// Episode format and series, derived from the episode's own fields so every tool agrees:
//   format: solo | guest | mashup (several guests' clips, "i asked 9 experts") | conversation (family/friend)
//   series: dbt education | q+a | book club | reddit reactions | expert mashup | (none)
const FAMILY = /^(sadie'?s (dad|mom|younger sister|best friend)|ivy sutton|maya|ruby|kayla|stephanie)$/i;
function formatOf(m) {
  const guests = m.guests || [];
  if (/i asked \d+ experts|mashup/i.test(m.title)) return 'mashup';
  if (!guests.length) return 'solo';
  if (guests.every((g) => FAMILY.test(String(g).split(',')[0].trim()))) return 'conversation';
  return 'guest';
}
function seriesOf(m) {
  const t = m.title;
  if (/dbt education/i.test(t)) return 'dbt education';
  if (/^\d+[.:]\s*(q\s*\+\s*a|q&a|ama)\b/i.test(t) || /\bq\+a\b|\bq&a\b/i.test(t)) return 'q+a';
  if (/book club/i.test(t)) return 'book club';
  if (/responding to reddit|reddit/i.test(t)) return 'reddit reactions';
  if (/i asked \d+ experts/i.test(t)) return 'expert mashup';
  return '';
}
module.exports = { formatOf, seriesOf };
