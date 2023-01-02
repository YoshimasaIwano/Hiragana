'''
    the preporcessing for new dataset to resize and save iamges.

    Author: YoshimasaIwano
'''

import os 
import glob
from PIL import Image

parent_dir = './new_datasets'
files = glob.glob('./new_raw_datasets/*/*.jpg')
def main():
    IMG_SIZE = 48
    for f in files:
        img = Image.open(f)
        img_resize = img.resize((IMG_SIZE, IMG_SIZE), Image.Resampling.LANCZOS)
        root, ext = os.path.splitext(f)
        root = root.replace('new_raw_datasets', 'datasets')
        # os.makedirs(os.path.join(parent_dir, os.path.basename(os.path.dirname(root))), exist_ok=True)
        img_resize.save(root + '.png')

if __name__ == '__main__':
    main()