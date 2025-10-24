# Automated Log Analyzer

A comprehensive log analysis application built with Python FastAPI backend and React frontend that provides intelligent parsing, analysis, and visualization of system and application logs in real-time.

## Features

### 🔍 **Intelligent Log Parsing**
- **Multi-format Support**: Apache, Nginx, Syslog, JSON, and custom log formats
- **Auto-detection**: Automatically detects log format from content
- **Regex & JSON Parsing**: Advanced parsing capabilities for structured and unstructured logs
- **Real-time Processing**: Process logs as they arrive

### 📊 **Advanced Analytics**
- **Statistical Analysis**: Comprehensive log statistics and metrics
- **Time-based Analysis**: Hourly, daily, and trend analysis
- **Error Analysis**: Error rate tracking and pattern detection
- **IP Analysis**: IP address monitoring and suspicious activity detection
- **Performance Metrics**: Response time, throughput, and resource usage analysis

### ⚠️ **Anomaly Detection**
- **Machine Learning**: Uses Scikit-learn's Isolation Forest algorithm
- **Automatic Detection**: Identifies unusual patterns without manual configuration
- **Multiple Anomaly Types**: Error spikes, unusual time patterns, suspicious IPs, etc.
- **Real-time Alerts**: Configurable alerting system

### 📈 **Interactive Visualizations**
- **Plotly Integration**: Interactive charts and graphs
- **Real-time Dashboards**: Live monitoring with auto-refresh
- **Multiple Chart Types**: Line charts, bar charts, pie charts, heatmaps, and more
- **Customizable Views**: Filter by date, log level, source, etc.

### 🗄️ **Data Storage**
- **PostgreSQL Integration**: Robust database storage for structured logs
- **Efficient Indexing**: Optimized queries with proper database indexes
- **Data Persistence**: Long-term storage and historical analysis
- **Backup & Recovery**: Database backup and restore capabilities

### 🔄 **Real-time Monitoring**
- **File System Monitoring**: Watch log files for changes using watchdog
- **Live Processing**: Process new log entries as they arrive
- **Performance Tracking**: Monitor processing performance and bottlenecks
- **Alert System**: Real-time notifications for critical events

## Installation

### Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Automated-Log-Analyzer
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Set up PostgreSQL database** (optional)
   ```bash
   # Create database
   createdb log_analyzer
   
   # Create user (optional)
   createuser -P log_analyzer_user
   ```

6. **Configure environment variables** (optional)
   ```bash
   # Edit backend/config.py with your database credentials
   # The app will work without database connection
   ```

7. **Run the application**

   **Option 1: Run from root directory**
   ```bash
   python run_server.py
   ```

   **Option 2: Run from backend directory**
   ```bash
   cd backend
   python run.py
   ```

   **Option 3: Run with uvicorn directly**
   ```bash
   cd backend
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

8. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

9. **Access the application**
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Frontend: http://localhost:5173 (dev) or http://localhost:8000/app (production)

## Usage

### 1. Upload & Parse Logs

- **File Upload**: Upload log files (.log, .txt, .json)
- **Paste Content**: Paste log content directly into the text area
- **Format Selection**: Choose log format or use auto-detection
- **Parse**: Click "Parse Logs" to process the data

### 2. Dashboard Analysis

- **Filter Options**: Filter by date range, log level, source
- **Interactive Charts**: Explore data with various visualizations
- **Metrics Overview**: View key performance indicators
- **Export Data**: Download processed data and reports

### 3. Real-time Monitoring

- **Start Monitoring**: Begin real-time log file monitoring
- **Live Metrics**: View real-time statistics and trends
- **Alert Management**: Configure and manage alerts
- **Performance Tracking**: Monitor system performance

### 4. Anomaly Detection

- **Configure Settings**: Set contamination rate and thresholds
- **Run Detection**: Execute anomaly detection algorithm
- **Review Results**: Analyze detected anomalies
- **Investigate**: Drill down into specific anomaly details

### 5. Settings Configuration

- **Database Settings**: Configure database connection
- **Application Settings**: Set log levels, cache duration, etc.
- **Alert Thresholds**: Configure alerting parameters
- **System Information**: View system and dependency versions

## Configuration

### Database Configuration

The application uses PostgreSQL for data storage. Configure the following parameters in your `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=log_analyzer
DB_USER=postgres
DB_PASSWORD=your_password
```

### Application Settings

Key configuration options in `config.py`:

- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)
- `MAX_LOG_SIZE_MB`: Maximum log file size for processing
- `ANOMALY_THRESHOLD`: Default anomaly detection threshold

### Alert Thresholds

Configure alert thresholds for:
- Error rate percentage
- Log volume (logs per minute)
- Anomaly count
- Response time

## API Reference

### LogParser Class

```python
from log_parser import LogParser

parser = LogParser()
logs_df = parser.parse_logs(log_lines, log_format)
```

### AnomalyDetector Class

```python
from anomaly_detector import AnomalyDetector

detector = AnomalyDetector(contamination=0.1)
detector.fit(logs_df)
anomalies = detector.detect_anomalies(logs_df)
```

### DatabaseManager Class

```python
from database import DatabaseManager

db = DatabaseManager()
db.insert_logs(logs_df)
logs = db.get_logs(start_date, end_date)
```

## Deployment

### Local Deployment

1. **Development Mode**
   ```bash
   streamlit run app.py
   ```

2. **Production Mode**
   ```bash
   streamlit run app.py --server.port 8501 --server.address 0.0.0.0
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM python:3.9-slim
   
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   COPY . .
   EXPOSE 8501
   
   CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
   ```

2. **Build and run**
   ```bash
   docker build -t log-analyzer .
   docker run -p 8501:8501 log-analyzer
   ```

### Cloud Deployment

#### Streamlit Cloud

1. Push your code to GitHub
2. Connect your repository to Streamlit Cloud
3. Configure environment variables
4. Deploy

#### AWS/GCP/Azure

1. Set up a virtual machine or container service
2. Install dependencies
3. Configure database connection
4. Deploy using your preferred method

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

2. **Memory Issues**
   - Reduce `MAX_LOG_SIZE_MB` in config
   - Process logs in smaller batches
   - Increase system memory

3. **Performance Issues**
   - Enable database indexing
   - Use connection pooling
   - Optimize query patterns

### Log Files

Check application logs for debugging:
- Streamlit logs: `~/.streamlit/logs/`
- Application logs: Configured in logging setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

## Roadmap

- [ ] Additional log format support
- [ ] Machine learning model improvements
- [ ] Advanced alerting system
- [ ] API endpoints for external integration
- [ ] Mobile-responsive design
- [ ] Multi-tenant support
- [ ] Advanced security features
- [ ] Performance optimization
