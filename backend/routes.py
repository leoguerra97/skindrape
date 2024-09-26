from flask import request, jsonify, send_from_directory
from image_processing import encode_image_to_base64, process_image
from storage import create_unique_id_for_image, save_response, get_images, rename_image
from config import IMAGE_FOLDER, MODEL_PATH
from segment import segment_image
from IS_Net.models.isnet import ISNetDIS
import torch
import os
from config import API_KEY

os.environ['KMP_DUPLICATE_LIB_OK']='TRUE'

net = ISNetDIS()
# Load the model
if torch.cuda.is_available():
    net.load_state_dict(torch.load(MODEL_PATH))
    net = net.cuda()
else:
    net.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
net.eval()

def configure_routes(app):
    @app.route('/upload', methods=['POST'])
    def upload_image():
        # Get the list of files
        image_files = request.files.getlist('image')  # Get the list of files

        if not image_files:
            return jsonify({'error': 'No image provided'}), 400

        responses = []
        for image_file in image_files:
            image_name = image_file.filename
            image_path = create_unique_id_for_image(image_file)
            # Save the image
            image_file.save(image_path)

            # Segment the image step
            segmented_image_path, segmented_image_name = segment_image(image_path, image_name, IMAGE_FOLDER, net)

            # ChatGPT step
            response, new_image_name = process_image(segmented_image_path, segmented_image_name)

            # Rename the image based on the API response
            # new_image_path = rename_image(image_path, new_image_name)
            save_response(response, new_image_name)

            responses.append(
                {'message': 'Image processed successfully', 'new_image_name': new_image_name, 'response': response})

        return jsonify(responses), 200

    @app.route('/images', methods=['GET'])
    def list_images():
        images = get_images()
        return jsonify(images)

    @app.route('/images/<filename>', methods=['GET'])
    def get_image(filename):
        return send_from_directory(IMAGE_FOLDER, filename)

    @app.route('/responses/<filename>', methods=['GET'])
    def get_response(filename):
        return send_from_directory(IMAGE_FOLDER, filename)