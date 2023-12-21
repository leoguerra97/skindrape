# Configuration settings

API_KEY = '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'
IMAGE_FOLDER = '/Users/Leonardo/Desktop/Skindrape/skindrape/image_storage'  # Path to the folder to save images and responses

MODEL = "gpt-4-vision-preview"

PROMPT = "Analyse the image of a clothing item. And characterise it in the following categories: " \
         "\nBRAND NAME (write brand name if known)" \
         "\nSEASON (fall/winter FW, spring/summer SS)" \
         "\nCATEGORY (cardigan CA, sweatshirts FE, sweaters SW, t-shirts MA, polos PO, jackets GI, shirts CA, chinos CH, jeans JN, pants PN)" \
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
