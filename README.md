# TypeMaster - Typing Speed Test App

A modern, feature-rich typing speed test application with real-time statistics, multiple difficulty levels, different test modes, and personal best tracking.

![TypeMaster App](https://img.shields.io/badge/Status-Complete-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### Test Controls
- **Start Test**: Click the start button or click on the passage area to begin typing
- **Difficulty Levels**: Choose from Easy, Medium, or Hard passages with varying complexity
- **Test Modes**:
  - **Timed (60s)**: Race against the clock with a 60-second countdown
  - **Passage Mode**: Take your time with a count-up timer and no time limit
- **Restart Anytime**: Get a new random passage from your selected difficulty

### Typing Experience
- **Real-time Statistics**: See your WPM, accuracy, and time update as you type
- **Visual Feedback**:
  - ✅ Green text for correct characters
  - ❌ Red underlined text for errors
  - 💫 Animated cursor showing your current position
- **Error Correction**: Use backspace to fix mistakes (original errors still count against accuracy)

### Results & Progress
- **Detailed Results**: View WPM, accuracy, correct/incorrect character counts
- **Baseline Established**: First test sets your personal best
- **High Score Celebration**: Beat your personal best and see confetti animation! 🎉
- **Persistent Storage**: Personal best saved across sessions using localStorage

### UI & Design
- **Premium Aesthetics**: Modern design with vibrant gradients and glassmorphism effects
- **Smooth Animations**: Micro-animations and transitions for enhanced UX
- **Fully Responsive**: Optimized layouts for mobile, tablet, and desktop
- **Interactive States**: Hover and focus states for all interactive elements
- **Custom Fonts**: Inter for UI, JetBrains Mono for typing text

## 🚀 Getting Started

### Installation

1. **Clone or download** the project files to your local machine

2. **Project structure**:
```
demo_project/
├── index.html      # Main HTML file
├── style.css       # Stylesheet with design system
├── app.js          # JavaScript application logic
└── data.json       # Passage data for all difficulty levels
```

3. **Open the application**:
   - Simply open `index.html` in your web browser
   - No build process or dependencies required!

### Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Modern browsers with ES6+ support required.

## 📖 How to Use

### Starting a Test

1. **Select Difficulty**: Choose Easy, Medium, or Hard
2. **Select Mode**: Choose Timed (60s) or Passage mode
3. **Click "Start Test"** or click directly on the passage area
4. **Start Typing**: Match the displayed text character by character

### During the Test

- **Real-time Stats**: Watch your WPM and accuracy update live
- **Visual Feedback**: See correct (green) and incorrect (red) characters
- **Backspace**: Correct mistakes by pressing backspace
- **Restart**: Click the restart button to get a new passage anytime

### After Completion

- **View Results**: See your final WPM, accuracy, and character counts
- **Personal Best**: Track your improvement over time
- **Celebration**: Beat your high score and enjoy the confetti! 🎊

## 🏗️ Technical Architecture

### File Structure

#### `index.html`
- Semantic HTML5 structure
- SEO-optimized meta tags
- Google Fonts integration (Inter, JetBrains Mono)
- Accessible markup with proper ARIA attributes
- Results modal for test completion

#### `style.css`
- **Design System**: CSS custom properties for colors, spacing, typography
- **Modern Aesthetics**: 
  - Vibrant HSL color palette
  - Gradient backgrounds and text
  - Glassmorphism effects with backdrop-filter
  - Smooth shadows and glows
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Animations**: Keyframe animations for fade-ins, bounces, pulses, and confetti
- **Accessibility**: Focus states and proper contrast ratios

#### `app.js`
- **State Management**: Centralized state object for all test data
- **Event Handling**: Listeners for all user interactions
- **Typing Logic**: 
  - Character-by-character validation
  - Real-time cursor positioning
  - Error tracking with Set data structure
- **Statistics Calculation**:
  - WPM: (correct characters / 5) / time in minutes
  - Accuracy: (correct characters / total typed) × 100
- **Timer Management**: Countdown for Timed mode, count-up for Passage mode
- **localStorage Integration**: Persistent personal best tracking
- **Confetti Animation**: Dynamic DOM manipulation for celebrations

#### `data.json`
- Structured JSON with passages categorized by difficulty
- **Easy**: 8 short, simple passages with common words
- **Medium**: 6 moderate passages with varied vocabulary
- **Hard**: 6 complex passages with advanced vocabulary and punctuation

### Key Algorithms

**WPM Calculation**:
```javascript
WPM = (correctCharacters / 5) / timeInMinutes
```

**Accuracy Calculation**:
```javascript
Accuracy = (correctCharacters / totalCharactersTyped) × 100
```

**Character Validation**:
- Compare user input character-by-character with passage text
- Track errors in a Set for efficient lookup
- Update visual feedback in real-time

## 🎨 Design Features

### Color Palette
- **Primary**: Purple to Blue gradient (`hsl(260, 85%, 65%)` → `hsl(200, 90%, 60%)`)
- **Accent**: Orange to Pink gradient (`hsl(25, 95%, 60%)` → `hsl(340, 85%, 65%)`)
- **Background**: Dark theme with radial gradient
- **Feedback**: Green for success, Red for errors

### Typography
- **UI Font**: Inter (Google Fonts) - Clean, modern sans-serif
- **Typing Font**: JetBrains Mono - Monospaced for better character distinction

### Effects
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Micro-animations**: Smooth transitions on all interactive elements
- **Gradient Text**: Vibrant gradient fills for headings and stats
- **Confetti**: Particle animation on high score achievement

## 🔧 Customization

### Adding New Passages

Edit `data.json` to add more passages:

```json
{
  "passages": {
    "easy": [
      "Your new easy passage here..."
    ],
    "medium": [
      "Your new medium passage here..."
    ],
    "hard": [
      "Your new hard passage here..."
    ]
  }
}
```

### Changing Timer Duration

In `app.js`, modify the timer initialization:

```javascript
// Change from 60 seconds to your desired duration
state.timeRemaining = 60; // Change this value
```

### Customizing Colors

In `style.css`, update CSS custom properties:

```css
:root {
  --color-primary: hsl(260, 85%, 65%); /* Change these values */
  --color-secondary: hsl(200, 90%, 60%);
  /* ... more colors */
}
```

## 📊 Statistics Explained

- **WPM (Words Per Minute)**: Standard typing speed metric. Calculated as (characters typed / 5) / minutes elapsed. The division by 5 is the standard word length in typing tests.

- **Accuracy**: Percentage of correctly typed characters out of total characters typed. Backspace corrections don't erase original errors.

- **Correct/Incorrect**: Raw character counts for detailed performance analysis.

## 🎯 Tips for Better Scores

1. **Start with Easy**: Build confidence and accuracy before moving to harder passages
2. **Focus on Accuracy**: High accuracy often leads to better WPM than rushing
3. **Use Proper Technique**: Touch typing with all fingers improves speed
4. **Practice Regularly**: Consistent practice leads to improvement
5. **Try Both Modes**: Timed mode for speed, Passage mode for accuracy

## 🐛 Troubleshooting

**Passages not loading?**
- Ensure `data.json` is in the same directory as `index.html`
- Check browser console for errors
- Verify JSON syntax is valid

**Stats not updating?**
- Make sure you've clicked "Start Test" before typing
- Check that JavaScript is enabled in your browser

**Personal best not saving?**
- Ensure localStorage is enabled in your browser
- Check browser privacy settings

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Additional difficulty levels
- Custom passage input
- Typing history graphs
- Multiplayer mode
- Keyboard heatmap

## 💡 Credits

Built with ❤️ for typing enthusiasts

**Technologies Used**:
- HTML5
- CSS3 (with CSS Custom Properties)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter, JetBrains Mono)
- localStorage API

---

**Happy Typing! ⌨️**
