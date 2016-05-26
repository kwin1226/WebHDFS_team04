import os
import urllib2
import urlparse
import json
from werkzeug import secure_filename
from poster.encode import multipart_encode
from poster.streaminghttp import register_openers
from flask import Flask, jsonify, render_template, request, url_for, redirect

#For Python 3
# import urllib.request as urllib2 
# from urllib.parse import urlparse 
  
# APP : 192.168.42.10 Remote : 140.138.77
url_HOME_ = 'http://140.138.77.147:50070/webhdfs/v1'
url_Read= url_HOME_ + '/2016-BigData/team04/1011659/test.txt?op=OPEN'
url_List= url_HOME_ + '/2016-BigData/?op=LISTSTATUS'
url_NewDir= url_HOME_ + '/2016-BigData/NewwDIR?op=MKDIRS&permission=711'
url_DeleteDir =  url_HOME_ + '/2016-BigData/NewwDIR/?op=DELETE&permission=711'
url_CreateDir = url_HOME_ + '/2016-BigData/team04/1011659/temp.txt?op=CREATE&user.name=team04'

UPLOAD_FOLDER = './tmp'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def request_handler(url_con,method) :
    opener = urllib2.build_opener(urllib2.HTTPHandler)
    req = urllib2.Request(url_con)
    req.add_header('Content-Type', 'application/json')
    req.get_method = lambda: method
    try:
        url = opener.open(req)
        JSONResult = url.read()
        JSONResult_decode = JSONResult.decode('utf-8')
    except urllib2.HTTPError as e:
         JSONResult = e.read()
         JSONResult_decode = JSONResult.decode('utf-8')
    return JSONResult_decode

# def uploadFile_request(url_con) :
#     register_openers()
#     with open("./tmp/sqltest.txt", 'r') as f:
#         datagen, headers = multipart_encode({"file": f})
#         request = urllib2.Request(url_con, datagen, headers)
#         try:
#             url = urllib2.urlopen(request)
#             JSONResult = url.read()
#             JSONResult_decode = JSONResult.decode('utf-8')
#         except urllib2.HTTPError as e:
#              JSONResult = e.read()
#              JSONResult_decode = JSONResult.decode('utf-8')
#     return JSONResult_decode


@app.route('/_del_list')
def del_file():
    cur_url = request.args.get('cur_url', "false", type=str)
    cur_url = url_HOME_ + cur_url + '/?op=DELETE&permission=711'
    return request_handler(cur_url, 'DELETE')

@app.route('/_get_list')
def request_builder() :
    cur_url = request.args.get('cur_url', "false", type=str)
    cur_url = url_HOME_ + cur_url + '/?op=LISTSTATUS'
    return request_handler(cur_url, 'GET')

@app.route("/_upload_doc", methods=['GET', 'POST'])
def upload_loc():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('index'))
    return "You haven't upload a File yet. or something went wrong..."

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)