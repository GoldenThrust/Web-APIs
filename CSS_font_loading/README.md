# CSS Font Loading API

This application demonstrates the usage of the CSS Font Loading API to dynamically change the font of a content-editable section. Users can select fonts from predefined options, upload their own font files, or specify custom font properties.

## Features

- **Content Editable Section**: The main text section is editable and allows users to see the changes in real-time.
- **Predefined Fonts**: Users can choose from a list of predefined fonts.
- **Load Fonts from URL**: Users can upload their own font files (supports `.woff`, `.otf`, and `.ttf` formats).
- **Custom Font Properties**: Users can define custom font properties such as family, weight, style, and more.

## Usage

### Select Font Category

1. **Predefined Fonts**:
    - Select "Default" from the dropdown.
    - Click on any font button to apply it to the text section.

2. **Loaded Fonts**:
    - Select "Loaded" from the dropdown.
    - Click on any font button to apply it to the text section.

3. **Load Fonts from URL**:
    - Select "URL" from the dropdown.
    - Click the file input to upload a font file.
    - The font will be applied automatically once uploaded.

4. **Custom Fonts**:
    - Select "Custom" from the dropdown.
    - Fill in the custom font properties.

### Custom Font Properties

- **Family**: Name of the font family.
- **Display**: Font display strategy (auto, block, fallback, optional, swap).
- **Weight**: Font weight (e.g., 400, bold).
- **Stretch**: Font stretch (e.g., normal, condensed).
- **Style**: Font style (e.g., normal, italic).
- **Ascent Override**: Custom ascent value.
- **Descent Override**: Custom descent value.
- **Line Gap Override**: Custom line gap value.
- **Feature Setting**: Advanced font feature settings.
- **Unicode Range**: Specific Unicode range for the font.