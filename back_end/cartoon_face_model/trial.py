import os
from io import BytesIO

import cv2 as cv
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from cvzone.SelfiSegmentationModule import SelfiSegmentation
from PIL import Image
from skimage import io, transform
from torch.autograd import Variable
from torch.utils.data import DataLoader, Dataset, IterableDataset
from torchvision import transforms

from .data_loader_preprocess import (RescaleT, StylObjDataset, ToTensor,
                                     ToTensorLab)
from .u2net_model import U2NET


class CustomIterableDataset(IterableDataset):
    'Characterizes a dataset for PyTorch'
    def __init__(self, data):
        'Initialization'
        self.data = data

    def __iter__(self):
        return iter(self.data)


class BuildCartoon :
    def __init__ (self, img_path):
        self.IMG_PATH = img_path

    @staticmethod
    def image2base64 (image):
        import base64
        with BytesIO() as buffer:
            image.save(buffer, format="PNG")
            image_bytes = buffer.getvalue()

        base64_string = base64.b64encode(image_bytes).decode()
        return base64_string

    @staticmethod
    def array_to_image(array_in):
        array_in = np.squeeze(255*(array_in))
        array_in = np.transpose(array_in, (1, 2, 0))
        im = Image.fromarray(array_in.astype(np.uint8))
        return im, array_in
    
    
    @staticmethod
    def bg_removal(path):
        face_bgr = cv.imread(path) #image
        print("image converted to rgb format")
        
        # create class for segmentator
        print("creating segmentator")
        selfie_segmentator  = SelfiSegmentation()
        print("segmentator created")
        
        # segmentated face
        face = selfie_segmentator.removeBG(face_bgr,(255,255,255),cutThreshold= 0.8)
        print("background removed")
        return face
        
    
    @staticmethod
    def face_crop (face):
        img_height = face.shape[0]
        img_width = face.shape[1]
        
        in_width = 300
        in_height = 300
        mean = [104,117,123]
        conf_threshold = 0.7
        
        param_dir = os.path.join(os.getcwd(), "back_end", "cartoon_face_model", "deploy_prototext.txt")
        weigth_dir = os.path.join(os.getcwd(), "back_end", "cartoon_face_model","res10_300x300_ssd_iter_140000_fp16.caffemodel")
        print(f"param_dir is {param_dir}")
        print(f"weigth_dir is {weigth_dir}")
        
        
        # preprocessing & model calling
        blob_pp = cv.dnn.blobFromImage(
            face,
            1.0,
            (in_width,in_height),
            mean,
            swapRB=False,
            crop = False
        )
        print("blob preprocessing completed")
        
        model = cv.dnn.readNetFromCaffe(param_dir,weigth_dir)
        
        print("model built successfully")
        
        model.setInput(blob_pp)
        detections = model.forward()
        print("results found")

        for i in range (detections.shape[2]):
            confidence = detections[0,0,i,2]
            
            if confidence > conf_threshold :
                    x_left_bottom = int(detections[0,0,i,3]*img_width)
                    y_left_bottom = int(detections[0,0,i,4]*img_height)
                    x_right_top = int(detections[0,0,i,5]*img_width)
                    y_right_top = int(detections[0,0,i,6]*img_height)
        
        print("face coordinates found")
        # square shaped image cropping 
        y_diff = abs(y_left_bottom - y_right_top)
        x_diff = abs(x_left_bottom - x_right_top)
        
        y_threshold = 0
        x_threshold = 0
        
        if (y_diff > x_diff ):
            x_threshold = int( abs(x_diff - y_diff) * 0.5)
        elif (y_diff < x_diff):
            y_threshold = int ( abs(x_diff - y_diff)* 0.5)
        else: None

        print("threshold_x = ", x_threshold)
        print("threshold_y = ", y_threshold)
        face = face[
            y_left_bottom - y_threshold : y_right_top + y_threshold,
            x_left_bottom - x_threshold : x_right_top + x_threshold,
            :
        ]
        return face

    @staticmethod
    def join_binary_files(input_file1_path, input_file2_path, output_file_path='u2net_bce_itr_16000_train_3.835149_tar_0.542587-400x_360x.pth'):
        try:
            with open(input_file1_path, 'rb') as file1, open(input_file2_path, 'rb') as file2:
                content1 = file1.read()
                content2 = file2.read()

                # Combine the content of the two input files
                combined_content = content1 + content2

                # Write the combined content to the output file
                with open(output_file_path, 'wb') as output_file:
                    output_file.write(combined_content)

            print(f"Joined the contents of {input_file1_path} and {input_file2_path} into {output_file_path}.")
        except FileNotFoundError:
            print("File not found.")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
    
    
    @staticmethod
    def convert2cartoon (path):
        from torchvision import io

        # if __name__ != "trial":
        #     return
        # IMG = "back_end/cartoon_face_model/temp_face.jpg"
        IMG = path
        rescaleTransformVal = 400
        
        BuildCartoon.join_binary_files('model1.pth', 'model2.pth', 'model.pth')
    
        model_dir = os.path.join(os.getcwd(), "back_end", "cartoon_face_model", "model.pth")
        
        test_stylobj_dataset = StylObjDataset(
            img_name_list = IMG,
            # lbl_name_list = [],
            transform=transforms.Compose(
                [
                    RescaleT(rescaleTransformVal),
                ToTensorLab(flag=0)
                ]
                )
            )
        
        new_test_stylobj_dataset = CustomIterableDataset(test_stylobj_dataset)
        
        a = enumerate(new_test_stylobj_dataset)
        for x,y in a:
            break
        
        input_image = y[np.newaxis,:,:,:,]
        
        print("Object loading completed successfully")
        
        print("....loading U2NET model....")
        net = U2NET(3,3)
        
        if torch.cuda.is_available():
            net.load_state_dict(torch.load(model_dir))
            net.cuda()
        else:
            print("trying loading model again")
            net.load_state_dict(torch.load(model_dir, map_location='cpu'))
        
        print("model loaded successfully")
        net.eval()
        print("model set to evaluation mode")
        
        input_test  = input_image.type(torch.FloatTensor)
        if torch.cuda.is_available():
            input_test = Variable(input_test.cuda())
        else:
            input_test = Variable(input_test)
        
        print("evaluation")
        d1,d2,d3,d4,d5,d6,d7= net(input_test)
        print("evaluation completed")
        
        result = d1
        del d1,d2,d3,d4,d5,d6,d7
            
        base64_string = BuildCartoon.image2base64(BuildCartoon.array_to_image(result.detach().numpy())[0])
        # BuildCartoon.array_to_image(result.detach().numpy()).save("image.png", "PNG")

        return base64_string, BuildCartoon.array_to_image(result.detach().numpy())
    
    @staticmethod
    def build_beautiful (path):
        
        face = BuildCartoon.bg_removal(path)

        face = BuildCartoon.face_crop(face)

        result_string, cartoon_img = BuildCartoon.convert2cartoon(path)

        cartoon_img = cartoon_img[1]

        os.remove(os.path.join(path))
        os.remove(os.path.join('model.pth'))

        return result_string

if __name__ == '__main__':
    string = BuildCartoon.build_beautiful('trial.jpg')
    with open('image.txt', 'w') as f:
        f.write(string)
