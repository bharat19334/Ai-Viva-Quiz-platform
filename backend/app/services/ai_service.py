from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_questions(text: str, num_questions: int) -> list:
    prompt = f"""Read this text and generate exactly {num_questions} questions.
Return ONLY a JSON array, nothing else, no markdown, no explanation.

Format:
[
    {{
        "question": "question here",
        "answer": "expected answer here",
        "difficulty": "medium"
    }}
]

Text: {text[:3000]}"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    clean = response.choices[0].message.content.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(clean)

async def evaluate_answer(question: str, expected: str, student_answer: str) -> dict:
    prompt = f"""Question: {question}
Expected Answer: {expected}
Student Answer: {student_answer}

Evaluate and return ONLY a JSON object, nothing else, no markdown.

Format:
{{
    "score": 7,
    "out_of": 10,
    "feedback": "your feedback here",
    "is_correct": true
}}"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    clean = response.choices[0].message.content.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(clean)