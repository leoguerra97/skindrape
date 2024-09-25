import json
import os

# Configuration settings

# Directory where images and responses are stored
IMAGE_FOLDER = os.path.join(os.getcwd(), '../image_storage')
MODEL_PATH = "/Users/Leonardo/Desktop/Skindrape/skindrape/backend/IS_Net/saved_models/isnet-general-use.pth"

MODEL = "gpt-4-vision-preview"

PROMPT = "Analyse the image of a clothing item. And characterise it in the following categories: " \
         "\nBRAND NAME (write brand name if known)" \
         "\nSEASON (fall/winter FW, spring/summer SS)" \
         "\nCATEGORY (cardigan CA, sweatshirts FE, sweaters SW, t-shirts MA, polos PO, jackets GI, shirts CA, chinos CH, jeans JN, pants PN) - For this category only retun classification code" \
         "\nMATERIAL (cotton CO, silk S, elastane EL, linen LI, denim DN)" \
         "\nSTYLE (elegant EL, oversize O, sport S, loungewear LW)" \
         "\nCOLOR (orange OR, grey GR, black NE, blue BL, pink PI, red RE, white WH, brown BR, green VE, purple VI, multicolor MC, neutral tones TN)" \
         "\nNECKLINE / COLLAR (V-neck V, round T, mandarin C, regular N)" \
         "\nSLEEVE (short C, long L, sleeveless S)" \
         "\nPRINT (print yes SI, print no SN)" \
         "\nCLASSIC (classic yes CS, classic no CN)" \
         "\nPOCKET (pocket yes TS, pocket no TN)" \
         "\nLOGO (logo yes LS, logo no LN)" \
         "\nSTRIPES (stripes yes RS, stripes no RN)" \
         "\nCHECKS (checks yes QS, checks no QN)" \
         "\nDENIM (denim yes DS, denim no DN)" \
         "\nZIP (zip yes ZS, zip no ZN)" \
         "\nBUTTONS (buttons yes BS, buttons no BN)" \
         "\nThen generate a short description of the article suited to be published on an online store. Finally also give an Italian translation of the description."


def load_secret_key(filename='./../config.json'):
    try:
        with open(filename, 'r') as file:
            config = json.load(file)
            return config.get('secret_key')
    except FileNotFoundError:
        print(f"Configuration file '{filename}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error decoding JSON from the configuration file '{filename}'.")
        return None

# Usage
API_KEY = load_secret_key()