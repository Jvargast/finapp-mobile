const decodeEntity = (value: string) => {
  const fromCodePoint =
    String.fromCodePoint || ((code: number) => String.fromCharCode(code));
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      if (Number.isNaN(code)) return "";
      return fromCodePoint(code);
    })
    .replace(/&#(\d+);/g, (_, num) => {
      const code = parseInt(num, 10);
      if (Number.isNaN(code)) return "";
      return fromCodePoint(code);
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
};

const decodeQuotedPrintable = (value: string) => {
  const normalized = value.replace(/=\r?\n/g, "");
  return normalized.replace(/=([0-9a-f]{2})/gi, (_, hex) => {
    const code = parseInt(hex, 16);
    if (Number.isNaN(code)) return "";
    return String.fromCharCode(code);
  });
};

const stripSection = (value: string, tag: string) =>
  value.replace(
    new RegExp(`<${tag}[\\s\\S]*?(</${tag}>|$)`, "gi"),
    " ",
  );

export const sanitizeEmailSnippet = (
  value?: string | null,
  maxLength = 360,
) => {
  if (!value) return "";
  let text = String(value);

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(text);
  if (looksLikeHtml) {
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)(<\/body>|$)/i);
    if (bodyMatch?.[1]) {
      text = bodyMatch[1];
    } else {
      text = stripSection(text, "head");
    }
    text = stripSection(text, "script");
    text = stripSection(text, "style");
    text = text.replace(
      /<(br|\/p|\/div|\/li|\/tr|\/h[1-6])\s*\/?>/gi,
      "\n",
    );
    text = text.replace(/<[^>]+>/g, " ");
  }

  text = decodeQuotedPrintable(text);
  text = decodeEntity(text);
  text = text.replace(
    /\b(content-type|charset|viewport|http-equiv|stylesheet|doctype)\b/gi,
    " ",
  );
  text = text.replace(/\s+/g, " ").trim();

  if (maxLength > 0 && text.length > maxLength) {
    if (maxLength <= 3) {
      text = text.slice(0, maxLength);
    } else {
      text = `${text.slice(0, maxLength - 3)}...`;
    }
  }

  return text;
};
