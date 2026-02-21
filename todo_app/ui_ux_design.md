# UI/UX Desgin Document
## Project: Minimalist To-Do Application

### 1. Design Concept
"Ethereal Focus" - A dark, immersive interface with subtle glows, glassmorphism, and smooth transitions. The goal is to make task management feel effortless and premium.

### 2. Color Palette
- **Background**: `#121212` (Deep Space Black)
- **Surface**: `rgba(255, 255, 255, 0.05)` (Glassy overlay)
- **Text Primary**: `#FFFFFF` (Pure White)
- **Text Secondary**: `#A0A0A0` (Silver Mist)
- **Accent**: `#BB86FC` (Soft Violet) or `#03DAC6` (Teal) for completed tasks.
- **Error**: `#CF6679` (Muted Red)

### 3. Typography
- **Font Family**: 'Inter', sans-serif.
- **Headings**: Light weight (300), large size for date/greeting.
- **Body**: Regular weight (400) for tasks.

### 4. Component Design
- **Task Card**:
    - Transparent background with blur (`backdrop-filter: blur(10px)`).
    - 1px subtle border (`rgba(255, 255, 255, 0.1)`).
    - Rounded corners (`16px`).
- **Input Field**:
    - Floating label or minimal placeholder.
    - No visible border until focused.
    - "Glow" effect on focus.
- **Checkbox**:
    - Custom circular checkbox.
    - Fills with accent color and checkmark animation on click.

### 5. Interactions
- **Hover**: Task cards lift slightly (`transform: translateY(-2px)`).
- **Add Task**: Smooth expansion of the list.
- **Delete**: Swipe or fade out animation.
