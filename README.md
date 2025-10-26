# Automated Log Analyzer

A modern, AI-powered log analysis application built with Next.js, TypeScript, and Tailwind CSS. Features intelligent parsing, anomaly detection, progressive disclosure UI, and comprehensive analytics with a premium dark theme and micro-animations.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Premium Dark Theme**: Sophisticated dark color scheme with glassmorphism effects
- **Micro-animations**: Smooth hover effects, transitions, and interactive feedback
- **Progressive Disclosure**: Show simple summaries by default with expandable details
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Command Palette**: Universal search and quick actions (Ctrl+K)

### 🔍 **Intelligent Log Parsing**
- **Multi-format Support**: Apache, Nginx, Syslog, JSON, and custom log formats
- **Auto-detection**: Automatically detects log format from content
- **Drag & Drop**: Upload multiple files with visual feedback
- **Paste Content**: Direct text input for quick analysis
- **Real-time Processing**: Process logs instantly in the browser

### 📊 **Advanced Analytics**
- **Statistical Analysis**: Comprehensive log statistics and metrics
- **Time-based Analysis**: Hourly, daily, and trend analysis with peak detection
- **Error Analysis**: Error rate tracking, pattern detection, and source analysis
- **IP Analysis**: IP address monitoring and suspicious activity detection
- **Performance Metrics**: Response time, throughput, and resource usage analysis
- **Security Analysis**: Threat detection and suspicious pattern identification

### ⚠️ **AI-Powered Anomaly Detection**
- **Machine Learning**: Custom Isolation Forest implementation
- **Multiple Anomaly Types**: Error spikes, unusual time patterns, suspicious IPs, SQL injection attempts
- **Real-time Detection**: Instant anomaly identification
- **Detailed Classification**: Categorized anomaly types with explanations
- **Configurable Thresholds**: Adjustable sensitivity settings

### 🤖 **AI-Powered Insights**
- **Smart Recommendations**: AI-generated fix suggestions based on log patterns
- **Root Cause Analysis**: Intelligent analysis of underlying issues
- **Proactive Alerting**: Contextual notifications and recommendations
- **Pattern Recognition**: Advanced pattern detection and correlation

### 📈 **Interactive Visualizations**
- **Dynamic Charts**: Interactive visualizations with smooth animations
- **Real-time Dashboards**: Live monitoring with auto-refresh
- **Multiple Chart Types**: Line charts, bar charts, pie charts, and more
- **Progressive Disclosure**: Show/hide charts based on user preference

### 🎛️ **Progressive Disclosure System**
- **Complexity Levels**: Basic, Intermediate, and Advanced information tiers
- **Collapsible Sections**: Expandable content areas with smooth animations
- **Summary Cards**: Quick overview metrics with trend indicators
- **Visibility Toggles**: Show/hide detailed information as needed
- **Information Hierarchy**: Prevents information overload while keeping power features accessible

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Automate-log
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. Upload & Parse Logs

- **File Upload**: Drag and drop log files (.log, .txt, .json, .csv)
- **Paste Content**: Paste log content directly into the text area
- **Format Selection**: Choose log format or use auto-detection
- **Parse**: Click "Parse Logs" to process the data

### 2. Anomaly Detection

- **Configure Settings**: Set contamination rate and thresholds
- **Run Detection**: Click "Detect Anomalies" to find unusual patterns
- **Review Results**: Analyze detected anomalies with detailed breakdowns
- **Investigate**: Drill down into specific anomaly details

### 3. AI Analysis

- **Smart Insights**: Get AI-powered recommendations after parsing
- **Root Cause Analysis**: Understand the underlying issues
- **Proactive Alerts**: Receive contextual notifications
- **Pattern Recognition**: Discover hidden patterns in your logs

### 4. Progressive Disclosure

- **Basic Level**: Essential metrics always visible
- **Intermediate Level**: Important details collapsed by default
- **Advanced Level**: Technical details hidden by default
- **Customize View**: Show/hide sections based on your needs

### 5. Command Palette

- **Quick Access**: Press `Ctrl+K` to open command palette
- **Search Commands**: Find and execute actions quickly
- **Keyboard Shortcuts**: Navigate efficiently with keyboard
- **Contextual Actions**: Commands adapt to current state

## 🎨 UI Components

### Core Components
- **ProgressiveDisclosure**: Main wrapper with expandable content
- **CollapsibleSection**: Card-based sections with smooth animations
- **SummaryCard**: Compact metric cards with trend indicators
- **ExpandableDetails**: Show/hide detailed information
- **VisibilityToggle**: Toggle content visibility
- **ProgressiveTabs**: Tabbed interface with complexity levels

### Animation System
- **Hover Effects**: Soft scaling, shadow lift, border glow
- **Transitions**: Smooth fade, slide, and scale animations
- **Micro-interactions**: Button feedback, loading states
- **Staggered Animations**: Sequential element animations

## 🛠️ Technical Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons
- **React Dropzone**: File upload handling

### Backend Processing
- **Custom Log Parser**: Multi-format log parsing
- **Anomaly Detection**: Isolation Forest algorithm
- **Data Processing**: Statistical analysis and metrics
- **AI Analysis**: Pattern recognition and recommendations

### Styling & Animations
- **Tailwind CSS**: Responsive design system
- **Custom Animations**: Keyframe-based animations
- **Glassmorphism**: Frosted glass effects
- **Gradient Themes**: Dynamic color schemes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progressive-disclosure.tsx
│   │   └── ...
│   ├── log-analyzer.tsx  # Main analyzer component
│   ├── log-analysis-results.tsx
│   └── ...
├── lib/                  # Utility libraries
│   ├── log-parser.ts     # Log parsing logic
│   ├── anomaly-detector.ts
│   ├── data-processor.ts
│   └── utils.ts
└── types/                # TypeScript definitions
    └── index.ts
```

## 🎯 Key Features Explained

### Progressive Disclosure
The application uses a sophisticated progressive disclosure system to prevent information overload:

- **Basic Level (Green)**: Essential information always visible
- **Intermediate Level (Yellow)**: Important details collapsed by default  
- **Advanced Level (Red)**: Technical details hidden by default

### Anomaly Detection
Custom implementation of the Isolation Forest algorithm:

- **Feature Engineering**: 20+ features extracted from log entries
- **Normalization**: Z-score normalization for consistent analysis
- **Classification**: Automatic anomaly type classification
- **Configurable**: Adjustable contamination rate and thresholds

### AI-Powered Analysis
Intelligent insights and recommendations:

- **Pattern Recognition**: Advanced pattern detection
- **Root Cause Analysis**: Understanding underlying issues
- **Proactive Alerting**: Contextual notifications
- **Smart Recommendations**: AI-generated fix suggestions

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Docker
```bash
docker build -t log-analyzer .
docker run -p 3000:3000 log-analyzer
```

### Static Export
```bash
npm run build
npm run export
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# Optional: Add any required environment variables
NEXT_PUBLIC_APP_NAME="Log Analyzer"
```

### Customization
- **Themes**: Modify colors in `tailwind.config.js`
- **Animations**: Adjust timing in `globals.css`
- **Components**: Customize UI components in `src/components/ui/`

## 📊 Performance

- **Client-side Processing**: All analysis happens in the browser
- **Optimized Bundles**: Next.js automatic code splitting
- **Efficient Rendering**: React 18 concurrent features
- **Smooth Animations**: 60fps animations with CSS transforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Lucide** for beautiful icons
- **Vercel** for deployment platform

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README and code comments
- **Community**: Join discussions in GitHub Discussions

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**