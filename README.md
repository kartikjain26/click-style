# { } ClickStyle

**Click any element. Edit its styles. No DevTools needed.**

ClickStyle is a lightweight Chrome extension that lets you visually edit CSS styles on any webpage — faster than opening DevTools. Double-click, select text, or right-click any element to start editing instantly.

---

## Why ClickStyle?

Opening DevTools to make a quick style change is slow. You have to inspect the element, find the right node in the DOM tree, scroll through computed styles, and make your edit. **ClickStyle skips all of that.**

- Double-click an element → edit it
- No DOM tree navigation
- No switching between panels
- See changes instantly

Built for developers, designers, and anyone who tweaks the web.

---

## Features

**Multiple ways to activate**
- Double-click any element
- Select text by dragging
- Right-click → "ClickStyle — Edit Styles"

**DevTools-style property editor**
- Every CSS property shown as a toggleable row with checkboxes
- Uncheck a property to disable it — just like DevTools
- Edit values inline with instant preview

**CSS autocomplete**
- Click into any value field to see all valid options
- Autocomplete for property names when adding new rules
- Arrow keys + Enter to select

**Validation**
- Invalid CSS values flagged with a ⚠ icon
- Invalid properties shown with strikethrough
- Only valid styles are applied to the element

**Other goodies**
- Auto-apply toggle — see changes as you type, or apply manually
- Copy CSS — exports only active properties as a ready-to-paste CSS rule
- Click the selector path to copy it
- Undo to revert all changes
- Draggable panel
- Inline text editing when style panel is open
- Esc to close

---

## Install

### From Chrome Web Store

> Coming soon

### Manual install (Developer Mode)

1. Clone this repo

```
git clone https://github.com/kartikjain26/clickstyle.git
```

2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `clickstyle` folder
6. Done — visit any page and double-click an element

---

## How it works

```
Double-click / Select text / Right-click
        ↓
    { } icon appears near the element
        ↓
    Click { } to open style editor
        ↓
    Edit values, toggle properties, add new ones
        ↓
    Changes apply live on the page
```

---

## File structure

```
clickstyle/
├── manifest.json    # Extension config (Manifest V3)
├── background.js    # Registers right-click context menu
├── content.js       # All the magic — UI, editor, autocomplete, validation
└── icon128.png      # Extension icon
```

---

## Permissions

ClickStyle requests minimal permissions:

| Permission | Why |
|---|---|
| `activeTab` | Access the current tab to inject the editor |
| `scripting` | Inject content script into pages |
| `contextMenus` | Add "Edit Styles" to the right-click menu |

**No data is collected. No analytics. No network requests. Everything runs locally in your browser.**

---

## Comparison

| Feature | DevTools | Stylebot | Visual CSS Editor | ClickStyle |
|---|---|---|---|---|
| Edit CSS values | ✅ | ✅ | ✅ | ✅ |
| Toggle properties on/off | ✅ | ❌ | ❌ | ✅ |
| CSS autocomplete | ✅ | ❌ | ❌ | ✅ |
| Invalid value warnings | ✅ | ❌ | ❌ | ✅ |
| Edit inline text | ❌ | ❌ | ❌ | ✅ |
| Click to activate | ❌ | ✅ | ✅ | ✅ |
| Double-click to activate | ❌ | ❌ | ❌ | ✅ |
| Copy as CSS rule | ❌ | ❌ | ✅ | ✅ |
| No panel/sidebar clutter | ❌ | ❌ | ❌ | ✅ |
| Free & open source | ✅ | ✅ | ❌ | ✅ |

---

## Roadmap

- [ ] Save edits per domain (persist across reloads)
- [ ] Export all changes as a stylesheet
- [ ] Color picker for color values
- [ ] Box model visual editor
- [ ] Dark mode for the editor panel
- [ ] Firefox support

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a PR.

1. Fork the repo
2. Create your branch (`git checkout -b feature/cool-thing`)
3. Commit your changes (`git commit -m 'Add cool thing'`)
4. Push (`git push origin feature/cool-thing`)
5. Open a Pull Request

---

## Privacy Policy

ClickStyle does not collect, store, or transmit any user data. All edits happen locally in your browser and are never sent to any server. No analytics, no tracking, no cookies.

---

## License

MIT © Kartik Jain

---

**If ClickStyle saves you time, give it a ⭐ on GitHub and a review on the Chrome Web Store!**