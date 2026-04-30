import sys
import json
import base64
from PIL import Image
import torch
from transformers import AutoProcessor, AutoModel

# Load model once
model_name = "HuggingFaceTB/SmolVLM-256M-Instruct"
processor = AutoProcessor.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

def analyze_image(image_path):
    try:
        image = Image.open(image_path)
        
        prompt = """Analyze this website screenshot for accessibility issues.
        Look for:
        - Color contrast problems
        - Text that's too small
        - Missing alt text
        - Focus indicator visibility
        - Layout issues (overlapping, cut off)
        - Heading hierarchy issues
        
        Return ONLY valid JSON array with:
        [{
            "id": "unique-id",
            "impact": "critical/serious/moderate/minor",
            "description": "problem description",
            "help": "how to fix",
            "helpUrl": "https://www.w3.org/WAI/WCAG21/quickref/",
            "nodes": [{"html": "element description", "target": ["*"]}]
        }]
        
        If no issues, return []"""
        
        inputs = processor(images=image, text=prompt, return_tensors="pt")
        
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=1000, temperature=0.3)
        
        response = processor.decode(outputs[0], skip_special_tokens=True)
        
        # Extract JSON from response
        import re
        json_match = re.search(r'\[\s*\{.*\}\s*\]', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return []
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    if len(sys.argv) > 1:
        result = analyze_image(sys.argv[1])
        print(json.dumps(result))
    else:
        print(json.dumps([]))