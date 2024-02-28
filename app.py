from time import sleep
from flask import Flask, make_response, render_template, redirect, url_for, request
import json, requests
from datetime import datetime, timedelta
import os


from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
# Flask - библиотека для запуска нашего приложения Flask - app
# render_template - нужен для то чтобы ваша страница html отобразилась корреткно
# redirect - нам понадобится для обработки запросы формы где мы перенаприм пользователя на страницу админ панели
# url_for - вспомогательна библиотека для того чтобы сделать правильный переход по ссылке в нашем случеш мы будем ссылаться на adm_panel
# request - обработчик запросов GET/POST и дргуих 

# def form_backup(name, email, message):
#     with open('form_usage.txt', 'r') as f:
#         counter = f.read()
#     if counter == '':
#         counter = 1
#         with open('form_usage.txt', 'w') as f:
#             f.write(f'{str(counter)}. [{time_now.strftime("%Y-%m-%d %H:%M:%S")}] email:{email} - {name} - "{message}"\n')  
#     else:
#         with open('form_usage.txt', 'r') as f:
#             counter = int(f.readlines()[-1][0]) + 1
#         with open('form_usage.txt', 'a') as f:
#             f.write(f'{str(counter)}. [{time_now.strftime("%Y-%m-%d %H:%M:%S")}] email:{email} - {name} - "{message}"\n')
#     return counter

time_now = datetime.now() + timedelta(hours=2)

def tg_sendMsg(msg: str = "no message",TOKEN='7032094699:AAFlN7PBqH6LJKR-K-YpFhnanGop9MnYv2Q',chat_id=752683417,
    ps = "\n",
    *,
    sep_msg: bool = False,
):

    """send message via telegram api(url)\n
    url = (
        f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={msg}"
    )"""
    # TOKEN = TOKEN
    # chat_id = chat_id
    _ps = ps
    isStr = type(msg) is str
    if isStr:
        msg = msg + _ps
    # if sep_msg and type(msg) == list:
    #     for m in msg:
    #         url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={m + _ps}"
    #         requests.get(url).json()
    # elif not sep_msg and type(msg) != str:
    #     msg = " \n".join([m for m in msg]) + _ps
    url = (
        f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={msg}"
    )
    requests.get(url).json()


def form_backup(name, email, message, subject):
    with open('form_usage.txt', 'a') as f:
        msg = f'[{time_now.strftime("%Y-%m-%d %H:%M:%S")}] {email} \n\n{name}\n\n<{subject}>\n\n"{message}"\n'+'-'*150+'\n\n'
        f.write(msg)  
    
    tg_sendMsg(f'[{time_now.strftime("%Y-%m-%d %H:%M:%S")}] {email} \n\n{name}\n\n<{subject}>\n\n"{message}"')

app = Flask(__name__)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["500 per day", "200 per hour"],
    storage_uri="memory://",
)

app.config['STATIC_FOLDER'] = 'static'
app.config['STATIC_URL_PATH'] = 'static'

@app.route('/', methods=['GET','POST'])
@limiter.limit('20/minute')
def home():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        subject = request.form['subject']
        form_backup(name, email, message, subject)
        print(email)
        return redirect('/')
    
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
    # app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))