import os
import numpy as np
from skimage import io
import torch
import torch.nn.functional as F
from torchvision.transforms.functional import normalize
from IS_Net.models.isnet import ISNetDIS  # Ensure this import path matches your model's location
import matplotlib.pyplot as plt

def segment_image(image_path, image_name, result_path, net):
    input_size = [1024, 1024]

    # Load and process the image
    im = io.imread(image_path)
    if im.ndim == 2:  # Handle grayscale images
        im = np.stack((im,)*3, axis=-1)
    elif im.shape[2] == 4:  # Handle RGBA images
        im = im[..., :3]

    im_tensor = torch.from_numpy(im).float().permute(2, 0, 1).unsqueeze(0) / 255.0  # Normalize pixel values to [0,1]
    im_tensor = F.interpolate(im_tensor, size=input_size, mode='bilinear', align_corners=False)
    im_tensor = normalize(im_tensor, [0.5, 0.5, 0.5], [1.0, 1.0, 1.0])

    # Predict the mask
    with torch.no_grad():
        if torch.cuda.is_available():
            im_tensor = im_tensor.cuda()
        result = net(im_tensor)
        result = torch.squeeze(F.interpolate(result[0][0], size=im.shape[:2], mode='bilinear', align_corners=False), 0)
        mask = (result > 0.5).cpu().numpy()  # Thresholding for binary mask

    # Apply the mask to the original image
    segmented_image = apply_mask_to_image(im, mask)
    #display_images(im, mask, segmented_image)  # Debugging: Visualize results

    # Save the segmented image
    filename, extension = os.path.splitext(image_name)
    segmented_image_name = filename + '_segmented' + extension
    segmented_image_path = os.path.join(result_path, segmented_image_name)
    io.imsave(segmented_image_path, segmented_image)

    return segmented_image_path, segmented_image_name

def apply_mask_to_image(original_image, mask):
    """
    Apply a binary mask to the original image by expanding the mask to match the color channels of the image.

    Parameters:
        original_image (numpy.ndarray): The original RGB image.
        mask (numpy.ndarray): The binary mask, expected to be in shape (height, width) or (1, height, width).

    Returns:
        numpy.ndarray: The segmented image.
    """
    # Ensure the mask is binary (0 or 1)
    mask = (mask > 0.5).astype(np.uint8)

    # Remove any singleton dimensions in mask (e.g., (1, height, width))
    mask = np.squeeze(mask)

    # Check if the mask is not 3-dimensional, repeat the mask 3 times to match image dimensions
    if mask.ndim == 2:
        mask = np.repeat(mask[:, :, np.newaxis], 3, axis=2)

    # Apply the mask to each color channel
    segmented_image = original_image * mask
    return segmented_image
def display_images(original_image, mask, segmented_image):
    plt.figure(figsize=(12, 4))

    plt.subplot(1, 3, 1)
    plt.imshow(original_image)
    plt.title('Original Image')
    plt.axis('off')

    plt.subplot(1, 3, 2)
    # Ensure mask is 2D by squeezing it
    if mask.ndim > 2:
        mask = np.squeeze(mask)
    plt.imshow(mask, cmap='gray')
    plt.title('Mask')
    plt.axis('off')

    plt.subplot(1, 3, 3)
    plt.imshow(segmented_image)
    plt.title('Segmented Image')
    plt.axis('off')

    plt.show()

if __name__ == "__main__":
    from config import IMAGE_FOLDER, MODEL_PATH
    IMAGE_PATH = '/Users/Leonardo/Desktop/Skindrape/skindrape/test_images/lacoste-ah1988-maglione_girocollo_in_lana_merino-casual-uomo-041531501_476_1.jpg'
    IMAGE_NAME = 'lacoste.jpg'
    RESULT_PATH = '/Users/Leonardo/Desktop/Skindrape/skindrape/test_images/'

    net = ISNetDIS()
    try:
        if torch.cuda.is_available():
            net.load_state_dict(torch.load(MODEL_PATH))
            net = net.cuda()
        else:
            net.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
        net.eval()
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Failed to load model: {e}")

    segment_image(IMAGE_PATH, IMAGE_NAME, RESULT_PATH, net)
