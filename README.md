# Fuel Efficiency of 2017 Cars - Narrative Visualization

An interactive narrative visualization that explores the relationship between city and highway fuel efficiency for 2017 automobiles, implemented as a martini glass structure using D3.js.

## 🚗 Overview

This project presents a data-driven story about car fuel efficiency through an interactive scatter plot visualization. The narrative follows a **martini glass structure** where users are guided through the story before being allowed to explore the data freely.

## ✨ Features

### **Narrative Structure**
- **4 Progressive Scenes** that build understanding step-by-step
- **Martini Glass Design** - guided storytelling followed by free exploration
- **Scene-specific annotations** that highlight key insights
- **Smooth transitions** between narrative phases

### **Interactive Elements**
- **Hide/Show Controls** for description, legend, and chart annotations
- **Navigation buttons** to move between scenes
- **Fuel type filtering** in the exploration phase
- **Interactive tooltips** with detailed car information
- **Responsive design** with professional styling

### **Data Visualization**
- **Scatter plot** showing City MPG vs Highway MPG
- **Color coding** by fuel type (Gasoline, Diesel, Electric)
- **Size encoding** representing engine cylinders
- **Logarithmic scales** for better data distribution
- **Professional annotations** with connecting lines

## 🎯 Narrative Scenes

### **Scene 0: Overview**
- Introduction to the scatter plot and basic patterns
- Highlights the general clustering of cars in the middle efficiency range
- Shows the positive correlation between city and highway MPG

### **Scene 1: Fuel Types**
- Introduces color coding by fuel type
- Demonstrates gasoline dominance in the market
- Shows diesel efficiency advantages

### **Scene 2: Electric Revolution**
- Focuses on electric vehicles as clear outliers
- Highlights the exceptional efficiency of electric powertrains
- Discusses future trends and adoption potential

### **Scene 3: Interactive Exploration**
- Opens up full interactivity for user exploration
- Enables tooltips and filtering capabilities
- Allows users to discover their own insights

## 🛠️ Technical Implementation

### **Technologies Used**
- **D3.js v7** - Core visualization library
- **HTML5/CSS3** - Structure and styling
- **JavaScript ES6+** - Interactive functionality
- **CSV Data** - 2017 automobile fuel efficiency dataset

### **Architecture**
- **Scene Management** - Template-based scene configuration
- **Parameter Control** - State variables for narrative flow
- **Event Triggers** - User interaction handling
- **Annotation System** - Custom D3-based annotations

### **Key Components**
- `sceneConfig` - Centralized scene configuration
- `updateScene()` - Scene rendering and state management
- `drawAnnotations()` - Custom annotation system
- `toggleDescription()` - UI control functions

## 📊 Data

The visualization uses the **2017 Cars Dataset** containing:
- **Make and Model** information
- **City and Highway MPG** ratings
- **Engine Cylinders** count
- **Fuel Type** classification
- **Efficiency metrics** for comparison

## 🎮 How to Use

### **Navigation**
1. **Previous/Next buttons** to move between scenes
2. **Scene progression** is linear and guided
3. **Final scene** unlocks full interactivity

### **Interactive Controls**
- **× button** (top-right) - Hide/show description
- **× button** (legend) - Hide/show legend table
- **Hide/Show Annotations** button - Toggle chart annotations
- **Fuel Filter dropdown** - Filter by fuel type (Scene 3 only)

### **Data Exploration**
- **Hover over points** to see detailed car information
- **Filter by fuel type** to focus on specific categories
- **Observe patterns** in efficiency across different vehicle types

## 🚀 Getting Started

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### **Installation**
1. Clone or download the project files
2. Ensure all files are in the same directory structure:
   ```
   m-cnava.github.io/
   ├── index.html
   ├── style.css
   ├── js/main.js
   ├── data/cars2017.csv
   └── README.md
   ```

### **Running Locally**
```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 📝 Assignment Requirements Met

### **Narrative Structure** ✅
- **Martini Glass** implementation with guided storytelling
- **4 distinct scenes** with clear progression
- **Exploration phase** in final scene

### **Core Elements** ✅
- **Scenes**: Template-based with visual consistency
- **Annotations**: Strategic highlighting of key insights
- **Parameters**: State variables controlling narrative flow
- **Triggers**: Event-driven user interactions

### **Technical Requirements** ✅
- **D3.js implementation** (no high-level tools)
- **d3-annotation library** (custom implementation)
- **Interactive web page** with professional design
- **Public hosting** ready for GitHub Pages

## 🎨 Design Features

### **Visual Design**
- **Clean, modern interface** with consistent styling
- **Professional color scheme** and typography
- **Responsive layout** that works on different screen sizes
- **Smooth animations** and transitions

### **User Experience**
- **Intuitive navigation** with clear affordances
- **Progressive disclosure** of information
- **Customizable interface** with hide/show controls
- **Accessible design** with proper contrast and sizing

## 📈 Key Insights

The visualization reveals several important patterns:
- **Electric vehicles** achieve significantly higher efficiency
- **Positive correlation** between city and highway MPG
- **Gasoline dominance** in the 2017 market
- **Diesel advantages** in highway efficiency
- **Engine size impact** on overall efficiency

## 🔧 Customization

### **Adding New Scenes**
1. Add scene description to `sceneDescriptions` array
2. Create scene configuration in `sceneConfig` object
3. Define annotations and visual parameters
4. Update navigation logic if needed

### **Modifying Annotations**
- Edit annotation positions in `sceneConfig`
- Adjust styling in `drawAnnotations()` function
- Customize text content and positioning

### **Data Updates**
- Replace `data/cars2017.csv` with new dataset
- Update data processing in the main script
- Adjust scales and visual encoding as needed

## 📄 License

This project is created for educational purposes as part of a data visualization course assignment.

## 🤝 Contributing

This is an academic project, but suggestions and improvements are welcome through issues or discussions.

---

**Created by:** Cesar Nava  
**Course:** Data Visualization  
**Assignment:** Narrative Visualization  
**Date:** 2025
