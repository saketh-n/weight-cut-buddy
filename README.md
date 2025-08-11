# Weight Cut Buddy 🥊

A full-stack web application that generates personalized diet and dehydration plans for combat sport athletes using OpenAI's API. Perfect for MMA fighters, boxers, wrestlers, and other combat sport athletes who need to make weight safely and effectively.

## Features

- **Modern Web Interface**: Clean, responsive React frontend with beautiful UI
- **FastAPI Backend**: High-performance Python API server
- **Personalized Plans**: Generates custom weight cut plans based on your specific parameters
- **Safety First**: Includes safety checks and warnings for potentially dangerous cuts
- **Real-time Generation**: Live plan generation with loading indicators
- **Comprehensive Planning**: Covers diet, hydration, supplements, and recovery
- **Unit Flexibility**: Toggle between lbs and kg with a simple button
- **Professional Disclaimers**: Emphasizes medical consultation for safety

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **OpenAI GPT-4** - AI-powered plan generation
- **Pydantic** - Data validation and settings management
- **Python-dotenv** - Environment variable management

### Frontend
- **React** - Modern UI library
- **CSS3** - Custom styling with gradients and animations
- **Responsive Design** - Works on desktop and mobile

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd weight-cut-buddy
```

### 2. Install Dependencies
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
cd frontend
npm install
cd ..
```

### 3. Configure OpenAI API
1. Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Copy `env_template.txt` to `.env`:
   ```bash
   cp env_template.txt .env
   ```
3. Edit `.env` and replace `your_openai_api_key_here` with your actual API key

### 4. Start the Application
```bash
# On macOS/Linux
./start.sh

# On Windows
start.bat
```

The application will start both services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Usage

1. **Select Weight Unit**: Toggle between lbs and kg
2. **Enter Current Weight**: Your current body weight
3. **Enter Target Weight**: Your desired weight for the fight
4. **Enter Days Until Fight**: How many days you have to make the cut
5. **Click Calculate**: Generate your personalized plan

### Example
- Current Weight: 185 lbs
- Target Weight: 170 lbs
- Days Until Fight: 14
- Weight Unit: lbs

The system will generate a comprehensive plan including daily schedules, meal plans, hydration protocols, and safety warnings.

## API Endpoints

### `POST /generate-plan`
Generate a weight cut plan.

**Request Body:**
```json
{
  "current_weight": 185.0,
  "target_weight": 170.0,
  "days_till_fight": 14,
  "weight_unit": "lbs"
}
```

**Response:**
```json
{
  "plan": "Detailed weight cut plan...",
  "warning_message": "Safety warning if applicable",
  "is_safe": true
}
```

## Safety Features

- **Automatic Safety Checks**: Warns if weight cut exceeds 2% of body weight per week
- **Visual Warnings**: Clear warning messages in the UI
- **Professional Disclaimers**: Reminds users to consult with medical professionals
- **Input Validation**: Prevents invalid or dangerous inputs

## Project Structure

```
weight-cut-buddy/
├── backend/
│   └── main.py              # FastAPI server
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styling
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json         # Node.js dependencies
├── legacy/
│   └── weight_cut_planner.py # Original CLI script
├── requirements.txt         # Python dependencies
├── start.sh                 # Start script (macOS/Linux)
├── start.bat               # Start script (Windows)
├── .env                    # Environment variables (create from template)
└── README.md               # This file
```

## Development

### Backend Development
```bash
cd backend
python main.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### API Documentation
Visit http://localhost:8000/docs for interactive API documentation.

## Important Disclaimer

⚠️ **This tool is for informational purposes only. Always consult with a qualified sports nutritionist, dietitian, or medical professional before starting any weight cut program. Your health and safety are more important than making weight.**

## Requirements

- Python 3.7+
- Node.js 14+
- OpenAI API key
- Internet connection

## License

This project is open source. Use responsibly and prioritize athlete safety.

---

**Good luck with your fight! 🥊**