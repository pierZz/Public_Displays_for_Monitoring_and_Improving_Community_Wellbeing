from lib.processors import findFaceGetPulse
import cv2
cam = cv2.VideoCapture(0)
image,frame = cam.read()
cam.release()
proc = findFaceGetPulse(bpm_limits = [50,160],
                                          data_spike_limit = 2500.,
                                          face_detector_smoothness = 10.) 
proc.frame_in = frame
proc.run()
output_frame = proc.frame_out
print output_frame
exit
