from flask import Flask, render_template, Response, jsonify
import cv2
import mediapipe as mp
from types_of_exercise import TypeOfExercise
from utils import score_table
import time
import threading
import random

app = Flask(__name__)

# MediaPipe setup
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Global exercise parameters
exercise_type = "squat"  # default type
counter = 0
status = True

# Contest parameters
contest_duration = 90  # 180 seconds
contest_start_time = None
contest_active = False
contest_ended = False
participant_count = random.randint(15, 25)  # Simulated participant count

# Session management
last_heartbeat = None
heart_beat_timeout = 10  # seconds
cleanup_timer = None

# Video source (0 = webcam) - Initialize as None, will be created when needed
cap = None

def start_contest():
    global contest_start_time, contest_active, contest_ended, counter
    contest_start_time = time.time()
    contest_active = True
    contest_ended = False
    counter = 0  # Reset counter for new contest
    
    # Timer thread to end contest after duration
    def end_contest_timer():
        time.sleep(contest_duration)
        end_contest()
    
    timer_thread = threading.Thread(target=end_contest_timer)
    timer_thread.daemon = True
    timer_thread.start()

def end_contest():
    global contest_active, contest_ended, cap, cleanup_timer
    contest_active = False
    contest_ended = True
    # Release camera when contest ends
    if cap is not None:
        cap.release()
        cap = None
    # Cancel cleanup timer if it exists
    if cleanup_timer is not None:
        cleanup_timer.cancel()
        cleanup_timer = None

def cleanup_session():
    """Called when browser/tab is closed or becomes inactive"""
    global last_heartbeat, cleanup_timer
    print("Session cleanup triggered - browser/tab likely closed")
    end_contest()
    # Reset for next session
    last_heartbeat = None
    
def schedule_cleanup():
    """Schedule cleanup if no heartbeat received"""
    global cleanup_timer
    if cleanup_timer is not None:
        cleanup_timer.cancel()
    
    def check_heartbeat():
        global last_heartbeat
        if last_heartbeat is not None:
            elapsed = time.time() - last_heartbeat
            if elapsed > heart_beat_timeout:
                cleanup_session()
    
    cleanup_timer = threading.Timer(heart_beat_timeout + 1, check_heartbeat)
    cleanup_timer.daemon = True
    cleanup_timer.start()

def get_time_remaining():
    if not contest_active or contest_start_time is None:
        return 0
    elapsed = time.time() - contest_start_time
    remaining = max(0, contest_duration - elapsed)
    return int(remaining)

# Contest will start when user accesses the website

def gen_frames():
    global counter, status, contest_active, cap, last_heartbeat
    
    # Initialize camera only when video feed is requested
    if cap is None:
        cap = cv2.VideoCapture(0)
        cap.set(3, 800)
        cap.set(4, 480)
        print("Camera initialized - new session started")
    
    # Update heartbeat when video feed is active
    last_heartbeat = time.time()
    schedule_cleanup()
    
    with mp_pose.Pose(min_detection_confidence=0.5,
                      min_tracking_confidence=0.5) as pose:
        while True:
            success, frame = cap.read()
            if not success or contest_ended:
                break

            frame = cv2.resize(frame, (800, 480))
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame.flags.writeable = False

            results = pose.process(frame)

            frame.flags.writeable = True
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

            try:
                if contest_active:
                    landmarks = results.pose_landmarks.landmark
                    counter, status = TypeOfExercise(landmarks).calculate_exercise(
                        exercise_type, counter, status)
            except:
                pass

            frame = score_table(exercise_type, frame, counter, status)

            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(174, 139, 45), thickness=2, circle_radius=2),
            )

            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    global last_heartbeat, contest_active, contest_ended
    # Start new session when someone visits the website
    last_heartbeat = time.time()
    
    # If contest is not active or has ended, start a new one
    if not contest_active or contest_ended:
        start_contest()
        print("New contest started for new session")
    
    schedule_cleanup()
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/stats')
def stats():
    global counter, participant_count, last_heartbeat
    # Update heartbeat when stats are requested (indicates active session)
    last_heartbeat = time.time()
    schedule_cleanup()
    
    return jsonify({
        'counter': counter,
        'participants': participant_count,
        'time_remaining': get_time_remaining(),
        'contest_active': contest_active,
        'contest_ended': contest_ended
    })

@app.route('/heartbeat', methods=['POST'])
def heartbeat():
    """Endpoint to keep session alive"""
    global last_heartbeat
    last_heartbeat = time.time()
    schedule_cleanup()
    return jsonify({'status': 'alive'})

@app.route('/start_contest', methods=['POST'])
def start_new_contest():
    global last_heartbeat
    # Reset session tracking
    last_heartbeat = time.time()
    start_contest()
    schedule_cleanup()
    return jsonify({'success': True, 'message': 'Contest started!'})

@app.route('/contest_results')
def contest_results():
    # Simulate other participants' scores
    other_scores = [random.randint(5, 25) for _ in range(participant_count - 1)]
    other_scores.append(counter)  # Add user's score
    other_scores.sort(reverse=True)
    
    user_rank = other_scores.index(counter) + 1
    
    return jsonify({
        'user_score': counter,
        'user_rank': user_rank,
        'total_participants': participant_count,
        'top_scores': other_scores[:5]  # Top 5 scores
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)