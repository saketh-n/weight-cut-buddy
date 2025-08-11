# Weight Cut Buddy 🥊

A Python script that generates personalized diet and dehydration plans for combat sport athletes using OpenAI's API. Perfect for MMA fighters, boxers, wrestlers, and other combat sport athletes who need to make weight safely and effectively.

## Features

- **Personalized Plans**: Generates custom weight cut plans based on your specific parameters
- **Safety First**: Includes safety checks and warnings for potentially dangerous cuts
- **Comprehensive Planning**: Covers diet, hydration, supplements, and recovery
- **Day-by-Day Breakdown**: Provides detailed daily schedules
- **Multiple Units**: Supports both lbs and kg
- **File Export**: Saves your plan to a text file for easy reference

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up OpenAI API Key

1. Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Copy `env_template.txt` to `.env`:
   ```bash
   cp env_template.txt .env
   ```
3. Edit `.env` and replace `your_openai_api_key_here` with your actual API key

### 3. Run the Script

```bash
python weight_cut_planner.py
```

## Usage

The script will prompt you for:

1. **Weight Unit**: Choose between lbs or kg
2. **Current Weight**: Your current body weight
3. **Target Weight**: Your desired weight for the fight
4. **Days Until Fight**: How many days you have to make the cut

### Example Session

```
🥊 Welcome to Weight Cut Buddy!
Let's create your personalized weight cut plan.

Weight unit - (l)bs or (k)g? l
Current weight (lbs): 185
Target weight (lbs): 170
Days until fight: 14
```

## Safety Features

- **Automatic Safety Checks**: Warns if weight cut exceeds 2% of body weight per week
- **Warning Signs**: Plan includes red flags to watch for during the cut
- **Professional Disclaimer**: Reminds users to consult with medical professionals

## Output

The script will:
1. Display your personalized plan in the terminal
2. Save the plan to a text file (e.g., `weight_cut_plan_185to170_14days.txt`)
3. Include safety warnings and recovery protocols

## Sample Plan Structure

Your generated plan will include:

1. **Overview & Safety Notes**
2. **Phase Breakdown** (if needed)
3. **Daily Schedule**
4. **Meal Plans & Nutrition**
5. **Hydration Protocol**
6. **Supplements** (if appropriate)
7. **Warning Signs & When to Stop**
8. **Post-Weigh-In Recovery**
9. **Final Tips**

## Important Disclaimer

⚠️ **This tool is for informational purposes only. Always consult with a qualified sports nutritionist, dietitian, or medical professional before starting any weight cut program. Your health and safety are more important than making weight.**

## Requirements

- Python 3.7+
- OpenAI API key
- Internet connection

## Dependencies

- `openai>=1.3.0` - OpenAI API client
- `python-dotenv>=1.0.0` - Environment variable management

## License

This project is open source. Use responsibly and prioritize athlete safety.

---

**Good luck with your fight! 🥊**
