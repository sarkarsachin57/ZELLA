

'''
Copyright 2024 AvaWatz

All rights reserved. This source code and its compiled form are confidential and proprietary to AvaWatz. 
No part of this source code may be copied, modified, distributed, or otherwise used, in whole or in part, 
by any person or entity other than authorized members of AvaWatz without the explicit written consent of AvaWatz.

For inquiries regarding the use of this source code, please contact AvaWatz.
'''

import os

# print("before loading mongodb ----")
# os.system(f"free -h")

import setproctitle, pymongo, psutil, traceback, re, uuid, subprocess, numpy as np
from datetime import datetime, timedelta


mongodb = pymongo.MongoClient('mongodb://localhost:27017')['ZELLA_TEST_1']

# print("after loading mongodb ----")
# os.system(f"free -h")





def extract_outermost_user_code_info(traceback_str):
    # Regular expression to match file path, line number, and function name
    regex = r'File "([^"]+)", line (\d+), in ([^\n]+)'
    
    # Find all matches in the traceback string
    matches = re.findall(regex, traceback_str)
    
    user_code_matches = [match for match in matches if "python3" not in match[0]]
    
    if user_code_matches:
        match = user_code_matches[0]
    else:
        match = matches[0]
    outermost_info = {
        'filename': match[0].split('/')[-1],
        'full_path': match[0],
        'line_number': int(match[1]),
        'function_name': match[2].strip()
    }
    return outermost_info



def log_exception(e, additional_info=None):
    try:
        
        # logger.debug('===========> Logging Exception to Database.............')
        # logger.error(e)
        err_uuid = uuid.uuid4().__str__()
        time_now = datetime.now()
        time_now_str = time_now.strftime('%Y-%m-%d %I:%M:%S %p')
        tb_str = traceback.format_exc()
        tb_info = extract_outermost_user_code_info(tb_str)
        error_type = type(e).__name__
        tb = traceback.extract_tb(e.__traceback__)[-1]
        filepath = tb_info["full_path"]#tb.filename
        filename = tb_info["filename"]#filepath.split('/')[-1]
        line_number = tb_info["line_number"]#tb.lineno
        function_name = tb_info["function_name"]#tb.name
        error_short_message = str(e)

        
        error_info = {
            "_id": err_uuid+'_'+time_now_str,
            "datetime": time_now,
            "datetime_str" : time_now_str,
            "error_type": error_type,
            'filename' : filename,
            'filepath' : filepath, 
            'line_no' : line_number,
            'function' : function_name,
            "error": error_short_message,
            "full_traceback": tb_str,
            "additional_info" : additional_info,
        }

        mongodb['errordb'].insert_one(error_info)

        # send_telegram_channel(channel_ids=['@arwen4errors'], body=tb_str, files=[])
        
    except:
        pass
    

def get_gpu_memory_usage():
    
    try:
        # Run nvidia-smi command to get GPU memory usage
        result = subprocess.run(
            ['nvidia-smi', '--query-gpu=memory.used,memory.total', '--format=csv,nounits,noheader'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        
        # Parse the output
        memory_usage = result.stdout.strip().split('\n')
        memory_info = [list(map(int, mem.split(','))) for mem in memory_usage]
        
        # Print GPU memory usage

        
        gpu_used = {}
        gpu_ids = []
        used_mem = []
        for idx, (used, total) in enumerate(memory_info):
            gpu_used[idx] = used
            print(f"GPU {idx}: {used} MiB / {total} MiB")
            used_mem.append(used)
            gpu_ids.append(f"cuda:{idx}")
            
    except:
        return 0,["cpu"],0
        
        

    return gpu_used, gpu_ids[np.argmin(used_mem)], gpu_ids[np.argmax(used_mem)]

        


def log_resources_usage(title='', file_name="", check_id=0):
    try:
        print('\n')
        print('Logging Resourse Usage - '+title)
        cpu_percent = psutil.cpu_percent()
        total_memory = round(psutil.virtual_memory().total/(1024*1024*1024), 3)
        available_memory = round(psutil.virtual_memory().available/(1024*1024*1024), 3)
        used_memory = round(psutil.virtual_memory().used/(1024*1024*1024), 3)
        used_memory_percent = psutil.virtual_memory().percent
        # logger.info(f'CPU Usage : {psutil.cpu_percent()}%')
        # logger.info(f'Memory - Total : {total_memory} GB, Available : {available_memory} GB, Used : {used_memory} GB ({used_memory_percent}%)')
        gpu_memory = get_gpu_memory_usage()[0]
        gpu_memory_usage = 0
        if gpu_memory != 0:
            for id in gpu_memory:
                gpu_memory_usage += gpu_memory[id]
        print(f"gpu_memory : {gpu_memory}")
        # if torch.cuda.is_available():
        #     torch.cuda.reset_peak_memory_stats()
        #     gpu_memory = round(torch.cuda.max_memory_allocated()/(1024*1024*1024), 3) * 10
        #     logger.info(f'GPU Memory Used - {gpu_memory} GB')

        print(f"{file_name} - {title}")
        # os.system(f"free -h")

        mongodb['resource_utilization'].insert_one({"title" : title, 
                                                    "file_name" : file_name,
                                                    "check_id" :  check_id,
                                                    "datetime" : datetime.now(), 
                                                    "datetime_str": datetime.now().strftime('%Y-%m-%d %I:%M:%S %p'),
                                                    "cpu_percent" : cpu_percent,
                                                    "total_memory" : total_memory,
                                                    "available_memory" : available_memory,
                                                    "used_memory" : used_memory,
                                                    "used_memory_percent" : used_memory_percent, 
                                                    "gpu_memory" : gpu_memory_usage})
        print('\n')

    except Exception as e:
        log_exception(e)
        traceback.print_exc()



log_resources_usage(title=f'before any initializations', file_name="initials.py", check_id=1)



# Necessary Imports
import os, platform, requests, torch, tensorflow as tf, pandas as pd, numpy as np, torch.nn as nn, socket, gdown, \
        torchvision.transforms as standard_transforms, torch.multiprocessing as mp, \
        torchvision, math, redis, pymongo, pickle, random, logging, psutil, cv2, sys, PIL, \
        argparse, imutils, time, json, gc, uuid, websockets, asyncio, struct, \
        threading, base64, markdown.extensions.fenced_code, traceback, plotly, \
        plotly.graph_objs as go, plotly.express as px, matplotlib.pyplot as plt, apricot, shutil, re, zipfile
# import submodlib
from moviepy.editor import VideoFileClip, concatenate_videoclips
from tqdm import tqdm
import moviepy.video.fx.all as vfx
from threading import Thread
from torch.multiprocessing import Process, current_process, set_start_method, Queue
from argparse import ArgumentParser
from PIL import Image, ImageDraw, ImageFont, ImageColor
from typing import List, Optional
from imutils.video import VideoStream
from imutils.video import FPS
from itertools import combinations
from matplotlib.path import Path as mlt_path
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances


log_resources_usage(title=f'after all library initializations', file_name="initials.py", check_id=2)


SERVER_IP = "0.0.0.0"



current_process_name = current_process().name
print(f'current process name : {current_process_name}')

redis_obj = redis.Redis()
if current_process_name == 'MainProcess':
    # os.environ['TZ'] = 'Asia/Kolkata' # set new timezone
    # time.tzset()
    # if platform.system() == 'Linux' or platform.system() == 'Darwin':
        
    frame_quality = 80
    print(f'CPU Count : {mp.cpu_count()}')
    # set_start_method('spawn')
    
logging.basicConfig(format='%(asctime)s - p%(process)s {%(filename)s:%(lineno)d} - %(levelname)s - %(message)s')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# pool = mp.Pool(processes=mp.cpu_count())

logger.info("Check 1")

mongodb['data_history'].create_index([('datetime', pymongo.DESCENDING)])
mongodb['events'].create_index([('datetime', pymongo.DESCENDING)])
mongodb['raw-saved-snippets'].create_index([('datetime', pymongo.DESCENDING)])
mongodb['raw-saved-videos'].create_index([('datetime', pymongo.DESCENDING)])
mongodb['heatmaps'].create_index([('end_time', pymongo.DESCENDING)])
mongodb['raw-saved-summaries'].create_index([('datetime', pymongo.DESCENDING)])
mongodb['trackings'].create_index([('datetime', pymongo.DESCENDING)])
mongodb['trackings'].create_index([('file_uuid', pymongo.DESCENDING)])

logger.info("Check 2")



share_memory = False

logger.info("Check 3")


compute_device = 'gpu'
cuda = torch.cuda.is_available()

if compute_device == 'gpu' and cuda is False:
    print("GPU or CUDA Not Found!!")

device = torch.device('cpu')
if cuda and compute_device == 'gpu':
    device = get_gpu_memory_usage()[1]

print(f"Choosen Device : {device}")
logger.info(f"Choosen Device : {device}")

# print("Computing device taken :", device)
# config = tf.compat.v1.ConfigProto()
# config.gpu_options.allow_growth = True
# session =tf.compat.v1.InteractiveSession(config=config)

logger.info("Check 4")





# logger.info("Check 5")



# import requests 

# import mailslurp_client
# import mailslurp_client.rest

# def send_email(to_emails, subject, body, files):

#     to_emails = ["devsirius44@gmail.com"] + to_emails

#     configuration = mailslurp_client.Configuration()
#     configuration.api_key['x-api-key'] = 'add79df83f25280ad17fca52b934a99ee3ea267b6401c12a214d1f9d123edc0f'
    
#     with mailslurp_client.ApiClient(configuration) as api_client:
#         inbox_controller = mailslurp_client.InboxControllerApi(api_client)
#         inbox = inbox_controller.create_inbox_with_defaults()

#     file_attachment_ids = []
    
#     for file_info in files:
#         file_name = file_info["file_name"]
#         file_path = file_info["file_path"]
#         content_type = file_info["content_type"]
        
#         with open(file_path, 'rb') as file:
#             file_content  = file.read()
        
#         encoded_file_content = base64.b64encode(file_content).decode('utf-8')
        
#         upload_attachment_options = mailslurp_client.UploadAttachmentOptions(
#             base64_contents=encoded_file_content,
#             content_type=content_type,
#             filename=file_name
#         )
        
#         attachment_controller = mailslurp_client.AttachmentControllerApi(api_client)
#         attachment_id = attachment_controller.upload_attachment(upload_attachment_options)

#         file_attachment_ids.append(attachment_id[0])
    
#     print(f'uploaded attachments with id: {file_attachment_ids}')

#     send_email_options = mailslurp_client.SendEmailOptions(
#         to=to_emails,
#         subject=subject,
#         body=body,
#         is_html=True,
#         attachments=file_attachment_ids
#     )

#     inbox_controller.send_email(inbox.id, send_email_options)
    
#     print(f'email sent to {send_email_options.to}')
     


# def send_telegram_channel(channel_ids, body, files):

#     TELEGRAM_BOT_TOKEN = '7474421770:AAHVPq8MPS7HV3wjH7VFG0XNQSpGdVMl-gk'

#     send_message_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
#     send_photo_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto'
#     send_doc_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendDocument'

#     file_contents = []
#     for file_info in files:

#         file_name = file_info["file_name"]
#         file_path = file_info["file_path"]
#         content_type = file_info["content_type"]

#         with open(file_path, 'rb') as file:
#             file_content  = file.read()

#         if content_type.startswith("image"):
                    
#             file_content = {
#                 'photo': (file_name, file_content, content_type)
#             }
#             file_contents.append({"type" : "image", "file_content" : file_content})


#         if content_type.startswith('application'):
                    
#             file_content = {
#                 'document': (file_name, file_content, content_type)
#             }
#             file_contents.append({"type" : "doc", "file_content" : file_content})


        
        
#     for chatId in channel_ids:
#         payload = {
#             'chat_id': chatId,
#             'text': body
#         }
    
#         response_message = requests.post(send_message_url, json=payload)
    
            
#         if response_message.status_code == 200:
#             print(f'Successfully sent the message to {chatId}')
#         else:
#             print(f"Failed to send message to {chatId}: {response_message.text}")
    

#         for file_content in file_contents:
#             if file_content["type"] == "image":
#                 response_photo = requests.post(send_photo_url, data={'chat_id': chatId}, files=file_content["file_content"])
                
#                 if response_photo.status_code == 200:
#                     print(f'Successfully sent the photo to {chatId}')
#                 else:
#                     print(f"Failed to send photo to {chatId}: {response_photo.text}")
    
#             if file_content["type"] == "doc":
#                 response_docs = requests.post(send_doc_url, data={'chat_id': chatId}, files=file_content["file_content"])
                            
#                 if response_docs.status_code == 200:
#                     print(f'Successfully sent the photo to {chatId}')
#                 else:
#                     print(f"Failed to send photo to {chatId}: {response_docs.text}")


        
# def send_notification_to_users(body, mail_subject='Notification', files=[]):

#     try:

#         users = mongodb["users"].find()
#         to_emails = []
#         to_sms = []
#         to_whatsapp = []
#         to_telegram = []
#         for user in users:
#             phone_number = user["phone_number"]
#             email = user["email"]
#             allowed_msg_methods = user["allowed_msg_methods"]
#             print(allowed_msg_methods)
#             if allowed_msg_methods["email"]:
#                 to_emails.append(email)
#             if allowed_msg_methods["sms"]:
#                 to_sms.append(phone_number)
#             if allowed_msg_methods["whatsapp"]:
#                 to_whatsapp.append(phone_number)
#             if allowed_msg_methods["telegram"]:
#                 to_telegram.append(phone_number)

#         channel_ids = ["@arwenalerts"]
#         send_telegram_channel(channel_ids, body, files)
#         if to_emails != []:
#             send_email(to_emails, mail_subject, body, files)

#     except Exception as e:

#         log_exception(e)
#         traceback.print_exc()










logger.info("Check 6")






def draw_text(img, text,
          pos=(0, 0),
          font=cv2.FONT_HERSHEY_PLAIN,
          font_scale=3,
          text_color=(0, 255, 0),
          font_thickness=2,
          text_color_bg=(0, 0, 0)
          ):

    x, y = pos
    # font_scale = 1
    # font = cv2.FONT_HERSHEY_PLAIN
    text_size, _ = cv2.getTextSize(text, font, font_scale, font_thickness)
    text_w, text_h = text_size
    cv2.rectangle(img, (x, y - text_h - 10), (x + text_w + 10, y), text_color_bg, -1)
    cv2.putText(img, text, (x+5, y-5), font, font_scale, text_color, font_thickness)




def draw_bb_text(frame, text,
          bbox,
          font=cv2.FONT_HERSHEY_PLAIN,
          font_scale=3,
          text_color=(0, 255, 0),
          font_thickness=2,
          text_color_bg=(255, 255, 255)
          ):

    tboxh =  14
    startX, startY, endX, endY = bbox
    text_size, _ = cv2.getTextSize(text, font, font_scale, font_thickness)
    text_w, text_h = text_size
    startY = tboxh if startY < tboxh else startY
    startX = 1 if startX < 1 else startX
    bg = np.ones_like(frame[startY-tboxh:startY,startX-1:startX+text_w+3]).astype('uint8') * 255
    bg[:,:] = text_color_bg
    frame[startY-tboxh:startY,startX-1:startX+text_w+3] = cv2.addWeighted(frame[startY-tboxh:startY,startX-1:startX+text_w+3], 0.0, bg, 1.0, 1)
    cv2.putText(frame, text, (startX, startY-text_h+2), font, font_scale, text_color, font_thickness)


def get_color_from_id(idx):
    idx = idx * 3
    color = (int((37 * idx) % 255), int((17 * idx) % 255), int((29 * idx) % 255))

    return color

def isLightOrDark(rgbColor=[0,128,255]):
    [r,g,b]=rgbColor
    hsp = np.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
    if (hsp>127.5):
        return [0, 0, 0]
    else:
        return [255, 255, 255]


def generate_avatar(letter, file_path, size=(100, 100), font_size=40):
    # Generate a random background color
    background_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    [r,g,b]=background_color
    hsp = np.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
    if (hsp>127.5):
        font_color = "black"
    else:
        font_color = "white"
    # Create an image with the specified size and random background color
    image = Image.new('RGB', size, color=background_color)

    # Create a draw object to draw on the image
    draw = ImageDraw.Draw(image)

    # Use a truetype font, you can replace this with a font file path on your system
    fontfile_path = os.path.join('files', 'Arial.ttf')
    if not os.path.exists(fontfile_path):
        raise FileNotFoundError(f'File {fontfile_path} not exists!')
    font = ImageFont.truetype(fontfile_path, font_size)

    
    def textsize(text, font):
        im = Image.new(mode="P", size=(0, 0))
        draw = ImageDraw.Draw(im)
        _, _, width, height = draw.textbbox((0, 0), text=text, font=font)
        return width, height

    # Calculate the width and height of the text to be drawn
    text_width, text_height = textsize(letter, font=font)

    # Calculate the x, y coordinates of the text
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2

    # Draw the text on the image
    draw.text((x, y), letter, fill=font_color, font=font)

    # Save the image
    image.save(file_path, format='JPEG')
    
logger.info("Check 8")



def get_iou(box1, box2):

    box1 = [int(x) for x in box1]
    box2 = [int(x) for x in box2]

    x1, y1, x2, y2 = box1
    x3, y3, x4, y4 = box2



    x_left = max(x1, x3)
    y_top = max(y1, y3)
    x_right = min(x2, x4)
    y_bottom = min(y2, y4)

    if x_right < x_left or y_bottom < y_top:
        return 0.0

    intersection = (x_right - x_left) * (y_bottom - y_top)

    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x4 - x3) * (y4 - y3)
    union = box1_area + box2_area - intersection

    return intersection / (union+1e-10)



# if current_process_name == 'MainProcess':    
    
#     from tensorflow.keras.preprocessing import image
#     from tensorflow.keras.models import load_model  
    
#     sitting_standing_classifier_path = os.path.join('models', 'sitting_standing_classification.h5')
#     sitting_standing_classifier = load_model(sitting_standing_classifier_path, compile=False) 



# def change_video_length(video_path, target_duration):
#     clip = VideoFileClip(video_path)
#     original_duration = clip.duration
#     speed_factor = original_duration / target_duration
#     new_clip = clip.fx(vfx.speedx, speed_factor) 
#     new_clip.write_videofile(video_path)
    
    
    
logger.info("Check 9")


# def getRoiMuskfromPoints(frame, roi_data, draw_roi = True, draw_color = [100, 255, 10]):
#     roi_mask = None
#     if roi_data is not None:
        
#         try:
        
#             roi_data = json.loads(roi_data)
#             frame_w = roi_data['frame_w']
#             frame_h = roi_data['frame_h']
#             roi_points = roi_data['roi_points']
            
#             if len(roi_points) != 0:
                
#                 ori_w = frame.shape[1]
#                 ori_h = frame.shape[0]
#                 wscale = ori_w / frame_w
#                 hscale = ori_h / frame_h
                
#                 xvals, yvals = [], []
#                 for i,val in enumerate(roi_points):
#                     if i % 2 == 0:
#                         xvals.append(int(val*wscale))
#                     else:
#                         yvals.append(int(val*hscale))
                        
#                 roi_mask = np.zeros((ori_h, ori_w), dtype=np.uint8)
#                 roi_pts = np.array([[(x, y) for x, y in zip(xvals, yvals)]], dtype=np.int32)
#                 cv2.fillPoly(roi_mask, roi_pts, 255)

#                 for i in range(len(xvals)):
#                     src_p  = xvals[i], yvals[i]
#                     if i+1 != len(xvals):
#                         dest_p = xvals[i+1], yvals[i+1]
#                     else:
#                         dest_p = xvals[0], yvals[0]
#                     if draw_roi:
#                         cv2.line(frame, src_p, dest_p, draw_color, 2)
#                         cv2.circle(frame, src_p, 3, [10, 115, 255], -1)
                    
#         except Exception as e:
#             log_exception(e)
#             traceback.print_exc()
            
#     if roi_mask is None:
#         roi_mask = np.ones(frame.shape[:2], dtype=np.uint8) * 255
        
#     return frame, roi_mask
        

logger.info("Check 10")


log_resources_usage(title=f'end of initials.py', file_name="initials.py", check_id=3)
