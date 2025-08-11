#!/usr/bin/env python3
"""
Weight Cut Buddy - FastAPI Backend Server

FastAPI server that generates personalized weight cut plans using OpenAI's API.
"""

import os
import sys
from typing import Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from openai import OpenAI

# Load environment variables
load_dotenv()

app = FastAPI(title="Weight Cut Buddy API", description="Generate personalized weight cut plans for combat sport athletes")

# Add CORS middleware to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WeightCutRequest(BaseModel):
    """Request model for weight cut plan generation."""
    current_weight: float
    target_weight: float
    days_till_fight: int
    weight_unit: str
    
    @validator('current_weight', 'target_weight')
    def weights_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Weight must be positive')
        return v
    
    @validator('days_till_fight')
    def days_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Days until fight must be positive')
        return v
    
    @validator('weight_unit')
    def valid_weight_unit(cls, v):
        if v.lower() not in ['lbs', 'kg']:
            raise ValueError('Weight unit must be either "lbs" or "kg"')
        return v.lower()

class WeightCutResponse(BaseModel):
    """Response model for weight cut plan."""
    plan: str
    warning_message: str = ""
    is_safe: bool = True

def load_openai_client() -> OpenAI:
    """Load OpenAI client with API key from environment."""
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY in .env file"
        )
    
    return OpenAI(api_key=api_key)

def validate_weight_cut_safety(current_weight: float, target_weight: float, days_till_fight: int, weight_unit: str) -> tuple[bool, str]:
    """Validate if the weight cut is safe and return warning message if needed."""
    weight_difference = current_weight - target_weight
    
    if weight_difference <= 0:
        return False, "Current weight must be higher than target weight"
    
    # Safety check: Flag potentially dangerous cuts
    max_safe_weekly_loss = current_weight * 0.02  # 2% of body weight per week
    max_safe_loss = max_safe_weekly_loss * (days_till_fight / 7)
    
    if weight_difference > max_safe_loss:
        warning = f"⚠️ WARNING: This weight cut ({weight_difference:.1f} {weight_unit}) may be unsafe! Recommended maximum for {days_till_fight} days: {max_safe_loss:.1f} {weight_unit}. Please consult with a medical professional before proceeding."
        return False, warning
    
    return True, ""

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

async def generate_weight_cut_plan(client: OpenAI, prompt: str) -> str:
    """Generate weight cut plan from OpenAI API."""
    try:
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
        raise HTTPException(status_code=500, detail=f"Error generating plan: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Weight Cut Buddy API is running!"}

@app.post("/generate-plan", response_model=WeightCutResponse)
async def generate_plan(request: WeightCutRequest):
    """Generate a personalized weight cut plan."""
    try:
        # Load OpenAI client
        client = load_openai_client()
        
        # Validate safety
        is_safe, warning_message = validate_weight_cut_safety(
            request.current_weight, 
            request.target_weight, 
            request.days_till_fight, 
            request.weight_unit
        )
        
        # Create prompt
        prompt = create_weight_cut_prompt(
            request.current_weight,
            request.target_weight,
            request.days_till_fight,
            request.weight_unit
        )
        
        # Generate plan
        plan = await generate_weight_cut_plan(client, prompt)
        
        return WeightCutResponse(
            plan=plan,
            warning_message=warning_message,
            is_safe=is_safe
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
