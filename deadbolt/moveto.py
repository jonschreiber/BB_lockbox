import servo
import time
import sys

def moveto (degrees):
	#number of servos to dance
	n = 1

	#center all servos
	servo.move(1, 90)
	time.sleep(0.5)

	print 'Moving to', degrees, 'degrees'

	# perform 9 iterations, 10deg increments
	i = 9
	while i >= 9:
	    wait  = 9 * 0.025 # wait time - large deflections need more

	    # move left
	    servoPosition = int(degrees)
	    # command Arduino
	    s=0
	    while s <= n:
	      servo.move(s, servoPosition)
	      time.sleep(wait)
	      s += 1
	    time.sleep(wait)

	    i -= 1