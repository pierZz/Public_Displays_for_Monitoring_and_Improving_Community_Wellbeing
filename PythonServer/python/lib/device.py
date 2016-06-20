import cv2, time
import urllib2, base64
import numpy as np
import cv2

class ipCamera(object):

    def __init__(self,url, user = None, password = None):
        self.url = url
        auth_encoded = base64.encodestring('%s:%s' % (user, password))[:-1]
        
        self.req = urllib2.Request(self.url)
        self.req.add_header('Authorization', 'Basic %s' % auth_encoded)
        
    def get_frame(self):
        response = urllib2.urlopen(self.req)
        img_array = np.asarray(bytearray(response.read()), dtype=np.uint8)
        # print img_array
        frame = cv2.imdecode(img_array, 1)
        return frame
    
class Camera(object):

    def __init__(self, camera = 0):
        self.cam = cv2.VideoCapture(camera)
        if not self.cam:
            raise Exception("Camera not accessible")

        self.shape = self.get_frame().shape

    def get_frame(self):
        x,frame = self.cam.read()
        return frame

    def release(self, camera=0):
        self.cam.release()


class ImageReader():

    def __init__(self, location):
        #set the path here
        self.location = location

    def get_frame(self, ):
        #read the file from a specific location
        self.im = cv2.imread(self.location)
        return self.im

    def release(self):
        print "Closed"
