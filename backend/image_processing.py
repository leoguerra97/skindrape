import base64
from config import API_KEY, MODEL, PROMPT
import requests

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def is_base64(sb):
    try:
        if isinstance(sb, str):
            # If there's any unicode here, an exception will be thrown and the function will return false
            sb_bytes = bytes(sb, 'ascii')
        elif isinstance(sb, bytes):
            sb_bytes = sb
        else:
            raise ValueError("Argument must be string or bytes")
        return base64.b64encode(base64.b64decode(sb_bytes)) == sb_bytes
    except Exception:
        return False


def process_image(image_input, image_name):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    # Check if the image is already a base64 string, or if it's a file path
    if is_base64(image_input):
        image_base64 = image_input
    else:
        with open(image_input, "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode('utf-8')

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": PROMPT
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 500
    }

    api_response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    response = {'processed': True, 'response': api_response.json()}

    # Update the image name based on the API response
    new_image_name = update_image_name(api_response.json(), image_name)

    return response, new_image_name


def update_image_name(api_response, image_name):
    # Implement your own logic here
    return image_name
