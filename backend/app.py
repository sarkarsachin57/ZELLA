

'''
Copyright 2024 AvaWatz

All rights reserved. This source code and its compiled form are confidential and proprietary to AvaWatz. 
No part of this source code may be copied, modified, distributed, or otherwise used, in whole or in part, 
by any person or entity other than authorized members of AvaWatz without the explicit written consent of AvaWatz.

For inquiries regarding the use of this source code, please contact AvaWatz.
'''


# import eventlet
# eventlet.monkey_patch()

from initials import * 
from subprocess import Popen

setproctitle.setproctitle("app.py")

# log_resources_usage(title=f'before warnup cuda', file_name="app.py", check_id=1)
# dummy_input = torch.randn(1, device=device)
# log_resources_usage(title=f'after warmup cuda', file_name="app.py", check_id=1)





sys.path.append(".")
sys.path.append("utils")

from utils.image_classification.training import *
from utils.object_detection.training import *
from utils.semantic_segmentation.training import * 
from utils.instance_segmentation.training import *


# Thread(target=AutoPurge, args=(6, 2*24)).start()



parser = argparse.ArgumentParser(prog='ZELLA',description='ZELLA is a Robust Model Training and Evaluation Framework.')

parser.add_argument('--live', action='store_true') 
parser.add_argument('--start_running_cameras', action='store_true') 
parser.add_argument('--start_frontend', action='store_true') 
parser.add_argument('--frontend_port', default=5005)
parser.add_argument('--zella_main_app_port', default=5000)
# parser.add_argument('--sentinal_server', default=5001)
# parser.add_argument('--insightiq_server', default=5002)
# parser.add_argument('--archiveai_server', default=5003)
# parser.add_argument('--websocket_server', default=5004)
# parser.add_argument('--stream_server_port', default=5006) 
# parser.add_argument('--camera_port', default=5020)
# parser.add_argument('--admin_port', default=5020)

# python3 app.py --frontend_port 5005 --camera_control_port 5000 --sentinal_server 5001 --insightiq_server 5002 --archiveai_server 5003 --websocket_server 5004 --stream_server_port 5006 --camera_port 5020 --admin_port 5025
# python3 app.py --frontend_port 5105 --camera_control_port 5100 --sentinal_server 5101 --insightiq_server 5102 --archiveai_server 5103 --websocket_server 5104 --stream_server_port 5106 --camera_port 5120 --admin_port 5125

args = parser.parse_args()


if args.start_frontend:
    
        
    frontend_config = f'''
    PORT={args.frontend_port}
    REACT_APP_API_URL=http://{SERVER_IP}
    REACT_APP_MAIN_SERVER_URL=http://{SERVER_IP}:{args.camera_control_port}
    REACT_APP_SENTINELAI_SERVER_URL=http://{SERVER_IP}:{args.sentinal_server}
    REACT_APP_INSIGHTIQ_SERVER_URL=http://{SERVER_IP}:{args.insightiq_server}
    REACT_APP_ARCHIVEAI_SERVER_URL=http://{SERVER_IP}:{args.archiveai_server}
    REACT_APP_ADMIN_SERVER= http://{SERVER_IP}:{args.admin_port}
    REACT_APP_WEBSOCKET_URL=ws://{SERVER_IP}:{args.websocket_server}
    '''

    frontend_config_path = "../frontend/.env"

    with open(frontend_config_path, 'w') as f:
        f.writelines(frontend_config)

    os.system(f"npx kill port {args.frontend_port}")
    os.system(f"cd ../frontend")
    os.system("npm start")
    os.system("cd ../backend")






# def press_enter_periodically(interval=3600):
#     while True:
#         time.sleep(interval)
#         pyautogui.press('enter')
#         # logger.info("Pressed Enter")

# periodic_press = threading.Thread(target=press_enter_periodically, args=(1,))
# periodic_press.daemon = True
# periodic_press.start()





from pygments.formatters import HtmlFormatter
from flask import Flask, render_template, Response, request, redirect, url_for, send_file

from flask_jsglue import JSGlue
from flask_cors import CORS, cross_origin	
from flask import send_from_directory
from flask_ngrok import run_with_ngrok
# from flask_socketio import SocketIO

from waitress import serve




formatter = HtmlFormatter(style="emacs",full=True,cssclass="codehilite")
css_string = formatter.get_style_defs()

current_tokens = {}
redis_obj.flushdb()
# redis_obj.set('unread_alerts', json.dumps({'count' : 0, "messages" : []}))





app = Flask(__name__,  static_folder='', template_folder='')
# CORS(app, expose_headers='Authorization')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MAX_CONTENT_LENGTH'] = 3 * 1024 * 1024 * 1024 * 20 # 1GB
jsglue = JSGlue(app)
# socket = SocketIO(app=app, async_mode='eventlet', cors_allowed_origins='*', workers=4, message_queue='redis://') 
# run_with_ngrok(app)


@cross_origin(support_credentials=True)



# Will show README.md
@app.route("/")
def index():
    print("Get request for /")
    readme_file = open("README.md", "r")
    md_template_string = markdown.markdown(
        readme_file.read(), extensions=["fenced_code"]
    )

    md_css_string = "<style>" + css_string + "</style>"
    md_template = md_css_string + md_template_string
    return md_template




@app.route("/check-api-status", methods=['GET'])
def check_api_status():
    return "Ok"

@app.route("/user-signup", methods=['POST'])
@cross_origin(support_credentials=True)
def user_signup():
    
    logger.info(f"Get request for /user-signup")
    
    try:

        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email'] 
        phone_number = request.form['phone_number'] 
        password = request.form['password'] 

        
            
        logger.info(f'Params - first_name : {first_name}, last_name : {last_name}, email : {email}, phone_number : {phone_number}')
        frontend_inputs = f'first_name : {first_name}\nlast_name : {last_name}\nemail : {email}\nphone_number : {phone_number}'

        user_id = uuid.uuid4().__str__()
        
        user_df = pd.DataFrame(mongodb['users'].find({'email' : email}))
        if user_df.shape[0] != 0:
                
            res = {
                    "status": "fail",
                    "message": f"Email Already Exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        avatar_dir = os.path.join('files', 'user-avatars')
        os.makedirs(avatar_dir, exist_ok=True)
        avatar_path = os.path.join(avatar_dir, email+'.jpg')
        generate_avatar(letter=first_name[0], file_path=avatar_path)
        
        user_workdir = os.path.join('workdir', user_id)
        os.makedirs(user_workdir, exist_ok=True)

        allowed_msg_methods = {"sms" : False, "whatsapp" : False, "telegram" : False, "email" : False}
        
        mongodb['users'].insert_one({'_id': user_id, 'email' : email, 'phone_number' : phone_number, 'first_name' : first_name, 'last_name' : last_name, 'password' : password, 'avatar_path' : avatar_path, "user_workdir" : user_workdir, "allowed_msg_methods" : allowed_msg_methods})

        
        res = {
                "status": "success",
                "message": f"Account created successfully!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)



@app.route("/user-login", methods=['POST'])
@cross_origin(support_credentials=True)
def user_login():
    
    logger.info(f"Get request for /user-login")
    
    try:

        email = request.form['email'] 
        password = request.form['password'] 
        
            
        logger.info(f'Params - email : {email}')
        frontend_inputs = f"email : {email}"
        
        user_df = pd.DataFrame(mongodb['users'].find({'email' : email}))
        if user_df.shape[0] == 0:
                
            res = {
                    "status": "fail",
                    "message": f"User not Exists! Please Sign Up or check your credentials."
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        if user_df.shape[0] == 1:
            if user_df.loc[0]['password'] != password:
                                    
                res = {
                        "status": "fail",
                        "message": f"Password incorrect! Please try again with correct password."
                    }

                logger.info(json.dumps(res, indent=4,  default=str))
                return json.dumps(res, separators=(',', ':'), default=str)
            
        token = uuid.uuid4().__str__()
        current_tokens[token] = {'email':email, 'start_time' : time.time(), "avatar_path" : user_df.loc[0]['avatar_path']}

        redis_obj.set(f"all_user_current_tokens", json.dumps(current_tokens, indent=4))
        
        res = {
                "status": "success",
                "message": f"Login Successful!",
                "token" : token,
                "avatar" : user_df.loc[0]['avatar_path']
                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
        
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)


@app.route("/check-login-status", methods=['POST'])
def login_status():
    
    logger.info(f"Get request for /check-login-status")
    
    try:

        token = request.form['token'] 
                    
        logger.info(f'Params - token : {token}')
        frontend_inputs = f"token : {token}"
        
        if token in current_tokens:
            
            if time.time() - current_tokens[token]['start_time'] > 3600:
                
                del current_tokens[token]
                gc.collect()
                        
                res = {
                        "status": "fail",
                        "message": f"Token Expired!"
                        
                    }

                logger.info(json.dumps(res, indent=4,  default=str))
                return json.dumps(res, separators=(',', ':'), default=str)

            
            res = {
                    "status": "success",
                    "message": f"Token Exists!",
                    "email" : current_tokens[token]['email'],
                    "avatar" : current_tokens[token]['avatar_path']
                    
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        

        res = {
                "status": "fail",
                "message": f"Token not Exists!"
                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)


    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)








@app.route("/get-user-data", methods=['POST'])
def get_user_data():
    
    logger.info(f"Get request for /get-user-data")
    
    try:

        email = request.form['email']         
            
        logger.info(f'Params - email : {email}')
        frontend_inputs = f"email : {email}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        del user_data["_id"]

        items = ["email", "first_name", "last_name", "avatar_path", "phone_number", "allowed_msg_methods", "gender", "birthday"]
        for item in items:
            try:
                user_data[item]
            except:
                user_data[item] = None

        res = {
                "status": "success",
                "data": user_data                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)





@app.route("/set-user-data", methods=['POST'])
def set_user_data():
    
    logger.info(f"Get request for /set-user-data")
    
    try:

        email = request.form['email']   
        phone_number = request.form['phone_number']

        new_email = request.form['new_email']   
        new_phone_number = request.form['new_phone_number']
        first_name = request.form['first_name']   
        last_name = request.form['last_name']   
        gender = request.form['gender']   
        birthday = request.form['birthday']   
        allowed_msg_methods = request.form['allowed_msg_methods']   
        password = request.form['password']  
           
        
        logger.info(f'Params - email : {email}, new_email : {new_email}, phone_number : {phone_number}, new_phone_number : {new_phone_number}, first_name : {first_name}, last_name : {last_name}, gender : {gender}, birthday : {birthday}, allowed_msg_methods : {allowed_msg_methods}')
        frontend_inputs = f"email : {email}\nnew_email : {new_email}\nphone_number : {phone_number}\nnew_phone_number : {new_phone_number}\nfirst_name : {first_name}\nlast_name : {last_name}\ngender : {gender}\nbirthday : {birthday}\nallowed_msg_methods : {allowed_msg_methods}"

        allowed_msg_methods = json.loads(allowed_msg_methods)

        new_data = {"email" : new_email, "password" : password, "first_name" : first_name, "last_name" : last_name, "phone_number" : new_phone_number, "gender" : gender, "birthday" : birthday, "allowed_msg_methods" : allowed_msg_methods}
        
        user_data = mongodb['users'].find_one({'email' : email})

        
        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        if mongodb['users'].find_one({'email' : new_email}) is not None and email != new_email:

               
            res = {
                    "status": "fail",
                    "message": f"New Email already exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        
        if mongodb['users'].find_one({'phone_number' : new_phone_number}) is not None and phone_number != new_phone_number:

               
            res = {
                    "status": "fail",
                    "message": f"New Phone Number already exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)


        update_query = {"_id" : user_data["_id"]}
        
        mongodb['users'].update_one(update_query, {"$set" : new_data})

        res = {
                "status": "success",
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)










# @app.route('/free-unread-alerts')
# def free_unread_alerts():
    
#     logger.info(f"Get request for /free-unread-alerts")
    
#     try:
#         # redis_obj.set('unread_alerts', json.dumps({'count' : 0, "messages" : []}))
#         global unread_msgs, unread_msgs_count
#         unread_msgs = []
#         unread_msgs_count = 0
        
#         res = {
#             "status": "success"
#         }

#     except Exception as e:

#         log_exception(e)
#         traceback.print_exc()

#         res = {
#                 "status": "fail",
#                 "message": f"Something went wrong.",
#             }

#     logger.info(json.dumps(res, indent=4,  default=str))
#     return json.dumps(res, separators=(',', ':'), default=str)




@app.route("/create-project", methods=['POST'])
def create_project():
    
    logger.info(f"Get request for /create-project")
    
    try:

        email = request.form['email']         
        project_name = request.form['project_name']
        project_type = request.form['project_type']
            
        logger.info(f'Params - email : {email}, project_name : {project_name}, project_type : {project_type}')
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\nproject_type : {project_type}\n"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        if mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name}) is not None:
               
            res = {
                    "status": "fail",
                    "message": f"Project name already exists!"
                }

            
            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

            
        
        project_id =  str(uuid.uuid4())[:8]
        
        project_dir = os.path.join("workdir", user_id, project_name)
        os.makedirs(project_dir, exist_ok=True)
        
        project_creation_time = datetime.now()
        project_creation_time_str = project_creation_time.strftime('%Y-%m-%d %I:%M:%S %p')
        
        project_meta = {
            "_id" : user_id+"_"+project_id,
            "project_id" : project_id,
            "user_id" : user_id,
            "project_name" : project_name,
            "project_type" : project_type,
            "project_dir" : project_dir,
            "project_creation_time" : project_creation_time,        
            "project_creation_time_str" : project_creation_time_str,        
        }
        
        mongodb["projects"].insert_one(project_meta)
        
            
        res = {
                "status": "success",
                "data": project_meta,                
            }

        logger.info(json.dumps(res, indent=4, default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)





@app.route("/get-project-list", methods=['POST'])
def get_project_list():
    
    logger.info(f"Get request for /get-project-list")
    
    try:
        
        email = request.form['email']

        logger.info(f'Params - email : {email}')
            
        frontend_inputs = f"email : {email}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        project_list = list(mongodb["projects"].find({'user_id' : user_id}))
        
        
            
        res = {
                "status": "success",
                "project_list": project_list                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)



@app.route("/upload-data", methods=['POST'])
def upload_data():
    
    logger.info(f"Get request for /upload-data")
    
    try:

        email = request.form['email']         
        project_name = request.form['project_name']
        data_name =  request.form['data_name']
        data_drive_id = request.form['data_drive_id']
        
            
        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, data_drive_id : {data_drive_id}')
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\ndata_drive_id : {data_drive_id}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        
        project_data = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})

        if project_data is None:
            
            res = {
                    "status": "fail",
                    "message": f"Project {project_name} does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        
        if mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, 'data_name' : data_name}) is not None:
               
            res = {
                    "status": "fail",
                    "message": f"Dataset with {data_name} name already exists!"
                }
                    
            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        
        project_dir = os.path.join("workdir", user_id, project_name)
        os.makedirs(project_dir, exist_ok=True)
        
        data_id = str(uuid.uuid4())[:8]
        
        if data_drive_id != "":
            
            data_dest_file = os.path.join(project_dir, f"data_{data_id}.zip")            
            dest_dir = os.path.dirname(data_dest_file)
            file_name = os.path.basename(data_dest_file)
            current_dir = os.getcwd()
            os.chdir(dest_dir)
            os.system(f"gdown --output {file_name} {data_drive_id}")
            os.chdir(current_dir)
            # os.system(f"gdown --output {data_dest_file} {data_drive_id}")
            
        else:
            
            data_zip_file = request.files['data_zip_file']
            data_dest_file = os.path.join(project_dir, f"data_{data_id}.zip")
            data_zip_file.save(data_dest_file)
            
                
        def unzip_to_directory(zip_file_path, new_extract_dir):
            
            # Ensure the new directory exists
            if not os.path.exists(new_extract_dir):
                os.makedirs(new_extract_dir)

            # Extract the zip file to the new directory
            with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                zip_ref.extractall(new_extract_dir)

            print(f"Files extracted to: {new_extract_dir}")    
            
        extracted_path = os.path.join(project_dir, f"data_{data_id}_extracted")
            
        unzip_to_directory(data_dest_file, extracted_path)
            
        
        data_creation_time = datetime.now()
        data_creation_time_str = data_creation_time.strftime('%Y-%m-%d %I:%M:%S %p')
        
        
        project_type = project_data["project_type"]
        
        data_meta = {
            "_id" : user_id+"_"+project_name+"_"+data_id,
            "data_id" : data_id,
            "project_name" : project_name,
            "user_id" : user_id,
            "data_name" : data_name,
            "data_type" : "Uploaded",
            "project_type" : project_type,
            "data_zip_path" : data_dest_file,
            "data_extracted_path" : extracted_path,
            "data_creation_time" : data_creation_time,
            "data_creation_time_str" : data_creation_time_str,
        }
        
        mongodb["datasets"].insert_one(data_meta)
            
        res = {
                "status": "success",
                "data": data_meta,                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)





@app.route("/get-dataset-list", methods=['POST'])
def get_dataset_list():
    
    logger.info(f"Get request for /get-dataset-list")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        data_type = request.form['data_type']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_type : {data_type}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name} \ndata_type : {data_type}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        if data_type == "All":
            dataset_list = list(mongodb["datasets"].find({'user_id' : user_id, 'project_name' : project_name}))
        else:
            dataset_list = list(mongodb["datasets"].find({'user_id' : user_id, 'project_name' : project_name, 'data_type' : data_type}))
        
            
        res = {
                "status": "success",
                "dataset_list": dataset_list                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)






@app.route("/get-image-classification-dataset-info", methods=['POST'])
def get_image_classification_dataset_info():
    
    logger.info(f"Get request for /get-image-classification-dataset-info")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        data_name = request.form['data_name']
        show_samples = request.form['show_samples']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, show_samples : {show_samples}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\nshow_samples : {show_samples}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        
        data_info = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : data_name})
        
        
        if data_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Dataset does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        
        if bool(int(show_samples)) == True:
            
            # split_name = request.form['split_name']
            class_name = request.form['class_name']
            page_number = request.form['page_number']
            
            logger.info(f'Params - class_name : {class_name}, page_number : {page_number}')
            
            frontend_inputs += f"\nclass_name : {class_name}\npage_number : {page_number}"
            
            samples_per_page = 24
            page_number = int(page_number)
            
            sample_paths = [os.path.join(data_info["data_extracted_path"], class_name, x) for x in os.listdir(os.path.join(data_info["data_extracted_path"], class_name))]
            number_of_samples = len(sample_paths)
            sample_paths = sample_paths[(page_number-1)*samples_per_page : page_number*samples_per_page]
            
            res = {
                    "status": "success",
                    "number_of_samples" : number_of_samples,
                    "sample_paths": sample_paths,
                    "number_of_pages" : math.ceil(len(sample_paths)/samples_per_page)
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
                      
                
        
        data_dir = data_info["data_extracted_path"]
        
        class_list = os.listdir(data_dir) 
        
        total_samples = 0
        sample_dist = {}
        sample_paths = {}
        for class_name in class_list:
            sample_paths[class_name] = [os.path.join(data_dir, class_name, x) for x in os.listdir(os.path.join(data_dir, class_name))]
            sample_dist[class_name] = len(sample_paths[class_name])
            total_samples += sample_dist[class_name]
            
        dist =  np.array(list(sample_dist.values()))
        class_balance_score = class_distribution_score(dist)
        
        res = {
                "status": "success",
                "data_info": {
                    "class_list" : class_list,
                    "total_samples": total_samples,
                    "class_balance_score": class_balance_score,
                    "dist_fig" : {
                            "x": list(sample_dist.keys()),
                            "y": list(sample_dist.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Samples",
                            "title": "Data Class Distribution",
                        },
                }
            }

        logger.info(json.dumps(res, indent=4,  default=str, cls=plotly.utils.PlotlyJSONEncoder))
        return json.dumps(res, separators=(',', ':'), default=str, cls=plotly.utils.PlotlyJSONEncoder)
    
            
            

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)




@app.route("/get-object-detection-dataset-info", methods=['POST'])
def get_object_detection_dataset_info():
    
    logger.info(f"Get request for /get-object-detection-dataset-info")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        data_name = request.form['data_name']
        show_samples = request.form['show_samples']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, show_samples : {show_samples}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\nshow_samples : {show_samples}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        
        data_info = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : data_name})
        
        if data_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Dataset does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        if bool(int(show_samples)) == True:
            
            # split_name = request.form['split_name']
            # class_name = request.form['class_name']
            page_number = request.form['page_number']
            
            logger.info(f'Params - page_number : {page_number}')
            
            frontend_inputs += f"\npage_number : {page_number}"
            
            samples_per_page = 24
            page_number = int(page_number)
            
            sample_paths = [os.path.join(data_info["data_extracted_path"], "images", x) for x in os.listdir(os.path.join(data_info["data_extracted_path"], "images"))]
            number_of_samples = len(sample_paths)
            sample_paths = sample_paths[(page_number-1)*samples_per_page : page_number*samples_per_page]
            
            res = {
                    "status": "success",
                    "number_of_samples" : number_of_samples,
                    "sample_paths": sample_paths,
                    "number_of_pages" : math.ceil(number_of_samples/samples_per_page)
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
                      
            
        
        data_dir = data_info["data_extracted_path"]
        metadata = json.loads(open(os.path.join(data_dir, "metadata.json")).read())
        
        class_list = metadata["classes"]
        
                    
        all_class_instances = []
        all_class_images = []
        for annotation_file in tqdm(os.listdir(os.path.join(data_dir, "annotations"))):
            annotations = json.loads(open(os.path.join(data_dir, "annotations", annotation_file)).read())
            all_class_instances += annotations["class_ids"]
            all_class_images += list(set(annotations["class_ids"]))

        class_ids, image_counts = np.unique(all_class_images, return_counts=True)
        image_count_dict = {}
        for class_id, image_count in zip(class_ids, image_counts):
            image_count_dict[metadata["classes"][class_id]] = int(image_count)

        class_ids, ins_counts = np.unique(all_class_instances, return_counts=True)
        ins_count_dict = {}
        for class_id, ins_count in zip(class_ids, ins_counts):
            ins_count_dict[metadata["classes"][class_id]] = int(ins_count)
            
        total_images = image_counts.sum()
        total_instances = ins_counts.sum()
        
        image_wise_class_balance_score = class_distribution_score(image_counts)
        instances_wise_class_balance_score = class_distribution_score(ins_counts)
        
        
        res = {
                "status": "success",
                "data_info": {
                    "class_list" : class_list,
                    "total_images": total_images,
                    "total_instances": total_instances,
                    "image_wise_class_balance_score": image_wise_class_balance_score,
                    "instances_wise_class_balance_score" : instances_wise_class_balance_score,
                    "image_dist_fig" : {
                            "x": list(image_count_dict.keys()),
                            "y": list(image_count_dict.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Images",
                            "title": "Data Class Distribution",
                        },
                    "instance_dist_fig" : {
                            "x": list(ins_count_dict.keys()),
                            "y": list(ins_count_dict.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Instances",
                            "title": "Data Class Distribution",
                        },
                }
            }

        logger.info(json.dumps(res, indent=4,  default=str, cls=plotly.utils.PlotlyJSONEncoder))
        return json.dumps(res, separators=(',', ':'), default=str, cls=plotly.utils.PlotlyJSONEncoder)
    
            
            

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)








@app.route("/get-instance-segmentation-dataset-info", methods=['POST'])
def get_instance_segmentation_dataset_info():
    
    logger.info(f"Get request for /get-instance-segmentation-dataset-info")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        data_name = request.form['data_name']
        show_samples = request.form['show_samples']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, show_samples : {show_samples}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\nshow_samples : {show_samples}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        
        data_info = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : data_name})
        
        if data_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Dataset does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        if bool(int(show_samples)) == True:
            
            # split_name = request.form['split_name']
            # class_name = request.form['class_name']
            page_number = request.form['page_number']
            
            logger.info(f'Params - page_number : {page_number}')
            
            frontend_inputs += f"\npage_number : {page_number}"
            
            samples_per_page = 24
            page_number = int(page_number)
            
            sample_paths = [os.path.join(data_info["data_extracted_path"], "images", x) for x in os.listdir(os.path.join(data_info["data_extracted_path"], "images"))]
            number_of_samples = len(sample_paths)
            sample_paths = sample_paths[(page_number-1)*samples_per_page : page_number*samples_per_page]
            
            res = {
                    "status": "success",
                    "number_of_samples" : number_of_samples,
                    "sample_paths": sample_paths,
                    "number_of_pages" : math.ceil(number_of_samples/samples_per_page)
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
                      
            
        
        data_dir = data_info["data_extracted_path"]
        metadata = json.loads(open(os.path.join(data_dir, "metadata.json")).read())
        
        class_list = metadata["classes"]
        
                    
        all_class_instances = []
        all_class_images = []
        for annotation_file in tqdm(os.listdir(os.path.join(data_dir, "annotations"))):
            annotations = json.loads(open(os.path.join(data_dir, "annotations", annotation_file)).read())
            all_class_instances += annotations["class_ids"]
            all_class_images += list(set(annotations["class_ids"]))

        class_ids, image_counts = np.unique(all_class_images, return_counts=True)
        image_count_dict = {}
        for class_id, image_count in zip(class_ids, image_counts):
            image_count_dict[metadata["classes"][class_id]] = int(image_count)

        class_ids, ins_counts = np.unique(all_class_instances, return_counts=True)
        ins_count_dict = {}
        for class_id, ins_count in zip(class_ids, ins_counts):
            ins_count_dict[metadata["classes"][class_id]] = int(ins_count)
            
        total_images = image_counts.sum()
        total_instances = ins_counts.sum()
        
        image_wise_class_balance_score = class_distribution_score(image_counts)
        instances_wise_class_balance_score = class_distribution_score(ins_counts)
        
        
        res = {
                "status": "success",
                "data_info": {
                    "class_list" : class_list,
                    "total_images": total_images,
                    "total_instances": total_instances,
                    "image_wise_class_balance_score": image_wise_class_balance_score,
                    "instances_wise_class_balance_score" : instances_wise_class_balance_score,
                    "image_dist_fig" : {
                            "x": list(image_count_dict.keys()),
                            "y": list(image_count_dict.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Images",
                            "title": "Data Class Distribution",
                        },
                    "instance_dist_fig" : {
                            "x": list(ins_count_dict.keys()),
                            "y": list(ins_count_dict.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Instances",
                            "title": "Data Class Distribution",
                        },
                }
            }

        logger.info(json.dumps(res, indent=4,  default=str, cls=plotly.utils.PlotlyJSONEncoder))
        return json.dumps(res, separators=(',', ':'), default=str, cls=plotly.utils.PlotlyJSONEncoder)
    
            

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)







@app.route("/get-semantic-segmentation-dataset-info", methods=['POST'])
def get_semantic_segmentation_dataset_info():
    
    logger.info(f"Get request for /get-semantic-segmentation-dataset-info")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        data_name = request.form['data_name']
        show_samples = request.form['show_samples']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, show_samples : {show_samples}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\nshow_samples : {show_samples}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        
        data_info = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : data_name})
        
        if data_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Dataset does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        if bool(int(show_samples)) == True:
            
            # split_name = request.form['split_name']
            # class_name = request.form['class_name']
            page_number = request.form['page_number']
            
            logger.info(f'Params - page_number : {page_number}')
            
            frontend_inputs += f"\npage_number : {page_number}"
            
            samples_per_page = 24
            page_number = int(page_number)
            
            sample_paths = [os.path.join(data_info["data_extracted_path"], "images", x) for x in os.listdir(os.path.join(data_info["data_extracted_path"], "images"))]
            number_of_samples = len(sample_paths)
            sample_paths = sample_paths[(page_number-1)*samples_per_page : page_number*samples_per_page]
            
            res = {
                    "status": "success",
                    "number_of_samples" : number_of_samples,
                    "sample_paths": sample_paths,
                    "number_of_pages" : math.ceil(number_of_samples/samples_per_page)
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
                    
        data_dir = data_info["data_extracted_path"]
        metadata = json.loads(open(os.path.join(data_dir, "metadata.json")).read())
        
        class_list = metadata["classes"]
        
        ann_dir = os.path.join(data_dir, "annotations")
        
        image_class_dist = {class_name : 0 for class_name in metadata["classes"]}
        pixel_class_dist = {class_name : 0 for class_name in metadata["classes"]}
        for ann_file in tqdm(os.listdir(ann_dir)):
            ann_path = os.path.join(ann_dir, ann_file)
            segmap = np.load(ann_path)
            class_ids, class_counts = np.unique(segmap, return_counts=True)
            for class_id, class_count in zip(class_ids, class_counts):
                class_name = metadata["classes"][int(class_id)]
                image_class_dist[class_name] += 1
                pixel_class_dist[class_name] += int(class_count)
                        
                    
        total_images = len(os.listdir(os.path.join(data_dir, "images")))
        total_pixels = sum(list(pixel_class_dist.values()))
        
        image_wise_class_balance_score = class_distribution_score(np.array([image_class_dist[class_name] for class_name in class_list]))
        pixel_wise_class_balance_score = class_distribution_score(np.array([pixel_class_dist[class_name] for class_name in class_list]))

        
        res = {
                "status": "success",
                "data_info": {
                    "class_list" : class_list,
                    "total_images": total_images,
                    "total_pixels": total_pixels,
                    "image_wise_class_balance_score": image_wise_class_balance_score,
                    "pixel_wise_class_balance_score" : pixel_wise_class_balance_score,
                    "image_dist_fig" : {
                            "x": list(image_class_dist.keys()),
                            "y": list(image_class_dist.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Images",
                            "title": "Data Class Distribution",
                        },
                    "pixels_dist_fig" : {
                            "x": list(pixel_class_dist.keys()),
                            "y": list(pixel_class_dist.values()),
                            "xtitle": "Class Names",
                            "ytitle": "Number of Instances",
                            "title": "Data Class Distribution",
                        },
                }
            }

        logger.info(json.dumps(res, indent=4,  default=str, cls=plotly.utils.PlotlyJSONEncoder))
        return json.dumps(res, separators=(',', ':'), default=str, cls=plotly.utils.PlotlyJSONEncoder)
    
        
            

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)





@app.route("/train_image_classification_model", methods=['POST'])
def train_image_classification_model():
    
    logger.info(f"Get request for /train_image_classification_model")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        train_data_name =  request.form['train_data_name']
        val_data_name =  request.form['val_data_name']
        run_name = request.form['run_name']
        model_family = request.form['model_family']
        model_name = request.form['model_name']
        training_mode = request.form['training_mode']
        num_epochs = request.form['num_epochs']
        batch_size = request.form['batch_size']
        learning_rate = request.form['learning_rate']

        logger.info(f'Params - email : {email}, project_name : {project_name}, train_data_name : {train_data_name}, val_data_name : {val_data_name}, run_name : {run_name}, model_family : {model_family}, model_name : {model_name}, training_mode : {training_mode}, num_epochs : {num_epochs}, batch_size : {batch_size}, learning_rate : {learning_rate}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ntrain_data_name : {train_data_name}\nval_data_name : {val_data_name}\nrun_name : {run_name}\nmodel_family : {model_family}\nmodel_name : {model_name}\ntraining_mode : {training_mode}\nnum_epochs : {num_epochs}\nbatch_size : {batch_size}\nlearning_rate : {learning_rate}"
        
        num_epochs = int(num_epochs)
        batch_size = int(batch_size)
        learning_rate = float(learning_rate)

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]


        run_record = mongodb["run_records"].find_one({"run_name" : run_name, "project_name" : project_name, "user_id" : user_id})
        if run_record is not None:
            
            res = {
                    "status": "fail",
                    "message": f"Run Name exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        # dataset_list = list(mongodb["datasets"].find({'user_id' : user_id, 'project_name' : project_name}))
        
        train_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : train_data_name})
        train_data_path = train_data_meta['data_extracted_path']
        
        val_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : val_data_name})
        val_data_path = val_data_meta['data_extracted_path']
        
        train_classes = os.listdir(train_data_path)
        val_classes = os.listdir(val_data_path)
        
        # check if the classes are same
        for class_name in train_classes:
            if class_name not in val_classes:
                res = {
                        "status": "fail",
                        "message": f"Train and Validation data classes are not same!"
                    }

                logger.info(json.dumps(res, indent=4,  default=str))
                return json.dumps(res, separators=(',', ':'), default=str)
            
        
        for class_name in val_classes:
            if class_name not in train_classes:
                res = {
                        "status": "fail",
                        "message": f"Train and Validation data classes are not same!"
                    }

                logger.info(json.dumps(res, indent=4,  default=str))
                return json.dumps(res, separators=(',', ':'), default=str)
            

        device = "cuda:0" if torch.cuda.is_available() else "cpu"


        Thread(target=ImageClassificationTrainingPipeline, args=(run_name,train_data_name,val_data_name,project_name,user_id,model_family,model_name,training_mode,batch_size,num_epochs,learning_rate,device,train_data_path,val_data_path)).start()

        
        training_start_time = datetime.now()
        training_start_time_str = training_start_time.strftime('%Y-%m-%d %I:%M:%S %p')
        

        mongodb['run_records'].insert_one({"_id" : uuid.uuid4().__str__(), "training_start_time" : training_start_time, "training_start_time_str" : training_start_time_str, "run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, \
                                        "project_name" : project_name, "user_id" : user_id, "model_family" : model_family, "model_name" : model_name, "training_mode" : training_mode, "batch_size" : batch_size, "num_epochs" : num_epochs, \
                                         "learning_rate" : learning_rate, "model_path" : "", "training_status" : "training"})

            
        res = {
                "status": "success",
                "message": "Training started successfully!"                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)






@app.route("/train_object_detection_model", methods=['POST'])
def train_object_detection_model():
    
    logger.info(f"Get request for /train_object_detection_model")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        train_data_name =  request.form['train_data_name']
        val_data_name =  request.form['val_data_name']
        run_name = request.form['run_name']
        model_family = request.form['model_family']
        model_name = request.form['model_name']
        training_mode = request.form['training_mode']
        num_epochs = request.form['num_epochs']
        batch_size = request.form['batch_size']
        learning_rate = request.form['learning_rate']

        logger.info(f'Params - email : {email}, project_name : {project_name}, train_data_name : {train_data_name}, val_data_name : {val_data_name}, run_name : {run_name}, model_family : {model_family}, model_name : {model_name}, training_mode : {training_mode}, num_epochs : {num_epochs}, batch_size : {batch_size}, learning_rate : {learning_rate}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ntrain_data_name : {train_data_name}\nval_data_name : {val_data_name}\nrun_name : {run_name}\nmodel_family : {model_family}\nmodel_name : {model_name}\ntraining_mode : {training_mode}\nnum_epochs : {num_epochs}\nbatch_size : {batch_size}\nlearning_rate : {learning_rate}"
        
        num_epochs = int(num_epochs)
        batch_size = int(batch_size)
        learning_rate = float(learning_rate)

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]


        run_record = mongodb["run_records"].find_one({"run_name" : run_name, "project_name" : project_name, "user_id" : user_id})
        if run_record is not None:
            
            res = {
                    "status": "fail",
                    "message": f"Run Name exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
        project_type = project_info['project_type']
        
        train_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : train_data_name})
        train_data_path = train_data_meta['data_extracted_path']
        
        val_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : val_data_name})
        val_data_path = val_data_meta['data_extracted_path']
        
        train_classes = json.loads(open(os.path.join(train_data_path, "metadata.json")).read())["classes"]
        val_classes = json.loads(open(os.path.join(val_data_path, "metadata.json")).read())["classes"]

        if train_classes != val_classes:
        
            res = {
                    "status": "fail",
                    "message": f"Train and Validation data classes are not same!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        device = "cuda:0" if torch.cuda.is_available() else "cpu"

        # if project_type == "Image Classification":
        #     Thread(target=ImageClassificationTrainingPipeline, args=(run_name,train_data_name,val_data_name,project_name,user_id,model_family,model_name,training_mode,batch_size,num_epochs,learning_rate,device,train_data_path,val_data_path)).start()
        # elif project_type == "Object Detection":
        
        Thread(target=ObjectDetectionTrainingPipeline, args=(run_name,train_data_name,val_data_name,project_name,user_id,model_family,model_name,training_mode,batch_size,num_epochs,learning_rate,device,train_data_path,val_data_path)).start()

        
        training_start_time = datetime.now()
        training_start_time_str = training_start_time.strftime('%Y-%m-%d %I:%M:%S %p')
        

        mongodb['run_records'].insert_one({"_id" : uuid.uuid4().__str__(), "training_start_time" : training_start_time, "training_start_time_str" : training_start_time_str, "run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, \
                                        "project_name" : project_name, "user_id" : user_id, "model_family" : model_family, "model_name" : model_name, "training_mode" : training_mode, "batch_size" : batch_size, "num_epochs" : num_epochs, \
                                         "learning_rate" : learning_rate, "model_path" : "", "training_status" : "training"})

            
        res = {
                "status": "success",
                "message": "Training started successfully!"                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)




@app.route("/train_instance_segmentation_model", methods=['POST'])
def train_instance_segmentation_model():
    
    logger.info(f"Get request for /train_instance_segmentation_model")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        train_data_name =  request.form['train_data_name']
        val_data_name =  request.form['val_data_name']
        run_name = request.form['run_name']
        model_family = request.form['model_family']
        model_name = request.form['model_name']
        training_mode = request.form['training_mode']
        num_epochs = request.form['num_epochs']
        batch_size = request.form['batch_size']
        learning_rate = request.form['learning_rate']

        logger.info(f'Params - email : {email}, project_name : {project_name}, train_data_name : {train_data_name}, val_data_name : {val_data_name}, run_name : {run_name}, model_family : {model_family}, model_name : {model_name}, training_mode : {training_mode}, num_epochs : {num_epochs}, batch_size : {batch_size}, learning_rate : {learning_rate}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ntrain_data_name : {train_data_name}\nval_data_name : {val_data_name}\nrun_name : {run_name}\nmodel_family : {model_family}\nmodel_name : {model_name}\ntraining_mode : {training_mode}\nnum_epochs : {num_epochs}\nbatch_size : {batch_size}\nlearning_rate : {learning_rate}"
        
        num_epochs = int(num_epochs)
        batch_size = int(batch_size)
        learning_rate = float(learning_rate)

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]


        run_record = mongodb["run_records"].find_one({"run_name" : run_name, "project_name" : project_name, "user_id" : user_id})
        if run_record is not None:
            
            res = {
                    "status": "fail",
                    "message": f"Run Name exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
        project_type = project_info['project_type']
        
        train_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : train_data_name})
        train_data_path = train_data_meta['data_extracted_path']
        
        val_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : val_data_name})
        val_data_path = val_data_meta['data_extracted_path']
        
        train_classes = json.loads(open(os.path.join(train_data_path, "metadata.json")).read())["classes"]
        val_classes = json.loads(open(os.path.join(val_data_path, "metadata.json")).read())["classes"]

        if train_classes != val_classes:
        
            res = {
                    "status": "fail",
                    "message": f"Train and Validation data classes are not same!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        device = "cuda:0" if torch.cuda.is_available() else "cpu"

        # if project_type == "Image Classification":
        #     Thread(target=ImageClassificationTrainingPipeline, args=(run_name,train_data_name,val_data_name,project_name,user_id,model_family,model_name,training_mode,batch_size,num_epochs,learning_rate,device,train_data_path,val_data_path)).start()
        # elif project_type == "Object Detection":
        
        Thread(target=InstanceSegmentationTrainingPipeline, args=(run_name,train_data_name,val_data_name,project_name,user_id,model_family,model_name,training_mode,batch_size,num_epochs,learning_rate,device,train_data_path,val_data_path)).start()

        
        training_start_time = datetime.now()
        training_start_time_str = training_start_time.strftime('%Y-%m-%d %I:%M:%S %p')
        

        mongodb['run_records'].insert_one({"_id" : uuid.uuid4().__str__(), "training_start_time" : training_start_time, "training_start_time_str" : training_start_time_str, "run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, \
                                        "project_name" : project_name, "user_id" : user_id, "model_family" : model_family, "model_name" : model_name, "training_mode" : training_mode, "batch_size" : batch_size, "num_epochs" : num_epochs, \
                                         "learning_rate" : learning_rate, "model_path" : "", "training_status" : "training"})

            
        res = {
                "status": "success",
                "message": "Training started successfully!"                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)




@app.route("/train_semantic_segmentation_model", methods=['POST'])
def train_semantic_segmentation_model():
    
    logger.info(f"Get request for /train_semantic_segmentation_model")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        train_data_name =  request.form['train_data_name']
        val_data_name =  request.form['val_data_name']
        run_name = request.form['run_name']
        model_arch = request.form['model_arch']
        model_family = request.form['model_family']
        model_name = request.form['model_name']
        training_mode = request.form['training_mode']
        num_epochs = request.form['num_epochs']
        batch_size = request.form['batch_size']
        learning_rate = request.form['learning_rate']

        logger.info(f'Params - email : {email}, project_name : {project_name}, train_data_name : {train_data_name}, val_data_name : {val_data_name}, run_name : {run_name}, model_arch : {model_arch}, model_family : {model_family}, model_name : {model_name}, training_mode : {training_mode}, num_epochs : {num_epochs}, batch_size : {batch_size}, learning_rate : {learning_rate}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ntrain_data_name : {train_data_name}\nval_data_name : {val_data_name}\nrun_name : {run_name}\nmodel_arch : {model_arch}\nmodel_family : {model_family}\nmodel_name : {model_name}\ntraining_mode : {training_mode}\nnum_epochs : {num_epochs}\nbatch_size : {batch_size}\nlearning_rate : {learning_rate}"
        
        num_epochs = int(num_epochs)
        batch_size = int(batch_size)
        learning_rate = float(learning_rate)

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]


        run_record = mongodb["run_records"].find_one({"run_name" : run_name, "project_name" : project_name, "user_id" : user_id})
        if run_record is not None:
            
            res = {
                    "status": "fail",
                    "message": f"Run Name exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
        project_type = project_info['project_type']
        
        train_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : train_data_name})
        train_data_path = train_data_meta['data_extracted_path']
        
        val_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : val_data_name})
        val_data_path = val_data_meta['data_extracted_path']
        
        train_classes = json.loads(open(os.path.join(train_data_path, "metadata.json")).read())["classes"]
        val_classes = json.loads(open(os.path.join(val_data_path, "metadata.json")).read())["classes"]

        if train_classes != val_classes:
        
            res = {
                    "status": "fail",
                    "message": f"Train and Validation data classes are not same!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        device = "cuda:0" if torch.cuda.is_available() else "cpu"

        
        Thread(target=SemanticSegmentationTrainingPipeline, args=(run_name,train_data_name,val_data_name,project_name,user_id,model_arch,model_family,model_name,training_mode,batch_size,num_epochs,learning_rate,device,train_data_path,val_data_path)).start()

        
        training_start_time = datetime.now()
        training_start_time_str = training_start_time.strftime('%Y-%m-%d %I:%M:%S %p')
        

        mongodb['run_records'].insert_one({"_id" : uuid.uuid4().__str__(), "training_start_time" : training_start_time, "training_start_time_str" : training_start_time_str, "run_name" : run_name, "train_data_name" : train_data_name, "val_data_name" : val_data_name, \
                                        "project_name" : project_name, "user_id" : user_id, "model_arch" : model_arch, "model_family" : model_family, "model_name" : model_name, "training_mode" : training_mode, "batch_size" : batch_size, "num_epochs" : num_epochs, \
                                         "learning_rate" : learning_rate, "model_path" : "", "training_status" : "training"})

            
        res = {
                "status": "success",
                "message": "Training started successfully!"                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)




@app.route("/get-run-logs", methods=['POST'])
def get_run_logs():
    
    logger.info(f"Get request for /get-run-logs")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']

        logger.info(f'Params - email : {email}, project_name : {project_name}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        run_history = list(mongodb["run_records"].find({'user_id' : user_id, 'project_name' : project_name}))
        
            
        res = {
                "status": "success",
                "run_history": run_history                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)






@app.route("/get_detailed_training_history", methods=['POST'])
def get_detailed_training_history():
    
    logger.info(f"Get request for /get_detailed_training_history")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        run_name = request.form['run_name']

        logger.info(f'Params - email : {email}, project_name : {project_name}, run_name : {run_name}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\nrun_name : {run_name}"

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]

        
        train_hist = mongodb["training_history"].find_one({"run_name" : run_name, "project_name" : project_name, "user_id" : user_id})
    
        history = train_hist["history"]
        classification_report = train_hist["classification_report"]

        res = {
                "status": "success",
                "history": history,
                "classification_report" : classification_report      
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)












@app.route("/model_evaluation", methods=['POST'])
def model_evaluation():
    
    logger.info(f"Get request for /model_evaluation")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']
        eval_run_name = request.form['eval_run_name']
        run_name = request.form['train_run_name']
        data_name = request.form['data_name']
        val_batch_size = request.form['val_batch_size']

        logger.info(f'Params - email : {email}, project_name : {project_name}, eval_run_name : {eval_run_name}, train_run_name : {run_name}, data_name : {data_name}, val_batch_size : {val_batch_size}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\neval_run_name : {eval_run_name}\ntrain_run_name : {run_name}\ndata_name : {data_name}\nval_batch_size : {val_batch_size}"

        val_batch_size = int(val_batch_size)
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        project_info = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})
        project_type = project_info["project_type"]

        run_record = mongodb["run_records"].find_one({'user_id' : user_id, 'project_name' : project_name, "run_name" : run_name})
        model_path = run_record["model_path"]
        
        train_data_name = run_record["train_data_name"]
        train_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : train_data_name})
        train_data_path = train_data_meta['data_extracted_path']
        
        val_data_meta = mongodb["datasets"].find_one({'user_id' : user_id, 'project_name' : project_name, "data_name" : data_name})
        val_data_path = val_data_meta['data_extracted_path']
        
        if project_type == "Image Classification":
            
            ImageClassificationEvaluationPipeline(
                    eval_run_name = eval_run_name,
                    val_data_name = data_name,
                    project_name = project_name,
                    project_type = project_type,
                    user_id = user_id,
                    run_record = run_record,
                    val_batch_size = val_batch_size,
                    device = "cuda" if torch.cuda.is_available() else "cpu",
                    val_dataset_path = val_data_path       
                    )
            
        if project_type == "Semantic Segmentation":
            
            SemanticSegmentationEvaluationPipeline(
                    eval_run_name = eval_run_name,
                    val_data_name = data_name,
                    project_name = project_name,
                    project_type = project_type,
                    user_id = user_id,
                    run_record = run_record,
                    val_batch_size = val_batch_size,
                    device = "cuda" if torch.cuda.is_available() else "cpu",
                    val_dataset_path = val_data_path    
                    )
            
        if project_type == "Object Detection":
            
            ObjectDetectionEvaluationPipeline(
                    eval_run_name = eval_run_name,
                    val_data_name = data_name,
                    project_name = project_name,
                    project_type = project_type,
                    user_id = user_id,
                    run_record = run_record,
                    val_batch_size = val_batch_size,
                    device = "cuda" if torch.cuda.is_available() else "cpu",
                    val_dataset_path = val_data_path
                    )
        
        if project_type == "Instance Segmentation":
            
            InstanceSegmentationEvaluationPipeline(
                    eval_run_name = eval_run_name,
                    val_data_name = data_name,
                    project_name = project_name,
                    project_type = project_type,
                    user_id = user_id,
                    run_record = run_record,
                    val_batch_size = val_batch_size,
                    device = "cuda" if torch.cuda.is_available() else "cpu",
                    val_dataset_path = val_data_path       
                    )

        res = {
                "status": "success",
                # "history": history,
                # "classification_report" : classification_report      
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)








@app.route("/get-eval-run-logs", methods=['POST'])
def get_eval_run_logs():
    
    logger.info(f"Get request for /get-eval_run-logs")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']

        logger.info(f'Params - email : {email}, project_name : {project_name}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        run_history = list(mongodb["evaluation_history"].find({'user_id' : user_id, 'project_name' : project_name}))
        
            
        res = {
                "status": "success",
                "run_history": run_history                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)





@app.route("/get_single_sample_visualization", methods=['POST'])
def get_single_sample_visualization():
    
    logger.info(f"Get request for /get_single_sample_visualization")
    
    try:
        
        sample_path = request.form['sample_path']
        project_name = request.form['project_name']
        email = request.form['email']

        logger.info(f'Params - email : {email}, project_name : {project_name}, sample_path : {sample_path}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\nsample_path : {sample_path}"

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        project_info = mongodb["projects"].find_one({"user_id" : user_id, "project_name" : project_name})

        if project_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Project does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        project_type = project_info["project_type"]

        if project_type == "Object Detection":
            metadata = json.loads(open(os.path.join(os.path.dirname(os.path.dirname(sample_path)), "metadata.json")).read())
            annotation = json.loads(open(os.path.join(os.path.dirname(os.path.dirname(sample_path)), "annotations", os.path.basename(sample_path)[:-4]+".json")).read())
            image = cv2.imread(sample_path)
            for box, class_id in zip(annotation['bboxes'], annotation['class_ids']):

                startX, startY, endX, endY = box
                
                bg_color = get_color_from_id(class_id+1)
                text_color = isLightOrDark(bg_color)
                class_name = metadata["classes"][class_id]

                cv2.rectangle(image, (startX, startY), (endX, endY), bg_color, 1)
                draw_bb_text(image,f" {class_name} ", (startX, startY, endX, endY),cv2.FONT_HERSHEY_DUPLEX, 0.3, text_color, 1, bg_color)

            save_dir = os.path.join("workdir", user_id, project_name, "sample_visualizations", uuid.uuid4().__str__()[:8])
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join(save_dir, os.path.basename(sample_path))
            cv2.imwrite(save_path, image)
        
        if project_type == "Image Classification":
            
            classname = os.path.basename(os.path.dirname(sample_path))
            image = cv2.imread(sample_path)
            cv2.putText(image, classname, (10, 10), cv2.FONT_HERSHEY_DUPLEX, 0.3, (255, 255, 255), 1)
            
            save_dir = os.path.join("workdir", user_id, project_name, "sample_visualizations", uuid.uuid4().__str__()[:8])
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join(save_dir, os.path.basename(sample_path))
            
            cv2.imwrite(save_path, image)
            
        if project_type == "Semantic Segmentation":
            
            metadata = json.loads(open(os.path.join(os.path.dirname(os.path.dirname(sample_path)), "metadata.json")).read())
            ann_path = os.path.join(os.path.dirname(os.path.dirname(sample_path)), "annotations", os.path.basename(sample_path)[:-4]+".npy")
            image = cv2.imread(sample_path)
            segmap = np.load(ann_path)
            
            segmap_vis = np.zeros_like(image)
            for class_id, class_name in enumerate(metadata["classes"]):
                color = get_color_from_id(class_id+1) 
                segmap_vis[segmap.astype(int) == class_id] = color

            alpha = 0.5
            beta = 1 - alpha
            dst = cv2.addWeighted(image, alpha, segmap_vis, beta, 0.0)

            save_dir = os.path.join("workdir", user_id, project_name, "sample_visualizations", uuid.uuid4().__str__()[:8])
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join(save_dir, os.path.basename(sample_path))
            
            cv2.imwrite(save_path, dst)
            
        
        
        if project_type == "Instance Segmentation":
            metadata = json.loads(open(os.path.join(os.path.dirname(os.path.dirname(sample_path)), "metadata.json")).read())
            annotation = json.loads(open(os.path.join(os.path.dirname(os.path.dirname(sample_path)), "annotations", os.path.basename(sample_path)[:-4]+".json")).read())
            image = cv2.imread(sample_path)
            overlay = image.copy()
            opacity = 0.5  
            for segment, class_id in zip(annotation['segments'], annotation['class_ids']):

                
                fill_color = get_color_from_id(class_id+1)
                text_color = isLightOrDark(fill_color)
                class_name = metadata["classes"][class_id]  
                            
                xvals = []
                yvals = []
                
                            
                for idx, val in enumerate(segment):
                    if idx % 2 == 0:
                        xvals.append(val)
                    else:
                        yvals.append(val)
                        
                
                roi_array = [(xval, yval) for xval, yval in zip(xvals, yvals)]
                roi_points = np.array(roi_array, dtype=np.int32)
                cv2.fillPoly(overlay, [roi_points], fill_color)


                # cv2.rectangle(image, (startX, startY), (endX, endY), bg_color, 1)
                # draw_bb_text(image,f" {class_name} ", (startX, startY, endX, endY),cv2.FONT_HERSHEY_DUPLEX, 0.3, text_color, 1, bg_color)
            
            cv2.addWeighted(overlay, opacity, image, 1 - opacity, 0, image)

            save_dir = os.path.join("workdir", user_id, project_name, "sample_visualizations", uuid.uuid4().__str__()[:8])
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join(save_dir, os.path.basename(sample_path))
            cv2.imwrite(save_path, image)
        
        
        res = {
                "status": "success",   
                "show_path" : save_path
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)








@app.route("/model_inference", methods=['POST'])
def model_inference():
    
    logger.info(f"Get request for /model_inference")
    
    try:

        email = request.form['email']         
        project_name = request.form['project_name']
        run_name = request.form['run_name']
        
            
        logger.info(f'Params - email : {email}, project_name : {project_name}, run_name : {run_name}')
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\nrun_name : {run_name}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        
        project_data = mongodb["projects"].find_one({'user_id' : user_id, 'project_name' : project_name})

        if project_data is None:
            
            res = {
                    "status": "fail",
                    "message": f"Project {project_name} does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        project_type = project_data["project_type"]
        
        run_record = mongodb["run_records"].find_one({'user_id' : user_id, 'project_name' : project_name, 'run_name' : run_name})
        
        if run_record is None:
            
            res = {
                    "status": "fail",
                    "message": f"Run {run_name} does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        
        project_dir = os.path.join("workdir", user_id, project_name, "model_inference")
        os.makedirs(project_dir, exist_ok=True)
    
        
        image_file = request.files['image_file']
        image_path = os.path.join(project_dir, image_file.filename)
        image_file.save(image_path)
        
        device = "cuda" if torch.cuda.is_available() else "cpu" 
        
        if project_type == "Image Classification":
            predicted_class = ImageClassificationSingleImageInference(
                            image_path,
                            project_name,
                            project_type,
                            user_id,
                            run_record,
                            device,        
                            )
            result_dict = {"save_path": image_path, "predicted_class": predicted_class}
            
        if project_type == "Object Detection":
            save_path, classwise_colors = ObjectDetectionSingleImageInference(
                            image_path,
                            project_name,
                            project_type,
                            user_id,
                            run_record,
                            device,     
                            )
            result_dict = {"save_path": save_path, "classwise_colors": classwise_colors}
            
        if project_type == "Instance Segmentation":
            save_path, classwise_colors = InstanceSegmentationSingleImageInference(
                            image_path,
                            project_name,
                            project_type,
                            user_id,
                            run_record,
                            device,       
                            )
            result_dict = {"save_path": save_path, "classwise_colors": classwise_colors}
            
        if project_type == "Semantic Segmentation":
            save_path, classwise_colors = SemanticSegmentationSingleImageInference(
                            image_path,
                            project_name,
                            project_type,
                            user_id,
                            run_record,
                            device,       
                            )
            
            result_dict = {"save_path": save_path, "classwise_colors": classwise_colors}
            
            
        res = {
                "status": "success",
                "data": result_dict,                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)









@app.route("/filter_noisy_samples", methods=['POST'])
def filter_noisy_samples():
    
    logger.info(f"Get request for /filter_noisy_samples")
    
    try:
        
        data_name = request.form['data_name']
        filtered_data_name = request.form['filtered_data_name']
        project_name = request.form['project_name']
        email = request.form['email']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, filtered_data_name : {filtered_data_name}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\nfiltered_data_name : {filtered_data_name}"

        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        project_info = mongodb["projects"].find_one({"user_id" : user_id, "project_name" : project_name})

        if project_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Project does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        filtered_data_info = mongodb["datasets"].find_one({"user_id" : user_id, "project_name" : project_name, "data_name" : filtered_data_name})
        if filtered_data_info is not None:
                
            res = {
                    "status": "fail",
                    "message": f"Filtered Data {filtered_data_name} exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        dataset_info = mongodb["datasets"].find_one({"user_id" : user_id, "project_name" : project_name, "data_name" : data_name})
        if dataset_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Data Name - {data_name} does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        def NoiseFiltering(dataset_info, user_id, project_name, project_info, data_name, filtered_data_name):
            
            data_path = dataset_info["data_extracted_path"]
            
            project_type = project_info["project_type"]
                    
            project_dir = os.path.join("workdir", user_id, project_name)
            os.makedirs(project_dir, exist_ok=True)
            
            data_id = str(uuid.uuid4())[:8]
                
            extracted_path = os.path.join(project_dir, f"data_{data_id}_extracted")
            
            zipfile_path = os.path.join(project_dir, f"data_{data_id}_zipfile.zip")
            
            
            data_creation_time = datetime.now()
            data_creation_time_str = data_creation_time.strftime('%Y-%m-%d %I:%M:%S %p')
            
            noisy_filtering_info = {
                                "_id" : user_id+"_"+project_name+"_"+data_name+"_"+filtered_data_name,
                                "data_name" : data_name, 
                                "filtered_data_name" : filtered_data_name, 
                                "project_name" : project_name,
                                "user_id" : user_id, 
                                "project_type" : project_type, 
                                "process_start_time" : data_creation_time, 
                                "process_start_time_str" : data_creation_time_str,
                                "total_number_of_samples" : 0, 
                                "noisy_samples_filtered" : 0, 
                                "current_progress" : 0,
                                "process_status" : f"Copying data from {data_name} to {filtered_data_name}",
                                "path_to_zipfile" : zipfile_path
                            }
            
            mongodb["noisy_filtering"].insert_one(noisy_filtering_info)
            
            shutil.copytree(data_path, extracted_path)   
            
            
            
            data_meta = {
                "_id" : user_id+"_"+project_name+"_"+data_id,
                "data_id" : data_id,
                "project_name" : project_name,
                "user_id" : user_id,
                "data_name" : filtered_data_name,
                "data_type" : "Noise Filtered",
                "project_type" : project_type,
                "data_zip_path" : "Data Created via Noisy Image Filtering",
                "data_extracted_path" : extracted_path,
                "data_creation_time" : data_creation_time,
                "data_creation_time_str" : data_creation_time_str,
            }
            
            mongodb["datasets"].insert_one(data_meta)
            
            
            noisy_classes = ['clean', 'noisy']  
            
            from torchvision import models
            from torchvision import transforms

            preprocess = transforms.Compose([
                transforms.Resize((282, 500)),  
                transforms.ToTensor(),  
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  
            ])

            model = models.resnet50(pretrained=False)
            model.fc = torch.nn.Linear(in_features=2048, out_features=2)

            # Path to the checkpoint
            checkpoint_path = os.path.join('files', 'voc_model.pth')

            checkpoint = torch.load(checkpoint_path, map_location=torch.device('cpu'))

            if 'model_state_dict' in checkpoint:
                print("Loading model from full checkpoint...")
                model.load_state_dict(checkpoint['model_state_dict'])
            else:
                print("Loading model from state_dict file...")
                model.load_state_dict(checkpoint)

            model.eval() 

            # Function to make predictions
            def predict_image(image_path, model):
                image = Image.open(image_path).convert('RGB')
                input_tensor = preprocess(image)
                input_batch = input_tensor.unsqueeze(0)  

                with torch.no_grad():
                    output = model(input_batch)
                probabilities = torch.nn.functional.softmax(output[0], dim=0)
                predicted_class = probabilities.argmax().item()  # 0 for clean, 1 for noisy

                return predicted_class
            
            noisy_samples_filtered = 0
            
            
                        
            update_query = {"data_name" : data_name, 
                            "filtered_data_name" : filtered_data_name, 
                            "project_name" : project_name,
                            "user_id" : user_id}

            if project_type == "Object Detection":
                
                image_folder = os.path.join(extracted_path, "images")
                annotation_folder = os.path.join(extracted_path, "annotations")
                image_list = os.listdir(image_folder)
                number_of_images = len(image_list)
                update_interval = number_of_images // 100
                img_iter = 0
                for idx, image_file in enumerate(image_list):
                    image_path = os.path.join(image_folder, image_file)
                    predicted_class = predict_image(image_path, model)
                    if predicted_class == 1:
                        noisy_samples_filtered += 1
                        # remove noisy image and annotation
                        os.remove(image_path)
                        os.remove(os.path.join(annotation_folder, image_file[:-4]+".json"))
                        
                    if idx % update_interval == 0:
                        
                        noisy_filtering_info = {
                                        "total_number_of_samples" : number_of_images, 
                                        "noisy_samples_filtered" : noisy_samples_filtered, 
                                        "current_progress" : round((img_iter/number_of_images)*100),
                                        "process_status" : f"{round((img_iter/number_of_images)*100)}% Completed"
                                    }
                        
                        mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})

                    img_iter += 1

                
                shutil.make_archive(extracted_path, 'zip', zipfile_path)

                noisy_filtering_info = {
                                "total_number_of_samples" : number_of_images, 
                                "noisy_samples_filtered" : noisy_samples_filtered, 
                                "current_progress" : 100,
                                "process_status" : f"Completed!"
                            }
                
                mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})
                    
                    
                
            
            if project_type == "Image Classification":
                
                folders = os.listdir(extracted_path)
                number_of_images = np.sum([len(os.listdir(os.path.join(extracted_path, folder))) for folder in folders])
                update_interval = number_of_images // 100
                
                img_iter = 0
                
                for folder in folders:
                    
                    image_folder = os.path.join(extracted_path, folder)
                    image_list = os.listdir(image_folder)
                    
                    for idx, image_file in enumerate(image_list):
                        image_path = os.path.join(image_folder, image_file)
                        predicted_class = predict_image(image_path, model)
                        if predicted_class == 1:
                            noisy_samples_filtered += 1
                            # remove noisy image and annotation
                            os.remove(image_path)
                            
                        if img_iter % update_interval == 0:
                            
                            noisy_filtering_info = {
                                            "total_number_of_samples" : number_of_images, 
                                            "noisy_samples_filtered" : noisy_samples_filtered, 
                                            "current_progress" : round((img_iter/number_of_images)*100),
                                            "process_status" : f"{round((img_iter/number_of_images)*100)}% Completed"
                                        }
                            
                            mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})

                        img_iter += 1

                    
                shutil.make_archive(extracted_path, 'zip', zipfile_path)

                noisy_filtering_info = {
                                "total_number_of_samples" : number_of_images, 
                                "noisy_samples_filtered" : noisy_samples_filtered, 
                                "current_progress" : 100,
                                "process_status" : f"Completed!"
                            }
                
                mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})
                
            if project_type == "Semantic Segmentation":
                
                
                image_folder = os.path.join(extracted_path, "images")
                annotation_folder = os.path.join(extracted_path, "annotations")
                image_list = os.listdir(image_folder)
                number_of_images = len(image_list)
                update_interval = number_of_images // 100
                img_iter = 0
                for idx, image_file in enumerate(image_list):
                    image_path = os.path.join(image_folder, image_file)
                    predicted_class = predict_image(image_path, model)
                    if predicted_class == 1:
                        noisy_samples_filtered += 1
                        # remove noisy image and annotation
                        os.remove(image_path)
                        os.remove(os.path.join(annotation_folder, image_file[:-4]+".json"))
                        
                    if idx % update_interval == 0:
                        
                        noisy_filtering_info = {
                                        "total_number_of_samples" : number_of_images, 
                                        "noisy_samples_filtered" : noisy_samples_filtered, 
                                        "current_progress" : round((img_iter/number_of_images)*100),
                                        "process_status" : f"{round((img_iter/number_of_images)*100)}% Completed"
                                    }
                        
                        mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})

                    img_iter += 1

                    
                shutil.make_archive(extracted_path, 'zip', zipfile_path)

                noisy_filtering_info = {
                                "total_number_of_samples" : number_of_images, 
                                "noisy_samples_filtered" : noisy_samples_filtered, 
                                "current_progress" : 100,
                                "process_status" : f"Completed!"
                            }
                
                mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})
                
            if project_type == "Instance Segmentation":
            
                
                
                image_folder = os.path.join(extracted_path, "images")
                annotation_folder = os.path.join(extracted_path, "annotations")
                image_list = os.listdir(image_folder)
                number_of_images = len(image_list)
                update_interval = number_of_images // 100
                img_iter = 0
                for idx, image_file in enumerate(image_list):
                    image_path = os.path.join(image_folder, image_file)
                    predicted_class = predict_image(image_path, model)
                    if predicted_class == 1:
                        noisy_samples_filtered += 1
                        # remove noisy image and annotation
                        os.remove(image_path)
                        os.remove(os.path.join(annotation_folder, image_file[:-4]+".json"))
                        
                    if idx % update_interval == 0:
                        
                        noisy_filtering_info = {
                                        "total_number_of_samples" : number_of_images, 
                                        "noisy_samples_filtered" : noisy_samples_filtered, 
                                        "current_progress" : round((img_iter/number_of_images)*100),
                                        "process_status" : f"{round((img_iter/number_of_images)*100)}% Completed"
                                    }
                        
                        mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})

                    img_iter += 1

                shutil.make_archive(extracted_path, 'zip', zipfile_path)

                noisy_filtering_info = {
                                "total_number_of_samples" : number_of_images, 
                                "noisy_samples_filtered" : noisy_samples_filtered, 
                                "current_progress" : 100,
                                "process_status" : f"Completed!"
                            }
                
                mongodb['noisy_filtering'].update_many(update_query, {'$set' : noisy_filtering_info})
                
        Thread(target=NoiseFiltering, args=(dataset_info, user_id, project_name, project_info, data_name, filtered_data_name)).start()
        
        
        res = {
                "status": "success",   
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)










@app.route("/get_noise_filtering_logs", methods=['POST'])
def get_noise_filtering_logs():
    
    logger.info(f"Get request for /get_noise_filtering_logs")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']

        logger.info(f'Params - email : {email}, project_name : {project_name}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        run_history = list(mongodb["noisy_filtering"].find({'user_id' : user_id, 'project_name' : project_name}))
        
            
        res = {
                "status": "success",
                "run_history": run_history                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)













@app.route("/split_dataset", methods=['POST'])
def split_dataset():
    
    logger.info(f"Get request for /split_dataset")
    
    try:
        
        data_name = request.form['data_name']
        split_data_name_1 = request.form['split_data_name_1']
        split_data_name_2 = request.form['split_data_name_2']
        split_ratio = request.form['split_ratio']
        project_name = request.form['project_name']
        email = request.form['email']

        logger.info(f'Params - email : {email}, project_name : {project_name}, data_name : {data_name}, split_data_name_1 : {split_data_name_1}, split_data_name_2 : {split_data_name_2}, split_ratio : {split_ratio}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}\ndata_name : {data_name}\nsplit_data_name_1 : {split_data_name_1}\nsplit_data_name_2 : {split_data_name_2}, split_ratio : {split_ratio}"

        split_ratio = float(split_ratio)
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        project_info = mongodb["projects"].find_one({"user_id" : user_id, "project_name" : project_name})

        if project_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Project does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        split_data_name_1_info = mongodb["datasets"].find_one({"user_id" : user_id, "project_name" : project_name, "data_name" : split_data_name_1})
        if split_data_name_1_info is not None:
                
            res = {
                    "status": "fail",
                    "message": f"Split Data {split_data_name_1} exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        split_data_name_2_info = mongodb["datasets"].find_one({"user_id" : user_id, "project_name" : project_name, "data_name" : split_data_name_2})
        if split_data_name_2_info is not None:
                
            res = {
                    "status": "fail",
                    "message": f"Split Data {split_data_name_2} exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        dataset_info = mongodb["datasets"].find_one({"user_id" : user_id, "project_name" : project_name, "data_name" : data_name})
        if dataset_info is None:
                
            res = {
                    "status": "fail",
                    "message": f"Data Name - {data_name} does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)
        
        def DataSplitting(dataset_info, user_id, project_name, project_info, data_name, split_data_name_1, split_data_name_2, split_ratio):
            
            data_path = dataset_info["data_extracted_path"]
            
            project_type = project_info["project_type"]
                    
            project_dir = os.path.join("workdir", user_id, project_name)
            os.makedirs(project_dir, exist_ok=True)


            split_1_data_id = str(uuid.uuid4())[:8]
            split_1_extracted_path = os.path.join(project_dir, f"data_{split_1_data_id}_extracted")
            os.makedirs(split_1_extracted_path, exist_ok=True)

            split_2_data_id = str(uuid.uuid4())[:8]
            split_2_extracted_path = os.path.join(project_dir, f"data_{split_2_data_id}_extracted")
            os.makedirs(split_2_extracted_path, exist_ok=True)

            if project_type == 'Image Classification':
                class_folders = os.listdir(data_path)
                for class_name in class_folders:
                    src_path = os.path.join(data_path, class_name)
                    split_1_dest = os.path.join(split_1_extracted_path, class_name)
                    split_2_dest = os.path.join(split_2_extracted_path, class_name)
                    os.makedirs(split_1_dest, exist_ok=True)
                    os.makedirs(split_2_dest, exist_ok=True)
                    image_list = os.listdir(src_path)
                    split_1_samples = random.sample(image_list, round(len(image_list)*split_ratio))
                    split_2_samples = list(set(image_list)-set(split_1_samples))
                    for file_name in tqdm(split_1_samples, desc=f"Copying Class - {class_name} images to Split 1 Dir"):
                        shutil.copy(os.path.join(src_path, file_name), split_1_dest)
                    for file_name in tqdm(split_2_samples, desc=f"Copying Class - {class_name} images to Split 2 Dir"):
                        shutil.copy(os.path.join(src_path, file_name), split_2_dest)


            if project_type == 'Object Detection':
                image_src = os.path.join(data_path, "images")
                ann_src = os.path.join(data_path, "annotations")
                metedata_path = os.path.join(data_path, "metadata.json")
                shutil.copy(metedata_path, split_1_extracted_path)
                shutil.copy(metedata_path, split_2_extracted_path)
                split_1_image_dest = os.path.join(split_1_extracted_path, "images")
                split_1_ann_dest = os.path.join(split_1_extracted_path, "annotations")
                split_2_image_dest = os.path.join(split_2_extracted_path, "images")
                split_2_ann_dest = os.path.join(split_2_extracted_path, "annotations")
                os.makedirs(split_1_image_dest, exist_ok=True)
                os.makedirs(split_1_ann_dest, exist_ok=True)
                os.makedirs(split_2_image_dest, exist_ok=True)
                os.makedirs(split_2_ann_dest, exist_ok=True)
                image_list = os.listdir(image_src)
                split_1_samples = random.sample(image_list, round(len(image_list)*split_ratio))
                split_2_samples = list(set(image_list)-set(split_1_samples))
                for file_name in tqdm(split_1_samples, desc=f"Copying samples to Split 1 Dir"):
                    shutil.copy(os.path.join(image_src, file_name), split_1_image_dest)
                    shutil.copy(os.path.join(ann_src, ".".join(file_name.split(".")[:-1])+".json"), split_1_ann_dest)
                for file_name in tqdm(split_2_samples, desc=f"Copying samples to Split 2 Dir"):
                    shutil.copy(os.path.join(image_src, file_name), split_2_image_dest)
                    shutil.copy(os.path.join(ann_src, ".".join(file_name.split(".")[:-1])+".json"), split_2_ann_dest)

            if project_type == 'Instance Segmentation':
                image_src = os.path.join(data_path, "images")
                ann_src = os.path.join(data_path, "annotations")
                metedata_path = os.path.join(data_path, "metadata.json")
                shutil.copy(metedata_path, split_1_extracted_path)
                shutil.copy(metedata_path, split_2_extracted_path)
                split_1_image_dest = os.path.join(split_1_extracted_path, "images")
                split_1_ann_dest = os.path.join(split_1_extracted_path, "annotations")
                split_2_image_dest = os.path.join(split_2_extracted_path, "images")
                split_2_ann_dest = os.path.join(split_2_extracted_path, "annotations")
                os.makedirs(split_1_image_dest, exist_ok=True)
                os.makedirs(split_1_ann_dest, exist_ok=True)
                os.makedirs(split_2_image_dest, exist_ok=True)
                os.makedirs(split_2_ann_dest, exist_ok=True)
                image_list = os.listdir(image_src)
                split_1_samples = random.sample(image_list, round(len(image_list)*split_ratio))
                split_2_samples = list(set(image_list)-set(split_1_samples))
                for file_name in tqdm(split_1_samples, desc=f"Copying samples to Split 1 Dir"):
                    shutil.copy(os.path.join(image_src, file_name), split_1_image_dest)
                    shutil.copy(os.path.join(ann_src, ".".join(file_name.split(".")[:-1])+".json"), split_1_ann_dest)
                for file_name in tqdm(split_2_samples, desc=f"Copying samples to Split 2 Dir"):
                    shutil.copy(os.path.join(image_src, file_name), split_2_image_dest)
                    shutil.copy(os.path.join(ann_src, ".".join(file_name.split(".")[:-1])+".json"), split_2_ann_dest)


            if project_type == 'Semantic Segmentation':
                image_src = os.path.join(data_path, "images")
                ann_src = os.path.join(data_path, "annotations")
                metedata_path = os.path.join(data_path, "metadata.json")
                shutil.copy(metedata_path, split_1_extracted_path)
                shutil.copy(metedata_path, split_2_extracted_path)
                split_1_image_dest = os.path.join(split_1_extracted_path, "images")
                split_1_ann_dest = os.path.join(split_1_extracted_path, "annotations")
                split_2_image_dest = os.path.join(split_2_extracted_path, "images")
                split_2_ann_dest = os.path.join(split_2_extracted_path, "annotations")
                os.makedirs(split_1_image_dest, exist_ok=True)
                os.makedirs(split_1_ann_dest, exist_ok=True)
                os.makedirs(split_2_image_dest, exist_ok=True)
                os.makedirs(split_2_ann_dest, exist_ok=True)
                image_list = os.listdir(image_src)
                split_1_samples = random.sample(image_list, round(len(image_list)*split_ratio))
                split_2_samples = list(set(image_list)-set(split_1_samples))
                for file_name in tqdm(split_1_samples, desc=f"Copying samples to Split 1 Dir"):
                    shutil.copy(os.path.join(image_src, file_name), split_1_image_dest)
                    shutil.copy(os.path.join(ann_src, ".".join(file_name.split(".")[:-1])+".npy"), split_1_ann_dest)
                for file_name in tqdm(split_2_samples, desc=f"Copying samples to Split 2 Dir"):
                    shutil.copy(os.path.join(image_src, file_name), split_2_image_dest)
                    shutil.copy(os.path.join(ann_src, ".".join(file_name.split(".")[:-1])+".npy"), split_2_ann_dest)
                    
            
            data_creation_time = datetime.now()
            data_creation_time_str = data_creation_time.strftime('%Y-%m-%d %I:%M:%S %p')
            
            data_split_info = {
                                "_id" : user_id+"_"+project_name+"_"+data_name+"_"+split_1_data_id+"_"+split_2_data_id,
                                "data_name" : data_name, 
                                "split_data_name_1" : split_data_name_1, 
                                "split_data_name_2" : split_data_name_2,
                                "project_name" : project_name,
                                "user_id" : user_id, 
                                "project_type" : project_type, 
                                "process_start_time" : data_creation_time, 
                                "process_start_time_str" : data_creation_time_str,
                                "process_status" : f"Completed!",
                            }
            
            mongodb["data_split"].insert_one(data_split_info)
            
            
            
            data_meta = {
                "_id" : user_id+"_"+project_name+"_"+split_1_data_id,
                "data_id" : split_1_data_id,
                "project_name" : project_name,
                "user_id" : user_id,
                "data_name" : split_data_name_1,
                "data_type" : "Splitted Data",
                "project_type" : project_type,
                "data_zip_path" : "Data Created via Splitting",
                "data_extracted_path" : split_1_extracted_path,
                "data_creation_time" : data_creation_time,
                "data_creation_time_str" : data_creation_time_str,
            }
            
            mongodb["datasets"].insert_one(data_meta)
            
            
            data_meta = {
                "_id" : user_id+"_"+project_name+"_"+split_2_data_id,
                "data_id" : split_2_data_id,
                "project_name" : project_name,
                "user_id" : user_id,
                "data_name" : split_data_name_2,
                "data_type" : "Splitted Data",
                "project_type" : project_type,
                "data_zip_path" : "Data Created via Splitting",
                "data_extracted_path" : split_2_extracted_path,
                "data_creation_time" : data_creation_time,
                "data_creation_time_str" : data_creation_time_str,
            }
            
            mongodb["datasets"].insert_one(data_meta)
            
            
        DataSplitting(dataset_info, user_id, project_name, project_info, data_name, split_data_name_1, split_data_name_2, split_ratio)
        
        res = {
                "status": "success",   
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)







@app.route("/get_data_split_logs", methods=['POST'])
def get_data_split_logs():
    
    logger.info(f"Get request for /get_data_split_logs")
    
    try:
        
        email = request.form['email']
        project_name = request.form['project_name']

        logger.info(f'Params - email : {email}, project_name : {project_name}')
            
        frontend_inputs = f"email : {email}\nproject_name : {project_name}"
        
        user_data = mongodb['users'].find_one({'email' : email})

        if user_data is None:
                
            res = {
                    "status": "fail",
                    "message": f"Email does not exists!"
                }

            logger.info(json.dumps(res, indent=4,  default=str))
            return json.dumps(res, separators=(',', ':'), default=str)

        user_id = user_data["_id"]
        
        run_history = list(mongodb["data_split"].find({'user_id' : user_id, 'project_name' : project_name}))
        
            
        res = {
                "status": "success",
                "run_history": run_history                
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)












@app.route("/get-errors-logs")
def get_error_logs():
    
    logger.info(f"Get request for /get-errors-logs")
    
    try:

        error_df = mongodb["errordb"].find()
        error_df = pd.DataFrame(error_df)

        error_details = error_df.groupby(["filename", "filepath", "line_no", "function"])[["datetime_str", "error", "full_traceback", "additional_info"]].last()
        error_cnt = error_df.groupby(["filename", "filepath", "line_no", "function"])[["full_traceback"]].count()
        error_cnt["error_count"] = error_cnt["full_traceback"]
        error_cnt = error_cnt.drop("full_traceback", axis=1)
        error_list = pd.concat([error_details, error_cnt], axis=1).reset_index().to_dict("records")

        res = {
                "error_list" : error_list,
                "status": "success",
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)

    except Exception as e:
                
        log_exception(e)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4,  default=str))
        return json.dumps(res, separators=(',', ':'), default=str)






if __name__ == "__main__":
        

    app.secret_key = os.urandom(323)
    hostname = "0.0.0.0"
    port_no = args.zella_main_app_port
    logger.info(f"Server started at - http://{hostname}:{str(port_no)}")
    # app.run()
    # socket.run(app, host=hostname, port=port_no, debug=False)
    redis_obj.set(f'zella-server-started', 1)

    serve(app,host=hostname, port=int(port_no),
               expose_tracebacks=True, 
               connection_limit=os.getenv('CONNECTION_LIMIT', '100'),
               threads=os.getenv('THREADS', '50'),
               channel_timeout=os.getenv('CHANNEL_TIMEOUT', '60'),
               cleanup_interval=os.getenv('CLEANUP_INTERVAL', '10'),
               backlog=os.getenv('BACKLOG', '1024'))























