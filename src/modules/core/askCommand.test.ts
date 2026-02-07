import { test, expect, describe } from "bun:test"

describe("markdownToHtml utility", () => {
  const markdownToHtml = (text: string): string => {
    const marked = { parse: (t: string) => t } as any
    const html = marked.parse(text)
    return html
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "\n")
      .replace(/<blockquote>/g, "")
      .replace(/<\/blockquote>/g, "")
      .replace(/<h1>/g, "<b>")
      .replace(/<\/h1>/g, "</b>\n")
      .replace(/<h2>/g, "<b>")
      .replace(/<\/h2>/g, "</b>\n")
      .replace(/<h3>/g, "<b>")
      .replace(/<\/h3>/g, "</b>\n")
      .replace(/<ul>/g, "")
      .replace(/<\/ul>/g, "")
      .replace(/<ol>/g, "")
      .replace(/<\/ol>/g, "")
      .replace(/<li>/g, "• ")
      .replace(/<\/li>/g, "\n")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<hr\s*\/?>/g, "—————\n")
      .replace(/<strong>/g, "<b>")
      .replace(/<\/strong>/g, "</b>")
      .replace(/<em>/g, "<i>")
      .replace(/<\/em>/g, "</i>")
      .replace(/<code class="[^"]*">/g, "<code>")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim()
  }

  test("removes paragraph tags", () => {
    const result = markdownToHtml("<p>Hello</p>")
    expect(result).toBe("Hello")
  })

  test("converts strong to bold", () => {
    const result = markdownToHtml("<strong>Bold</strong>")
    expect(result).toBe("<b>Bold</b>")
  })

  test("converts em to italic", () => {
    const result = markdownToHtml("<em>Italic</em>")
    expect(result).toBe("<i>Italic</i>")
  })

  test("converts headers to bold", () => {
    const result1 = markdownToHtml("<h1>Header 1</h1>")
    const result2 = markdownToHtml("<h2>Header 2</h2>")
    const result3 = markdownToHtml("<h3>Header 3</h3>")
    
    expect(result1).toBe("<b>Header 1</b>")
    expect(result2).toBe("<b>Header 2</b>")
    expect(result3).toBe("<b>Header 3</b>")
  })

  test("converts list items to bullets", () => {
    const result = markdownToHtml("<ul><li>Item 1</li><li>Item 2</li></ul>")
    expect(result).toContain("• Item 1")
    expect(result).toContain("• Item 2")
  })

  test("converts br to newline", () => {
    const result = markdownToHtml("Line 1<br>Line 2")
    expect(result).toContain("\n")
  })

  test("converts hr to dashes", () => {
    const result = markdownToHtml("Text<hr/>More text")
    expect(result).toContain("—————")
  })

  test("decodes HTML entities", () => {
    const result = markdownToHtml("&quot;Hello&quot; &amp; &lt;world&gt;")
    expect(result).toBe('"Hello" & <world>')
  })

  test("removes code class attributes", () => {
    const result = markdownToHtml('<code class="language-js">code</code>')
    expect(result).toBe("<code>code</code>")
  })

  test("trims whitespace", () => {
    const result = markdownToHtml("  \n  Hello  \n  ")
    expect(result).toBe("Hello")
  })
})
