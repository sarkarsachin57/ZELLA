

import os

list_of_commands = '''

pip install --upgrade pip
pip install setproctitle pymongo
pip install torch==1.13.0+cu116 torchvision==0.14.0+cu116 torchaudio==0.13.0 --extra-index-url https://download.pytorch.org/whl/cu116
pip install requests tensorflow pandas numpy redis pymongo pickle-mixin psutil opencv-python imutils websockets markdown matplotlib apricot-select plotly pika moviepy tqdm scikit-learn yacs easydict
pip install mailslurp-client
pip install ultralytics pytorch-lightning==1.8.6
pip install gdown==4.6.0
pip install Flask==2.0.3 Flask-Cors==3.0.10 Flask-JSGlue==0.3.1 flask-ngrok==0.0.25 Jinja2==3.0.0 Werkzeug==2.3.3 waitress==2.1.2
pip install ftfy regex
pip install git+https://github.com/openai/CLIP.git
pip install apricot-select inplace-abn timm visdom


'''

for command in list_of_commands.split("\n"):
    if command != "":
        print(f"Command - {command}")
        os.system(command)