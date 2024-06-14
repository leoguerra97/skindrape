# This module should handle the storage of images and their responses
# You can implement local file storage, database storage, etc.

import os
from datetime import datetime
import uuid
from config import IMAGE_FOLDER
from werkzeug.utils import secure_filename
import json

def create_unique_id_for_image(image_file):
    if not os.path.exists(IMAGE_FOLDER):
        os.makedirs(IMAGE_FOLDER)

    # Generating a unique name based on the current time and a UUID
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex
    filename = secure_filename(f"{timestamp}_{unique_id}_{image_file.filename}")
    image_path = os.path.join(IMAGE_FOLDER, filename)


    return image_path

def rename_image(original_path, new_name):
    new_path = os.path.join(IMAGE_FOLDER, new_name)
    os.rename(original_path, new_path)
    return new_path

def save_response(response, new_image_name):
    response_path = os.path.join(IMAGE_FOLDER, f"{os.path.splitext(new_image_name)[0]}_response.json")
    with open(response_path, 'w') as response_file:
        json.dump(response, response_file, indent=4)

def get_images():
    images = []
    for filename in os.listdir(IMAGE_FOLDER):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(IMAGE_FOLDER, filename)
            base_name = os.path.splitext(filename)[0]

            # Assuming the response file follows a naming convention like 'image_response.json'
            response_file = base_name + '_response.json'
            response_path = os.path.join(IMAGE_FOLDER, response_file)

            # Check if the corresponding response file exists
            if os.path.exists(response_path):
                images.append({'image_path': image_path, 'response_path': response_path})

    return images