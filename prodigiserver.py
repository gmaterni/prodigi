#!/usr/bin/env python3
# coding: utf-8

#from cheroot.wsgi import Server 
import sys
import os
import argparse
from bottle import Bottle
from bottle import request, static_file

app=Bottle()

ROOT_PATH = '.'

# def prn_path():
#     print("")
#     cwd = os.getcwd()
#     abspath = os.path.abspath(__file__)
#     dirname = os.path.dirname(abspath)
#     basename = os.path.basename(abspath)
#     print("cwd:%s" % cwd)
#     print("abspath:%s" % abspath)
#     print("dirname:%s" % dirname)
#     print("basename:%s" % basename)

# def prn_params(rqs):
#     print("===============")
#     print("query_string:")
#     print(rqs.query_string)
#     print("url_args:")
#     for k, v in rqs.url_args.items():
#         print(k + "  :  " + v)
#     print("params:")
#     for k, v in rqs.params.items():
#         print(k + "  :  " + v)
#     print("================")


def request_params(rqs):
    query = rqs.query_string
    pars = {}
    lst = query.split('&')
    for item in lst:
        kv = item.split('=')
        pars[kv[0].strip()] = kv[1]
    return pars


def request_data(rqs):
    d = dict(rqs.headers.items())
    cl = d['Content-Length'].strip()
    le = int(cl)
    data = rqs.body.read(le)
    return data


@app.route('/action', method='GET')
@app.route('/action/<var1>', method='GET')
@app.route('/action/<var1>/<var2>', method='GET')
def action(var1="x1", var2="x2"):
    t = f'var1:{var1} var2:{var2}'
    return t


@app.route('/', method='GET')
def hello():
    # pars = request_params(request)
    # prn_params(request)
    return static_file("index.html", root=ROOT_PATH)

@app.route('/status', method='GET')
def status():
    # pars = request_params(request)
    # prn_params(request)
    return "1"


@app.route('/<filepath:path>', nethod='GET')
def server_static(filepath):
    if 'favicon' in filepath:
        return
    return static_file(filepath, root=ROOT_PATH)

# @route('/read', nethod='GET')
# def read():
#     pars = request_params(request)
#     filepath = pars.get('file', "UNDEFINED_FILE.txt")
#     try:
#         with open(filepath, "rb") as f:
#             data = f.read()
#     except IOError as e:
#         raise Exception(e)
#     return data


@app.route('/write/<filepath:path>', method='POST')
def write(filepath=""):
    # print("write")
    data = request_data(request)
    try:
        fpath = os.path.join(ROOT_PATH, filepath)
        # print(fpath)
        out = open(fpath, 'wb')
        out.write(data)
        out.close()
        os.chmod(fpath, 0o666)
    except IOError as e:
        raise Exception(e)
    return "1"


@app.error(403)
def mistake403(code):
    return f'Error 403 There is a mistake in your url! '


@app.error(404)
def error404(error):
    return 'Erro 404 Nothing here, sorry'


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-i',
        dest="ip",
        required=False,
        metavar="",
        default="0.0.0.0",
        help="-i <ip> (Default 0.0.0.0")
    parser.add_argument(
        '-p',
        dest="port",
        required=False,
        metavar="",
        default="80",
        help="-p <port> (Default 80")
    parser.add_argument(
        '-r',
        dest="root",
        required=False,
        metavar="",
        default=".",
        help="-r <root> (Default . ")
    parser.add_argument(
        '-d',
        dest="debug",
        required=False,
        metavar="",
        default="0",
        help="-d 0/1 (Default 0 ")
    args = parser.parse_args()
    ip = args.ip
    port = int(args.port)
    ROOT_PATH = args.root
    print(f"{ip} {port} {ROOT_PATH}")
    if args.debug=='1':
        app.run(host=ip, port=port, debug=True, quiet=False,reload=True)
        #app.run(host=ip, port=port, server="cheroot")
        #server = Server(bind_addr=("0.0.0.0", port), wsgi_app=app)
        # try:
        #      server.start()
        # finally:
        #      server.stop()
        #      sys.exit()
    else:
        print("Hit Ctrl-C to quit.")
        app.run(host=ip, port=port, debug=False, quiet=True)
else:
        application = app
