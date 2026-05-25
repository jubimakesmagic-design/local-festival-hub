from PIL import Image

def scan():
    img = Image.open("/Users/sam/.gemini/antigravity/brain/694983c0-74f2-4aa8-83ef-bd02d532ab18/media__1779712334560.jpg")
    width, height = img.size
    print(f"Image size: {width}x{height}")
    
    # Let's scan along x = 100 (inside the popup) from y = 0 to height
    # to find the exact top and bottom of the popup.
    # The popup has a solid bright blue header at the top, and a dark blue/gray footer at the bottom.
    # Also, outside the popup, there is the top menu or background image.
    for y in range(0, height, 5):
        r, g, b = img.getpixel((100, y))
        print(f"y={y}: R={r}, G={g}, B={b}")

scan()
