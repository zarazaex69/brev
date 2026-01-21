# Documentation Style Guide

## Hierarchy System

This document defines a clear visual hierarchy system using specific symbols to categorize different types of information. Each symbol serves as a visual cue to help readers quickly identify content types.

## Symbol Definitions

### Primary Markers

**[!]** - Section Headers/Titles
- Used for main section headings
- Always followed by a space and the title text
- Creates primary visual anchors in the document

**[?]** - Descriptions/Instructions
- Used for explanatory content and step-by-step instructions
- Indicates informational content that explains "how" or "what"
- Helps readers understand processes and concepts

**[*]** - Important Notes/Warnings
- Used for critical information that requires attention
- Highlights key points, warnings, or essential details
- Draws immediate focus to important content

**[^]** - Examples/Code Samples
- Used to introduce examples, code snippets, or demonstrations
- Indicates practical applications of concepts
- Shows real-world usage patterns

### Secondary Markers

**[+]** - Positive Notes/Benefits
- Used for advantages, benefits, or positive outcomes
- Highlights what works well or recommended approaches

**[-]** - Negative Notes/Limitations
- Used for limitations, drawbacks, or things to avoid
- Indicates potential problems or restrictions

**[>]** - Action Items/Next Steps
- Used for actionable items or next steps
- Indicates what the reader should do next

**[=]** - Definitions/Equivalents
- Used for definitions or when explaining equivalencies
- Clarifies terminology or concept relationships

**[@]** - References/Links
- Used when referencing external sources or related content
- Indicates connections to other materials

**[#]** - Configuration/Settings
- Used for configuration details, settings, or parameters
- Indicates technical specifications or setup information

## Formatting Rules

### Indentation System
- Primary markers ([!]) start at column 1 (no indentation)
- Secondary content uses 2-space indentation under primary markers
- Nested content uses 4-space indentation
- Code blocks use 6-space indentation when nested

### Spacing Rules
- Always include one space after the closing bracket: `[!] Title`
- Leave one blank line before new primary sections
- No blank lines between related secondary items
- Two blank lines between major document sections

### Text Formatting
- No emoji or decorative characters
- Use plain ASCII characters only
- Keep marker symbols consistent in size and format
- Use standard markdown formatting within content (bold, italic, code)

## Usage Examples

### Basic Section Structure
```
[!] Main Section Title

[?] This section explains the core concepts and provides
    detailed instructions for implementation.

[*] Important: Always backup your data before proceeding.

[^] Example implementation:
    const config = { port: 3000 }
```

### Complex Nested Structure
```
[!] API Configuration

[?] Configure the API endpoints and authentication settings
    for your application.

  [#] Required Settings
    - API_KEY: Your authentication key
    - BASE_URL: The service endpoint

  [*] The API key must be kept secure and never committed
      to version control.

  [^] Environment file example:
      API_KEY=your_key_here
      BASE_URL=https://api.example.com

[>] Next: Test the configuration with a simple request
```

### Multiple Content Types
```
[!] Error Handling

[?] Implement proper error handling to ensure application
    stability and user experience.

[+] Benefits of proper error handling:
  - Improved user experience
  - Easier debugging and maintenance
  - Better application reliability

[-] Common mistakes to avoid:
  - Swallowing errors silently
  - Generic error messages
  - Not logging error details

[^] Basic error handling pattern:
    try {
      const result = await operation()
      return result
    } catch (error) {
      logger.error('Operation failed:', error)
      throw new Error('Operation failed')
    }

[@] Reference: Error Handling Best Practices Guide
```

## Visual Hierarchy Principles

### Scanning Pattern
The symbol system supports natural left-to-right, top-to-bottom scanning:
1. Eyes catch [!] markers first (section headers)
2. [?] markers indicate explanatory content
3. [*] markers draw attention to critical information
4. [^] markers show practical examples

### Information Density
- Primary markers ([!]) create clear content boundaries
- Secondary markers provide content classification
- Indentation shows information relationships
- Consistent spacing improves readability

### Cognitive Load Reduction
- Symbols eliminate guesswork about content type
- Visual consistency reduces mental processing
- Clear hierarchy prevents information overload
- Predictable structure aids comprehension

## Implementation Guidelines

### Document Structure
1. Start with [!] title/overview
2. Use [?] for main explanatory content
3. Add [*] for critical information
4. Include [^] for practical examples
5. End with [>] for next steps

### Content Organization
- Group related information under primary markers
- Use secondary markers to classify sub-content
- Maintain consistent indentation levels
- Keep related items visually connected
## Decorative Elements (Optional)

### Pseudographic Symbols
For enhanced visual appeal, these Unicode symbols can be used as alternatives or supplements:

**Box Drawing Characters:**
- `┌─` `└─` `├─` `│` - For creating visual trees and connections
- `▲` `▼` `◆` `●` - For bullet points and emphasis
- `═══` `───` `┅┅┅` - For section dividers

**Geometric Shapes:**
- `▸` `▹` `▪` `▫` - For nested lists and sub-items
- `◉` `◎` `○` - For different priority levels
- `▓▓▓` `░░░` - For progress indicators or emphasis blocks

**Arrow Variants:**
- `→` `⇒` `↳` `↪` - For flow and relationships
- `⤷` `⤴` `⤵` - For references and connections

### Kaomoji Integration
Expressive text faces for different content moods:

**Informational Content:**
- `(・ω・)` - Neutral explanation
- `(´▽`)` - Encouraging note

**Warning/Important:**
- `(0_o)` - Attention needed

**Success/Positive:**
- `\(OoO)/` - Achievement

**Error/Problem:**
- `(╥-╥)` - Something went wrong

**Thinking/Processing:**
- `(´･ω･`)` - Contemplation
- `(・_・;)` - Uncertainty
- `(?▽?)` - Understanding

### Usage Guidelines for Decorative Elements

**When to Use:**
- Internal documentation where personality is welcome
- Tutorial content that benefits from friendly tone
- Community-facing documentation
- Personal project documentation

**When to Avoid:**
- Formal API documentation
- Corporate/enterprise documentation
- Technical specifications
- Legal or compliance documents

**Combination Rules:**
- Use either brackets OR kaomoji, not both in same marker
- Maintain consistency within a single document
- Pseudographic elements should enhance, not overwhelm
- Keep decorative elements culturally appropriate
