import face_recognition
import cv2
import numpy as np
image_path = '/Users/jamal/Downloads/2abfc48d-be19-412f-a61b-34e77715aa16.JPG'

image = open(image_path,'rb').read()
np_img = np.frombuffer(image,np.uint8)
img = cv2.imdecode(np_img,cv2.IMREAD_COLOR)

print(type(image))
print(type(np_img))
print(type(img))


