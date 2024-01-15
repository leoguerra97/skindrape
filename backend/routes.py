from flask import request, jsonify, send_from_directory
from image_processing import encode_image_to_base64, process_image
from storage import save_image, save_response, get_images, rename_image
from config import IMAGE_FOLDER

def configure_routes(app):

    @app.route('/upload', methods=['POST'])
    def upload_image():
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        image_path = save_image(image_file)
        image_name = image_file.filename

        response, new_image_name = process_image(image_path, image_name)

        # Rename the image based on the API response
        new_image_path = rename_image(image_path, new_image_name)
        save_response(response, new_image_name)

        return jsonify({'message': 'Image processed successfully', 'new_image_name': new_image_name, 'response': response}), 200


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