#!/bin/bash
uwsgi --http :8080 --wsgi-file prodigiserver.py --master --processes 4 --threads 2


