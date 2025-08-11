#!/usr/bin/env python3
"""
Weight Cut Buddy - Diet and Dehydration Planner for Combat Sport Athletes

This script generates personalized weight cut plans using OpenAI's API.
It takes current weight, target weight, and days until fight as inputs.
"""

import os
import sys
from typing import Dict, Any
from dotenv import load_dotenv
from openai import OpenAI

def load_api_key() -> str:
    """Load OpenAI API key from .env file."""
    load_dotenv()
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("Error: OPENAI_API_KEY not found in .env file")
        print("Please create a .env file with your OpenAI API key:")
        print("OPENAI_API_KEY=your_api_key_here")
        sys.exit(1)
    
    return api_key

def validate_inputs(current_weight: float, target_weight: float, days_till_fight: int, weight_unit: str) -> bool:
    """Validate user inputs for safety and reasonableness."""
    if current_weight <= 0 or target_weight <= 0:
        print("Error: Weights must be positive numbers")
        return False
    
    if days_till_fight <= 0:
        print("Error: Days until fight must be a positive number")
        return False
    
    weight_difference = current_weight - target_weight
    
    if weight_difference <= 0:
        print("Error: Current weight must be higher than target weight")
        return False
    
    # Safety check: Flag potentially dangerous cuts
    max_safe_weekly_loss = current_weight * 0.02  # 2% of body weight per week
    max_safe_loss = max_safe_weekly_loss * (days_till_fight / 7)
    
    if weight_difference > max_safe_loss:
        print(f"⚠️  WARNING: This weight cut ({weight_difference:.1f} {weight_unit}) may be unsafe!")
        print(f"Recommended maximum for {days_till_fight} days: {max_safe_loss:.1f} {weight_unit}")
        response = input("Do you want to continue anyway? (y/N): ")
        if response.lower() != 'y':
            return False
    
    return True

def create_weight_cut_prompt(current_weight: float, target_weight: float, days_till_fight: int, weight_unit: str) -> str:
    """Create a detailed prompt for the OpenAI API."""
    weight_difference = current_weight - target_weight
    
    prompt = f"""
You are an expert sports nutritionist and strength coach specializing in weight cutting for combat sports athletes. 
Create a comprehensive, safe, and effective weight cut plan with the following parameters:

ATHLETE DETAILS:
- Current Weight: {current_weight} {weight_unit}
- Target Weight: {target_weight} {weight_unit}
- Weight to Cut: {weight_difference} {weight_unit}
- Days Until Fight: {days_till_fight} days

REQUIREMENTS:
1. Prioritize athlete safety and performance
2. Include both diet and hydration strategies
3. Provide a day-by-day breakdown
4. Include specific meal suggestions and timing
5. Detail hydration protocols (when to start dehydrating, water loading, etc.)
6. Include supplement recommendations if appropriate
7. Mention warning signs to watch for
8. Provide recovery nutrition for post-weigh-in

STRUCTURE YOUR RESPONSE AS:
1. **Overview & Safety Notes**
2. **Phase Breakdown** (if multi-phase approach needed)
3. **Daily Schedule** (day-by-day plan)
4. **Meal Plans & Nutrition**
5. **Hydration Protocol**
6. **Supplements** (if any)
7. **Warning Signs & When to Stop**
8. **Post-Weigh-In Recovery**
9. **Final Tips**

Make sure the plan is realistic, safe, and accounts for maintaining strength and energy for the fight.
If the weight cut seems dangerous, mention safer alternatives or recommend extending the timeline.
"""
    
    return prompt

def get_weight_cut_plan(client: OpenAI, prompt: str) -> str:
    """Get weight cut plan from OpenAI API."""
    try:
        print("🤖 Generating your personalized weight cut plan...")
        print("This may take a moment...")
        
        response = client.chat.completions.create(
            model="gpt-4o",  # Using GPT-4 for better quality advice
            messages=[
                {"role": "system", "content": "You are an expert sports nutritionist and strength coach with extensive experience in safe weight cutting for combat sports. Always prioritize athlete safety and performance."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        sys.exit(1)

def get_user_inputs() -> tuple[float, float, int, str]:
    """Get user inputs for weight cut parameters."""
    print("🥊 Welcome to Weight Cut Buddy!")
    print("Let's create your personalized weight cut plan.\n")
    
    # Get weight unit preference
    while True:
        unit = input("Weight unit - (l)bs or (k)g? ").lower().strip()
        if unit in ['l', 'lbs', 'lb', 'pounds']:
            weight_unit = "lbs"
            break
        elif unit in ['k', 'kg', 'kilos', 'kilograms']:
            weight_unit = "kg"
            break
        else:
            print("Please enter 'l' for lbs or 'k' for kg")
    
    # Get current weight
    while True:
        try:
            current_weight = float(input(f"Current weight ({weight_unit}): "))
            if current_weight > 0:
                break
            else:
                print("Weight must be a positive number")
        except ValueError:
            print("Please enter a valid number")
    
    # Get target weight
    while True:
        try:
            target_weight = float(input(f"Target weight ({weight_unit}): "))
            if target_weight > 0:
                break
            else:
                print("Weight must be a positive number")
        except ValueError:
            print("Please enter a valid number")
    
    # Get days until fight
    while True:
        try:
            days_till_fight = int(input("Days until fight: "))
            if days_till_fight > 0:
                break
            else:
                print("Days must be a positive number")
        except ValueError:
            print("Please enter a valid number")
    
    return current_weight, target_weight, days_till_fight, weight_unit

def save_plan_to_file(plan: str, current_weight: float, target_weight: float, days_till_fight: int) -> str:
    """Save the weight cut plan to a file."""
    filename = f"weight_cut_plan_{current_weight}to{target_weight}_{days_till_fight}days.txt"
    
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("WEIGHT CUT BUDDY - PERSONALIZED PLAN\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Generated Plan Details:\n")
            f.write(f"Current Weight: {current_weight}\n")
            f.write(f"Target Weight: {target_weight}\n")
            f.write(f"Days Until Fight: {days_till_fight}\n")
            f.write(f"Weight to Cut: {current_weight - target_weight}\n\n")
            f.write("=" * 50 + "\n\n")
            f.write(plan)
        
        return filename
    except Exception as e:
        print(f"Warning: Could not save plan to file: {e}")
        return ""

def main():
    """Main function to run the weight cut planner."""
    # Load API key
    api_key = load_api_key()
    client = OpenAI(api_key=api_key)
    
    # Get user inputs
    current_weight, target_weight, days_till_fight, weight_unit = get_user_inputs()
    
    # Validate inputs
    if not validate_inputs(current_weight, target_weight, days_till_fight, weight_unit):
        sys.exit(1)
    
    # Create prompt
    prompt = create_weight_cut_prompt(current_weight, target_weight, days_till_fight, weight_unit)
    
    # Get plan from OpenAI
    plan = get_weight_cut_plan(client, prompt)
    
    # Display the plan
    print("\n" + "=" * 60)
    print("🥊 YOUR PERSONALIZED WEIGHT CUT PLAN")
    print("=" * 60)
    print(plan)
    print("=" * 60)
    
    # Save to file
    filename = save_plan_to_file(plan, current_weight, target_weight, days_till_fight)
    if filename:
        print(f"\n💾 Plan saved to: {filename}")
    
    print("\n⚠️  IMPORTANT DISCLAIMER:")
    print("This plan is generated by AI and should be reviewed by a qualified")
    print("sports nutritionist or medical professional. Always prioritize your")
    print("health and safety over making weight.")
    print("\nGood luck with your fight! 🥊")

if __name__ == "__main__":
    main()
