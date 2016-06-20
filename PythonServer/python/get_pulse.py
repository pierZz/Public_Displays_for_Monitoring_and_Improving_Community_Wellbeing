from lib.device import ImageReader
from lib.processors import findFaceGetPulse
from lib.interface import plotXY, imshow, waitKey,destroyWindow, moveWindow
import numpy as np      
import datetime
import thread
import time
import json
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import base64
class SimpleEcho(WebSocket):

    def handleMessage(self):
        # echo message back to client
        g = open("try.jpg", "w")
        g.write(base64.decodestring(self.data[23:]))
        g.close()
        returned = App.main_loop()
        d = {
            'square':[returned[0][0],returned[0][1],returned[0][2],returned[0][3]],
            'bpm' : returned[1]    
        }

        self.sendMessage(json.dumps(d));

    def handleConnected(self):
        global App
        App = getPulseApp()
        print self.address, 'connected'

    def handleClose(self):
        print self.address, 'closed'

class getPulseApp(object):
    """
    Python application that finds a face in a webcam stream, then isolates the
    forehead.

    Then the average green-light intensity in the forehead region is gathered 
    over time, and the detected person's pulse is estimated.
    """
    def __init__(self):
        #Imaging device - must be a connected camera (not an ip camera or mjpeg
        #stream)
        self.camera = ImageReader("try.jpg") #first camera by default
        self.w,self.h = 0,0
        self.pressed = 0
        #Containerized analysis of recieved image frames (an openMDAO assembly)
        #is defined next.

        #This assembly is designed to handle all image & signal analysis,
        #such as face detection, forehead isolation, time series collection,
        #heart-beat detection, etc. 

        #Basically, everything that isn't communication
        #to the camera device or part of the GUI
        self.processor = findFaceGetPulse(bpm_limits = [50,160],
                                          data_spike_limit = 2500.,
                                          face_detector_smoothness = 10.)  

        #Init parameters for the cardiac data plot
        self.bpm_plot = False
        self.plot_title = "Cardiac info - raw signal, filtered signal, and PSD"

        #Maps keystrokes to specified methods
        #(A GUI window must have focus for these to work)
        self.key_controls = {"s" : self.toggle_search,
                             "d" : self.toggle_display_plot,
                             "f" : self.write_csv}
        
    def write_csv(self):
        """
        Writes current data to a csv file
        """
        bpm = " " + str(int(self.processor.measure_heart.bpm))
        fn = str(datetime.datetime.now()).split(".")[0] + bpm + " BPM.csv"
        
        data = np.array([self.processor.fft.times, 
                         self.processor.fft.samples]).T
        np.savetxt(fn, data, delimiter=',')
        


    def toggle_search(self):
        """
        Toggles a motion lock on the processor's face detection component.

        Locking the forehead location in place significantly improves
        data quality, once a forehead has been sucessfully isolated. 
        """
        state = self.processor.find_faces.toggle()
        if not state:
        	self.processor.fft.reset()
        print "face detection lock =",not state

    def toggle_display_plot(self):
        """
        Toggles the data display.
        """
        if self.bpm_plot:
            print "bpm plot disabled"
            self.bpm_plot = False
            destroyWindow(self.plot_title)
        else:
            print "bpm plot enabled"
            self.bpm_plot = True
            self.make_bpm_plot()
            moveWindow(self.plot_title, self.w,0)

    def make_bpm_plot(self):
        """
        Creates and/or updates the data display
        """
        plotXY([[self.processor.fft.times, 
                 self.processor.fft.samples],
                [self.processor.fft.even_times[4:-4], 
                 self.processor.measure_heart.filtered[4:-4]],
                [self.processor.measure_heart.freqs, 
                 self.processor.measure_heart.fft]], 
               labels = [False, False, True],
               showmax = [False,False, "bpm"], 
               label_ndigits = [0,0,0],
               showmax_digits = [0,0,1],
               skip = [3,3,4],
               name = self.plot_title, 
               bg = self.processor.grab_faces.slices[0])

    def key_handler(self):    
        """
        Handle keystrokes, as set at the bottom of __init__()

        A plotting or camera frame window must have focus for keypresses to be
        detected.
        """

        self.pressed = waitKey(10) & 255 #wait for keypress for 10 ms
        if self.pressed == 27: #exit program on 'esc'
            print "exiting..."
            exit()

        for key in self.key_controls.keys():
            if chr(self.pressed) == key:
                self.key_controls[key]()

    def main_loop(self):
        """
        Single iteration of the application's main loop.
        """
        # Get current image frame from the camera
        frame = self.camera.get_frame()
        if isinstance(frame, (np.ndarray, np.generic) ):
            self.h, self.w, _c = frame.shape

            #display unaltered frame
            #imshow("Original",frame)

            #set current image frame to the processor's input
            self.processor.frame_in = frame

            #process the image frame to perform all needed analysis
            self.processor.run()

            # this is the array of faces x y w h    
            # self.processor.find_faces.detected 
            # for rect in self.processor.find_faces.detected:
            #     x,y,w,h = rect
            # send this to the client and draw the face square witht the bpm of the line below
            # self.processor.measure_heart.bpm
            return (self.processor.find_faces.detected[0], self.processor.measure_heart.bpm)
            #collect the output frame for display
            # output_frame = self.processor.frame_out

            # #show the processed/annotated output frame
            # imshow("Processed",output_frame)
            # # print self.processor.measure_heart.bpm
            # #create and/or update the raw data display if needed
            # if self.bpm_plot:
            #     self.make_bpm_plot()

            # #handle any key presses
            # self.key_handler()

if __name__ == "__main__":
    App = getPulseApp()
    server = SimpleWebSocketServer('', 8082, SimpleEcho)
    server.serveforever()

