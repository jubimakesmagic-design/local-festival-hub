from PIL import Image

def analyze():
    img = Image.open("/Users/sam/.gemini/antigravity/brain/694983c0-74f2-4aa8-83ef-bd02d532ab18/media__1779712334560.jpg")
    # Crop exactly to y=425 to exclude the popup footer bar completely!
    crop_box = (47, 153, 271, 425)
    cropped = img.crop(crop_box)
    cropped.save("/Users/sam/local-festival-hub/public/images/gokseong_roses_official.png")
    print("Perfect crop saved to public/images/gokseong_roses_official.png")

analyze()
