import json
import datetime
from flask import Flask, request
from flask_cors import CORS


# Operation
app = Flask(__name__)
CORS(app)


# Function
@app.route('/GetEvent_Date')
def getEvent_Date():
	# get parmaeter from input request
	date = request.args.get("date")
	print(date)

	# get current time
	today = datetime.datetime.today()
	hour:	int = today.hour
	minute:	int = today.minute

	# time_string
	time_string: str = f"{hour:02d}:{minute:02d} - {hour:02d}:{minute:02d}"

	# data
	data = [
		["Task 1", time_string, "passed", 	["study", "other"]],
		["Task 2", time_string, "passed", 	["work"]],
		["Task 3", time_string, "passed", 	["work"]],
		["Task 3", time_string, "passed", 	["study"]],
		["Task 3", time_string, "passed", 	["rest"]],
		["Task 3", time_string, "ongoing", 	["study"]],
		["Task 3", time_string, "future", 	["rest"]],
		["Task 3", time_string, "future", 	["work"]]
	]

	# to json
	data = json.dumps(data)

	return data


# Operation
if __name__ == '__main__':
	app.run()
