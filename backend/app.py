

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

# from utils.autopurge import *


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

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))
        
        avatar_dir = os.path.join('files', 'user-avatars')
        os.makedirs(avatar_dir, exist_ok=True)
        avatar_path = os.path.join(avatar_dir, email+'.jpg')
        generate_avatar(letter=first_name[0], file_path=avatar_path)

        allowed_msg_methods = {"sms" : False, "whatsapp" : False, "telegram" : False, "email" : False}
        
        mongodb['users'].insert_one({'_id': user_id, 'email' : email, 'phone_number' : phone_number, 'first_name' : first_name, 'last_name' : last_name, 'password' : password, 'avatar_path' : avatar_path, "allowed_msg_methods" : allowed_msg_methods})

        
        res = {
                "status": "success",
                "message": f"Account created successfully!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))



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

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))
        
        if user_df.shape[0] == 1:
            if user_df.loc[0]['password'] != password:
                                    
                res = {
                        "status": "fail",
                        "message": f"Password incorrect! Please try again with correct password."
                    }

                logger.info(json.dumps(res, indent=4))
                return json.dumps(res, separators=(',', ':'))
            
        token = uuid.uuid4().__str__()
        current_tokens[token] = {'email':email, 'start_time' : time.time(), "avatar_path" : user_df.loc[0]['avatar_path']}

        redis_obj.set(f"all_user_current_tokens", json.dumps(current_tokens, indent=4))
        
        res = {
                "status": "success",
                "message": f"Login Successful!",
                "token" : token,
                "avatar" : user_df.loc[0]['avatar_path']
                
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))

    except Exception as e:
        
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))


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

                logger.info(json.dumps(res, indent=4))
                return json.dumps(res, separators=(',', ':'))

            
            res = {
                    "status": "success",
                    "message": f"Token Exists!",
                    "email" : current_tokens[token]['email'],
                    "avatar" : current_tokens[token]['avatar_path']
                    
                }

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))
        

        res = {
                "status": "fail",
                "message": f"Token not Exists!"
                
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))


    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))








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

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))

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

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))





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

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))

        if mongodb['users'].find_one({'email' : new_email}) is not None and email != new_email:

               
            res = {
                    "status": "fail",
                    "message": f"New Email already exists!"
                }

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))
        
        
        if mongodb['users'].find_one({'phone_number' : new_phone_number}) is not None and phone_number != new_phone_number:

               
            res = {
                    "status": "fail",
                    "message": f"New Phone Number already exists!"
                }

            logger.info(json.dumps(res, indent=4))
            return json.dumps(res, separators=(',', ':'))


        update_query = {"_id" : user_data["_id"]}
        
        mongodb['users'].update_one(update_query, {"$set" : new_data})

        res = {
                "status": "success",
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))

    except Exception as e:
                
        additional_info = {"Inputs Received From Frontend" : frontend_inputs}
        log_exception(e, additional_info=additional_info)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))





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

#     logger.info(json.dumps(res, indent=4))
#     return json.dumps(res, separators=(',', ':'))



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

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))

    except Exception as e:
                
        log_exception(e)
        traceback.print_exc()

        res = {
                "status": "fail",
                "message": f"Somthing went wrong!"
            }

        logger.info(json.dumps(res, indent=4))
        return json.dumps(res, separators=(',', ':'))






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























