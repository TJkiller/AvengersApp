# 🦸 Avengers Hero Gallery - README

![Marvel](https://img.shields.io/badge/Marvel-Fan%20Project-red) ![Docker](https://img.shields.io/badge/Docker-Containerized-blue) ![Responsive](https://img.shields.io/badge/Design-Fully%20Responsive-green)

Welcome to the **Avengers Hero Gallery** - A responsive web application built by Marvel fans for Marvel fans! Explore detailed profiles of Earth's Mightiest Heroes with comprehensive information, power statistics and stunning visuals.

## ✨ Features

- 🦸 **Interactive Hero Gallery**: Browse through all Avengers with detailed profiles
- 📊 **Animated Power Statistics**: Visual representation with animated progress bars
- 🎨 **Hero-Specific Themes**: Each hero has their own color scheme (Hulk=green, Iron Man=red, etc.)
- 🔍 **Character Details**: Complete background information for every hero
- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet and desktop
- 🌙 **Dark/Light Mode**: Toggle between themes for optimal viewing
- ⚡ **Smooth Animations**: Engaging transitions and interactive elements

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run this project is using Docker and it only takes 2 simple commands!

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed on your system

### Running with Docker

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/avengers-gallery.git
   cd avengers-gallery
   ```

2. **Build and run with one command**:
   ```bash
   docker run -d -p 8080:80 -v "$(pwd):/usr/share/nginx/html" --name avengers-container nginx:alpine
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8080
   ```

### OR: Traditional 2-Step Approach

```bash
# Build the Docker image
docker build -t avengers-gallery .

# Run the container
docker run -d -p 8080:80 --name avengers-container avengers-gallery
```

### Docker Management Commands

```bash
# Stop the container
docker stop avengers-container

# Start it again later
docker start avengers-container

# View running containers
docker ps

# View container logs
docker logs avengers-container

# Remove the container
docker rm avengers-container
```

## 🛠️ Manual Setup (Without Docker)

If you prefer to run without Docker:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/avengers-gallery.git
   cd avengers-gallery
   ```

2. **Start a local server**:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Or using Node.js (if installed)
   npx serve
   
   # Or simply open index.html in your browser
   ```

3. **Open your browser** to `http://localhost:8000` or `http://localhost:3000`

## 🎮 How to Use

1. **Browse Heroes**: Scroll through the hero gallery on the main page
2. **View Details**: Click "Explore Profile" on any hero to see their detailed information
3. **Check Stats**: Each hero page shows animated power statistics across 6 categories
4. **Navigate**: Use "Next Hero" buttons to explore all characters
5. **Toggle Theme**: Use the moon/sun icon in the navigation to switch between light and dark modes

## 🦸 Available Heroes

- **Thor** - The God of Thunder from Asgard
- **Iron Man** - Genius billionaire philanthropist Tony Stark
- **Hulk** - Dr. Bruce Banner's powerful alter ego
- **Captain America** - Super-soldier Steve Rogers
- **Black Widow** - Master spy Natasha Romanoff
- **Hawkeye** - Expert archer Clint Barton

## 🏗️ Project Structure

```
avengers-gallery/
├── index.html              # Main homepage with hero gallery
├── avengerOne.html         # Thor's profile page
├── avengerTwo.html         # Iron Man's profile page
├── avengerThree.html       # Hulk's profile page
├── avengerFour.html        # Hawkeye's profile page
├── avengerFive.html        # Captain America's profile page
├── avengerSix.html         # Black Widow's profile page
├── styles.css              # Main stylesheet with global styles
├── styleTwo.css            # Hero-specific theme styles
├── Dockerfile              # Simple Docker configuration
├── images/                 # Hero images directory
└── README.md               # This file
```

## 🐳 Dockerfile

Your project uses this minimal and efficient Dockerfile:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

## 🎨 Design Features

- **Comic-Inspired Design**: Authentic Marvel aesthetic with hero-specific color schemes
- **Smooth Animations**: CSS transitions and JavaScript animations for engagement
- **Responsive Layout**: Flexbox and Grid layout that works on all devices
- **Interactive Elements**: Hover effects, animated stats, and smooth scrolling

## 🔧 Technologies Used

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript**: Interactive elements and animations
- **Docker**: Containerization for easy deployment
- **Nginx**: High-performance web server

## Gallery Preview

### Home Page
<img width="1799" height="919" alt="homepage" src="https://github.com/user-attachments/assets/1c40b672-16f7-4d16-ae3e-eabe1d79f5ba" />

### About Us
<img width="915" height="388" alt="about us" src="https://github.com/user-attachments/assets/e76e0c05-7a93-4f94-83bb-85b44f1a55a4" />

### Contact Page
<img width="902" height="561" alt="contactus" src="https://github.com/user-attachments/assets/52c17404-d261-4c21-b1f8-f0e7576e4486" />

### Hero Menu
<img width="907" height="933" alt="heros" src="https://github.com/user-attachments/assets/af6e4b45-6cb5-4f87-8684-fcce96b213c3" />

### Hero Profile Example (Thor)
<img width="1834" height="951" alt="thor" src="https://github.com/user-attachments/assets/817581b5-c1ae-4d7d-a4be-dab7f05ee0cb" />

## 📊 Power Statistics

Each hero profile includes detailed power metrics across six key attributes:
1. 💡 Intelligence
2. 💪 Strength
3. ⚡ Speed
4. 🛡️ Durability
5. ✨ Power
6. ⚔️ Combat

These statistics provide valuable insights into each Avenger's capabilities and limitations.

## 🤝 Contributing

We welcome contributions from fellow Marvel fans! To contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational and fan purposes. Marvel characters are property of Marvel Entertainment.

## 🙏 Acknowledgments

- Created by Marvel enthusiasts for Marvel fans
- Special thanks to the Marvel Cinematic Universe for inspiration
- Icons provided by Font Awesome
- Images from Unsplash and Marvel promotional material
- Thanks to the FNB App Academy for providing us with the skills that made this project possible.

---

**Excelsior!** Thank you for checking out our Avengers Hero Gallery. Whether you're a longtime Marvel fan or new to the universe, we hope you enjoy exploring the capabilities of Earth's Mightiest Heroes!

![Assemble](https://img.shields.io/badge/Avengers-Assemble!-red)
