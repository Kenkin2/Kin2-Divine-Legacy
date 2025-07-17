from fastapi import FastAPI
from services import comprehend, tts, Grok3, RayRLlib

app = FastAPI()

@app.post("/trauma-mapping")
async def trauma_mapping(data: dict):
    stories = data["ancestralStories"]
    analysis = await comprehend.analyze_sentiment(stories)
    soul_wound = await Grok3.generate(f"Analyze soul wound from {stories} with Indigenous context")
    healing_steps = await Grok3.generate(f"Healing plan for {analysis.sentiment} with elder storytelling")
    return {"analysis": analysis, "soulWound": soul_wound, "healingSteps": healing_steps}

@app.post("/generate-narration")
async def generate_narration(data: dict):
    text = data["text"]
    language = data["language"]
    audio = await tts.generate(text, f'tts_models/indigenous/{language}')
    return {"audio": audio}
