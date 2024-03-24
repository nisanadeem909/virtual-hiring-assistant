# app.py
from flask import Flask, jsonify
from pymongo import MongoClient
import pdfplumber
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from numpy.linalg import norm
import pandas as pd
import numpy as np
import re 
import spacy
from spacy.lang.en import English
from sklearn.metrics.pairwise import cosine_similarity
import time
from datetime import datetime
from threading import Thread
from bson import Decimal128
import pytz
import requests
import smtplib
import ssl
import schedule
import os
from moviepy.editor import VideoFileClip
from pathlib import Path
import time
import parselmouth as pm
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from joblib import load

app = Flask(__name__)

mongo_uri = 'mongodb+srv://nisanadeem90:mbxoMyyW674AtFy6@cluster0.43kxzvt.mongodb.net/'

client = MongoClient(mongo_uri)
db = client.test  
notification_collection = db['notifications']
jobapp_collection = db['jobapplications']  
job_collection = db['jobs'] 
companyreq_collection = db['companyrequests']  ###KOMAL ADDED
tech_test_collection = db['techtests']
videos_collection = db['videos'] #Nisa added

try:
    _ = db.jobs.find_one()
    print("Connected to MongoDB!")
except Exception as e:
    print("Failed to connect to MongoDB:", e)

def extractCV(path):
    resume = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            resume += page.extract_text()
    print(resume)
    return resume

def cleanResume(resumeText):
    resumeText = re.sub('http\S+\s*', ' ', resumeText)  # remove URLs
    resumeText = re.sub('RT|cc', ' ', resumeText)  # remove RT and cc
    resumeText = re.sub('#\S+', '', resumeText)  # remove hashtags
    resumeText = re.sub('@\S+', '  ', resumeText)  # remove mentions
    resumeText = re.sub('[%s]' % re.escape("""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', resumeText)  # remove punctuations
    resumeText = re.sub(r'[^\x00-\x7f]',r' ', resumeText) #removes non-printable characters
    resumeText = re.sub('\s+', ' ', resumeText)  # remove extra whitespace
    # Remove numerical values from the text
    resumeText = re.sub(r'\d+', '', resumeText)

    return resumeText.lower()

def match_majors_by_spacy(doc):            
        nlp = English()
        patterns_path = "./dictionaries/majors.jsonl"
        ruler = nlp.add_pipe("entity_ruler")
        ruler.from_disk(patterns_path)
        
        acceptable_majors_list = []
        
       
        doc1 = nlp(doc)
        acceptable_majors = []
        for ent in doc1.ents:
                labels_parts = ent.label_.split('|')
                if labels_parts[0] == 'MAJOR':
                    if labels_parts[2].replace('-', ' ') not in acceptable_majors:
                        acceptable_majors.append(labels_parts[2].replace('-', ' '))
                    if labels_parts[2].replace('-', ' ') not in acceptable_majors:
                        acceptable_majors.append(labels_parts[2].replace('-', ' '))
        if acceptable_majors:
            acceptable_majors_list.append(', '.join(acceptable_majors))
        
        return acceptable_majors_list
    
def match_degrees_by_spacy(doc):
        nlp = English()
        patterns_path = "./dictionaries/degrees.jsonl"
        ruler = nlp.add_pipe("entity_ruler")
        ruler.from_disk(patterns_path)
        acceptable_degrees_list = []
        
        
        doc1 = nlp(doc)
        degree_levels = [] 
        for ent in doc1.ents:
                labels_parts = ent.label_.split('|')
                if labels_parts[0] == 'DEGREE':
                    if labels_parts[1] not in degree_levels:
                        degree_levels.append(labels_parts[1])
        if degree_levels:
                acceptable_degrees_list.append(', '.join(degree_levels))

        return acceptable_degrees_list

def match_skills_by_spacy(doc):
        nlp = English()
        patterns_path = "./dictionaries/skills.jsonl"
        ruler = nlp.add_pipe("entity_ruler")
        ruler.from_disk(patterns_path)
        acceptable_skills_list = []
        
        
        doc1 = nlp(doc)
        job_skills = []
        for ent in doc1.ents:
                labels_parts = ent.label_.split('|')
                if labels_parts[0] == 'SKILL':
                    if labels_parts[1].replace('-', ' ') not in job_skills:
                        job_skills.append(labels_parts[1].replace('-', ' '))
        if job_skills:
                acceptable_skills_list.append(', '.join(job_skills))

        return acceptable_skills_list
        
def extractCVPhrases(resume):
    cv_majors = match_majors_by_spacy(cleanResume(resume))
    cv_degrees = match_degrees_by_spacy(cleanResume(resume))
    cv_skills = match_skills_by_spacy(cleanResume(resume))

    cv_majors = [major.strip() for majors in cv_majors for major in majors.split(',')]
    cv_skills = [major.strip() for majors in cv_skills for major in majors.split(',')]
    cv_degrees = [major.strip() for majors in cv_degrees for major in majors.split(',')]
    
    cv_all = cv_majors + cv_degrees + cv_skills

    cv_all = list(set(cv_all))
    
    print(cv_all)
    return cv_all

def extractJDPhrases(jd):
    jd_majors = match_majors_by_spacy(cleanResume(jd))
    jd_degrees = match_degrees_by_spacy(cleanResume(jd))
    jd_skills = match_skills_by_spacy(cleanResume(jd))

    jd_majors = [major.strip() for majors in jd_majors for major in majors.split(',')]
    jd_skills = [major.strip() for majors in jd_skills for major in majors.split(',')]
    jd_degrees = [major.strip() for majors in jd_degrees for major in majors.split(',')]

    jd_all = jd_majors + jd_degrees + jd_skills
    jd_all = list(set(jd_all))
    
    print(jd_all)
    return jd_all

def loadModel():
    model = Doc2Vec.load('./model/cv_job_maching.model')
    return model

def matchCVJD(model,cv_all,jd_all):
    v1 = []
    v2 = []

    for element in cv_all:
        v1.append(model.infer_vector(element.split()))

    for element in jd_all:
        v2.append(model.infer_vector(element.split()))
        
    similarity = 0
    i = 0
    tot = 0
    if v1 != []:
        for element in v2:
            if jd_all[i] in cv_all:
                similarity = similarity + 1
                tot = tot + 1
            else:
                max = -1
                for cv_item in v1:
                    newsimilarity = (np.dot(np.array(cv_item), np.array(element))) / (norm(np.array(cv_item)) * norm(np.array(element))) # cosine similarity
                    if newsimilarity > max:
                        max = newsimilarity
                #print(max)
                if max >= 0.3:
                    similarity = similarity + max
                    tot = tot + 1
            # print(similarity)
            #print(jd_all[i])
            i=i+1
            
        if tot < len(jd_all)/2:
            tot = len(jd_all)
        
        similarity = round(similarity/tot*100,3)
        print(similarity)
        return similarity

def CVScreening(job):
    print(job['jobTitle'])
    
    if job.get('noShortlisted'): #already screened but no cv could be shortlisted
        if job['noShortlisted'] == True:
            return
    
    if job.get('shortlistedCVWaiting'): #already shortlisted but not fully automated so waiting for recruiter
        if job['shortlistedCVWaiting'] == True:
            return
    
    model = loadModel()
    jd_phrases = extractJDPhrases(job['jobDescription']) #extracts skills,degrees,majors using spacy 
    acceptableScore = job['AccCVScore'].to_decimal()
    all_apps = list(jobapp_collection.find({'jobID': job['_id']}))
    
    if not all_apps:
        filter_criteria = {'_id': job['_id']}
        update_statement = {
            '$set': {
                'noShortlisted': True
            }
        }
        job_collection.update_one(filter_criteria, update_statement)
        
        notification_data = {
            "jobTitle": job['jobTitle'],
            "jobID": job['_id'],
            "companyname":job['companyname'],
            "companyID":job['companyID'],
            "notifText": "CV deadline has passed but no applications! Please edit deadline/required percentage to continue..",
            "recruiterUsername": job['postedby'],
            "notifType": 1,
            "createdAt": datetime.now().astimezone(pytz.utc)
        }
        notification_collection.insert_one(notification_data)
        return
    
    shortlistCount = 0
    
    for app in all_apps:
        filename = app['CVPath']
        resumepath = './routes/resumes/' + filename
        resume = extractCV(resumepath) # parses cv pdf
        if not resume:
            similarity = 0
        else:
            cv_phrases = extractCVPhrases(resume) # extracts skills,degrees,majors using spacy 
            similarity = matchCVJD(model,cv_phrases,jd_phrases)
        
        print(similarity)
            
        if similarity >= acceptableScore:
            shortlistCount = shortlistCount +1
            
        filter_criteria = {'_id': app['_id']}
        if job['automated'] == True:
            update_statement = {
                '$set': {
                    'CVMatchScore': similarity,
                    'status': 2 if similarity >= acceptableScore else 0
                }
            }
            jobapp_collection.update_one(filter_criteria, update_statement)
        else:
            update_statement = {
                '$set': {
                    'CVMatchScore': similarity
                }
            }
            result = jobapp_collection.update_one(filter_criteria, update_statement)
            print(result.modified_count)
            print(similarity)
        
        
    print(shortlistCount)
        
    if shortlistCount == 0:
        filter_criteria = {'_id': job['_id']}
        update_statement = {
            '$set': {
                'noShortlisted': True
            }
        }
        job_collection.update_one(filter_criteria, update_statement)
        
        notification_data = {
            "jobTitle": job['jobTitle'],
            "jobID": job['_id'],
            "companyname":job['companyname'],
            "companyID":job['companyID'],
            "notifText": "No applications could be shortlisted! Please edit deadline/required percentage to continue..",
            "recruiterUsername": job['postedby'],
            "notifType": 1,
            "createdAt": datetime.now().astimezone(pytz.utc)
        }
        notification_collection.insert_one(notification_data)
        return
    
    #print("no")
    
    if job['automated'] == True:
        filter_criteria = {'_id': job['_id']}
        update_statement = {
            '$set': {
                'status': 2,
                'noShortlisted': False
            }
        }
        job_collection.update_one(filter_criteria, update_statement)
        sendCVRejectionEmails()
    else:
        filter_criteria = {'_id': job['_id']}
        update_statement = {
            '$set': {
                'noShortlisted': False,
                'shortlistedCVWaiting': True
            }
        }
        job_collection.update_one(filter_criteria, update_statement)
        
    notification_data = {
            "jobTitle": job['jobTitle'],
            "jobID": job['_id'],
            "notifText": "CVs have been shortlisted!",
            "recruiterUsername": job['postedby'],
            "notifType": 1,
            "companyname":job['companyname'],
            "companyID":job['companyID'],
            "createdAt": datetime.now().astimezone(pytz.utc)
        }
    notification_collection.insert_one(notification_data)
    
#########################################
def sendFormEmails():
    # Find shortlisted applications (status 2 and formlinkstatus 0)
    print("in form emails")
    response = requests.get('http://localhost:8000/nisa/getApplicationsByStatus/2')

    if response.status_code == 200:
        shortlisted_applications = response.json()

        for applicant in shortlisted_applications:
            job_id = applicant.get('jobID', '')
            
            # Check if there is an email, form link, and formlinkstatus is 0
            if job_id:
                # Fetch form email body and subject based on job ID
                form_email_response = requests.get(f'http://localhost:8000/nisa/getFormEmail/{job_id}')
                form_email_data = form_email_response.json()

                form_email_body = form_email_data.get('formEmailBody', '')
                form_email_subject = form_email_data.get('formEmailSub', '')

                # Check formlinkstatus and send the email
                if form_email_body and form_email_subject and applicant.get('formlinkstatus', 0) == 0:
                    # Send the email
                    send_form_email(applicant, form_email_subject, form_email_body)
                    applicant_id = str(applicant['_id'])
                    response = requests.put(f'http://localhost:8000/nisa/update_formlinkstatus/{applicant_id}')

                    if response.status_code == 200:
                        print(f"formlinkstatus updated successfully for {applicant['email']}")
                    else:
                        print(f"Failed to update formlinkstatus for {applicant['email']}")

                    print(f"Form email sent to {applicant['email']} for job ID {job_id}")
                else:
                    print(f"Form link not available or already sent for {applicant['email']}")



def send_form_email(applicant, subject, body):
    port = 587  # For starttls
    smtp_server = "smtp.gmail.com"
    sender_email = "virtualhiringassistant04@gmail.com"
    app_password = "glke rmyu xnfa yozn"

    receiver_email = applicant['email']
    name = applicant.get('name', '')
    body = f"Dear {name},\n\n{body}\n\nRegards,\nManafa Technologies"

    message = f"Subject: {subject}\n\n{body}"

    context = ssl.create_default_context()

    with smtplib.SMTP(smtp_server, port) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, receiver_email, message)


     

def send_rejection_email(applicant, rejection_email_body):
    port = 587  # For starttls
    smtp_server = "smtp.gmail.com"
    sender_email = "virtualhiringassistant04@gmail.com"
    app_password = "glke rmyu xnfa yozn"

    receiver_email = applicant['email']
    subject = "Regarding the Application for position at Manafa Technologies"
    body = f"Dear {applicant['name']},\n\n{rejection_email_body}\n\nRegards,\nManafa Technologies"

    message = f"Subject: {subject}\n\n{body}"

    context = ssl.create_default_context()

    with smtplib.SMTP(smtp_server, port) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, receiver_email, message)

def sendCVRejectionEmails():
    response = requests.post('http://localhost:8000/nisa/findrejected')

    if response.status_code == 200:
        applicants = response.json()

        for applicant in applicants:
            rejectionStatus = applicant.get('rejectionstatus')

            
            if rejectionStatus == 0:
                jobId = applicant.get('jobID', '')
                cvscore = applicant.get('CVMatchScore', {}).get('$numberDecimal', '')
                if cvscore:  # Use the correct variable name here
                    cvscode = float(cvscore)


                rejection_email_body_response = requests.get(f'http://localhost:8000/nisa/getRejectionEmailBody/{jobId}')
                rejection_email_body = rejection_email_body_response.json().get('rejectionEmailBody', '')

                rejection_email_body += f"\nUnfortunately, you did not meet the required criteria for this position.\n \nWe wish you the best in your job search and future endeavors."


                # Send rejection email
                send_rejection_email(applicant, rejection_email_body)

                # Update rejectionStatus to 1
                applicant_id = applicant.get('_id', '')
                update_status_response = requests.patch(f'http://localhost:8000/nisa/updateRejectionStatus/{applicant_id}')
                
                if update_status_response.status_code == 200:
                    print(f"Rejection email sent to {applicant['email']} and rejection status updated.")
                else:
                    print(f"Rejection email sent to {applicant['email']} but failed to update rejection status.")
            else:
                print(f"Rejection email already sent to {applicant['email']}")


def sendFormRejectionEmails():
    response = requests.post('http://localhost:8000/nisa/findrejectedform')

    if response.status_code == 200:
        applicants = response.json()

        for applicant in applicants:
            # Check if rejection status is 0
            if applicant.get('rejectionstatus', 0) == 0:
                jobId = applicant.get('jobID', '')
                applicantId = applicant.get('_id', '')
               
                
                rejection_email_body_response = requests.get(f'http://localhost:8000/nisa/getRejectionEmailBody/{jobId}')
                rejection_email_body = rejection_email_body_response.json().get('rejectionEmailBody', '')

                rejection_email_body += f"\nUnfortunately, your form response did not meet the required criteria for this position.\nWe wish you the best in your job search and future endeavors."

                send_rejection_email(applicant, rejection_email_body)
                
                
                update_response = requests.patch(f'http://localhost:8000/nisa/updateRejectionStatus/{applicantId}')
                if update_response.status_code == 200:
                    print(f"Rejection email sent to {applicant['email']} and status updated.")
                else:
                    print(f"Failed to update rejection status for {applicant['email']}.")
            else:
                print(f"Rejection email already sent to {applicant['email']}.")


            
def FormScreening(job):
    print("in form screening")
    print(job['jobTitle'])
    
    if job.get('noShortlisted'):
        print(job['noShortlisted'])
        if job['noShortlisted'] == True:
            return
    
    response = requests.post('http://localhost:8000/nabeeha/shortlistformresponses', {'jobId': job['_id']})
    print(response.json())
    
    if response.status_code == 200:        
        
        filter_criteria = {'_id': job['_id']}
        update_statement = {
            '$set': {
            'status': 3
            }
        }
        job_collection.update_one(filter_criteria, update_statement)
        sendFormRejectionEmails()
        
        notification_data = {
            "jobTitle": job['jobTitle'],
            "jobID": job['_id'],
            "companyname":job['companyname'],
            "companyID":job['companyID'],
            "notifText": "Phase 2 Forms have been shortlisted!",
            "recruiterUsername": job['postedby'],
            "notifType": 2,
            "createdAt": datetime.now().astimezone(pytz.utc)
        }
        notification_collection.insert_one(notification_data)
        
########################### KOMAL ADDED ######################################

def send_company_email(company):
    port = 587  # For starttls
    smtp_server = "smtp.gmail.com"
    sender_email = "virtualhiringassistant04@gmail.com"
    app_password = "glke rmyu xnfa yozn"

    receiver_email = company['email']
    subject = ""
    body = ""
    
    if company['status'] == 1:
        subject = "Company Registered for VHA"
        body = f"Dear {company['companyname']},\n\nThis is to inform you that your company has been registered for VHA with the username: {company['username']} and password: {company['password']}. You are advised to change your password.\n\nWelcome to VHA!\n\nRegards,\nTeam Virtual Hiring Assistant"
        print("Sending approval email to "+company['email'])
    else:
        subject = "Company Registration Request Disapproved for VHA"
        body = f"Dear {company['companyname']},\n\nWe appreciate your interest in Virtual Hiring Assistant. After careful consideration, we regret to inform you that your company registration request has unfortunately been disapproved.\n\nThank you for considering VHA.\n\nRegards,\nTeam Virtual Hiring Assistant"
        print("Sending disapproval email to "+company['email'])
    
    message = f"Subject: {subject}\n\n{body}"
    

    context = ssl.create_default_context()

    with smtplib.SMTP(smtp_server, port) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, receiver_email, message)
        
def sendCompanyEmails():
    print("sending company emails")
    reqs = list(companyreq_collection.find({'status': {'$ne': 0}}))
    if not reqs:
        print("no pending emails")
    else:
        for companyreq in reqs:
            send_company_email(companyreq)
            companyreq_collection.delete_one({'_id': companyreq['_id']})

def process_emails():
    port = 587  # For starttls
    smtp_server = "smtp.gmail.com"
    sender_email = "virtualhiringassistant04@gmail.com"
    app_password = "glke rmyu xnfa yozn"
    
    # Fetch all tech tests from the database with email status 0
    tech_tests = list(tech_test_collection.find({'emailStatus': False}))
   
    for tech_test in tech_tests:
        job_id = tech_test.get('jobID')

        # Check if there is a video for the same job ID
        video = videos_collection.find_one({'jobID': job_id})

        if video:
            # Extract email body, email subject, email, and name from the tech test
            email_body = tech_test.get('emailBody')
            email_subject = tech_test.get('emailSubject')
            applications = list(jobapp_collection.find({'jobID': job_id}))

            # Iterate through each application and extract email, name, and password
            for application in applications:
                email = application.get('email')
                name = application.get('name')
                password = application.get('password')

                # Append password to the email body
                email_body_with_password = f"{email_body}\n\nPassword: {password}"
                message = f"Subject: {email_subject}\n\nDear {name},\n\n{email_body_with_password}"
                
                if password:
                    context = ssl.create_default_context()

                    with smtplib.SMTP(smtp_server, port) as server:
                        server.ehlo()
                        server.starttls(context=context)
                        server.ehlo()
                        server.login(sender_email, app_password)
                        server.sendmail(sender_email, email, message)
                    
                    # Update emailStatus to true in the tech test collection
                    tech_test_collection.update_one({'_id': tech_test['_id']}, {'$set': {'emailStatus': True}})
                else:
                    print(f"Password not found for {email}")


##############################################################################
        

def CVtimer():
    print("CV Timer")
    current_datetime = datetime.now(pytz.utc)
    all_jobs = list(job_collection.find({}))
    
    for job in all_jobs:
        if job['status'] == 1 and current_datetime >= job['CVDeadline'].replace(tzinfo=pytz.utc):
            CVScreening(job)
        if job['status'] == 2 and job['automated'] == False:
            sendCVRejectionEmails()

def Formtimer():
    print("Form Timer")
    current_datetime = datetime.now(pytz.utc)
    all_jobs = list(job_collection.find({}))
    
    for job in all_jobs:
        if job.get('P2FormDeadline'):
            if job['status'] == 2 and current_datetime >= job['P2FormDeadline'].replace(tzinfo=pytz.utc):
                FormScreening(job)
                
                
###############################   VIDEO INTERVIEW ########################################

def extract_audio(video_path, audio_output_path):
    try:
        video_clip = VideoFileClip(video_path)
        audio_clip = video_clip.audio
        audio_clip.write_audiofile(audio_output_path)
        print(f"Audio extracted successfully from {video_path}!")
    except Exception as e:
        print(f"Error extracting audio from {video_path}: {e}")
        
audio_Column = ['Video Name', 'Length', 'Average Band Energy', 'Avg Intensity', 'Max Intensity', 'Mean Intensity', 'Range Intensity', 'SD Intensity', 
		   'Avg Pitch', 'Max Pitch', 'Mean Pitch', 'Range Pitch', 'SD Pitch',
		   'Mean F1', 'Mean F2', 'Mean F3', 'Mean B1', 'Mean B2', 'Mean B3', 'SD F1', 'SD F2', 'SD F3', 
		   'Mean F2/F1', 'Mean F3/F1', 'SD F2/F1', 'SD F3/F1']
audio_row = []

def amplitude(sound):
	x_sample = sound.xs()
	amplitude = sound.values[:,0]

	# print('Time: ',x_sample)
	# print('Amplitude: ',amplitude)
	
	# plt.figure()
	# plt.plot(x_sample, amplitude)
	# plt.xlim([sound.xmin, sound.xmax])
	# plt.xlabel("Time [s]")
	# plt.ylabel("Amplitude")

def intensity(sound):
	intensity = sound.to_intensity()
	
	x_sample = intensity.xs()
	y_intensity = intensity.values
	# print('Time: ',x_sample)
	# print('Intensity: ',y_intensity)

	avg_intensity = intensity.get_average(intensity.end_time,intensity.start_time,'ENERGY')
	max_intensity = np.max(y_intensity)
	min_intensity = np.min(y_intensity)
	range_intensity = max_intensity - min_intensity
	sd_intensity = np.std(y_intensity)
	# print(sd_intensity)
	
	# plt.figure()
	# plt.plot(x_sample, y_intensity, linewidth=3, color='w')
	# plt.plot(x_sample, y_intensity, linewidth=1)
	# plt.grid(False)
	# plt.xlim(intensity.start_time,intensity.end_time)
	# plt.xlabel("Time [s]")
	# plt.ylabel("intensity [dB]")
	audio_row.extend([avg_intensity, max_intensity, min_intensity, range_intensity, sd_intensity])

def pitch(sound):
	pitch = sound.to_pitch()
	
	x_sample = pitch.xs()
	y_pitch = pitch.to_matrix().values
	# print('Time: ',x_sample)
	# print('Pitch: ',y_pitch)
	
	y_pitch[y_pitch == 0] = np.nan

	avg_pitch =	np.nanmean(y_pitch)
	max_pitch =	np.nanmax(y_pitch)
	min_pitch =	np.nanmin(y_pitch)
	range_pitch	= max_pitch - min_pitch
	sd_pitch = np.nanstd(y_pitch)
	# print(sd_pitch)

	# plt.figure()
	# plt.plot(x_sample, y_pitch, linewidth=3, color='w')
	# plt.plot(x_sample, y_pitc, linewidth=1)
	# plt.grid(False)
	# plt.xlim(intensity.start_time,intensity.end_time)
	# plt.xlabel("Time [s]")
	# plt.ylabel("Frequency [dB]")
	audio_row.extend([avg_pitch, max_pitch, min_pitch, range_pitch, sd_pitch])


def formant(sound):
	formant = sound.to_formant_burg(max_number_of_formants = 5)
	f1 = []
	b1 = []
	f2 = []
	b2 = []
	f3 = []
	b3 = []

	x_sample = formant.xs()
	# print(x_sample)
	
	# start_time_formant = formant.get_start_time()
	# end_time_formant = formant.get_end_time()
	# time_step_formant = formant.get_time_step()
	# print(len(np.linspace(0.027,end_time_formant,len(formant.xs()))))
	# print(len(np.arange(0.027,end_time_formant,time_step_formant)))
	# print(start_time_formant,end_time_formant,time_step_formant)
	# print('Time: ',x_sample)
	# print(formant.get_value_at_time(1,0.039513))
	# print(formant.get_value_at_time(1,0.03325792))
	# print('Pitch: ',y_formant)

	for x in x_sample:
		f1.append(formant.get_value_at_time(1,x))
		f2.append(formant.get_value_at_time(2,x))
		f3.append(formant.get_value_at_time(3,x))
		b1.append(formant.get_bandwidth_at_time(1,x))
		b2.append(formant.get_bandwidth_at_time(2,x))
		b3.append(formant.get_bandwidth_at_time(3,x))

	mean_f1 = np.mean(f1)
	mean_f2 = np.mean(f2)
	mean_f3 = np.mean(f3)

	mean_b1 = np.mean(b1)
	mean_b2 = np.mean(b2)
	mean_b3 = np.mean(b3)

	sd_f1 = np.std(f1)
	sd_f2 = np.std(f2)
	sd_f3 = np.std(f3)

	mean_f2_by_f1 = np.mean(np.array(f2)/np.array(f1))
	mean_f3_by_f1 = np.mean(np.array(f3)/np.array(f1))
	
	sd_f2_by_f1 = np.std(np.array(f2)/np.array(f1))
	sd_f3_by_f1 = np.std(np.array(f3)/np.array(f1))

	audio_row.extend([mean_f1, mean_f2, mean_f3, mean_b1, mean_b2, mean_b3, sd_f1, sd_f2, sd_f3, 
				mean_f2_by_f1, mean_f3_by_f1, sd_f2_by_f1, sd_f3_by_f1])


def spectrum(sound):
	spectrum = sound.to_spectrum()
	band_energy_spectrum = spectrum.get_band_energy()
	# print(band_energy_spectrum)
	# spectrogram = spectrum.to_spectrogram()
	# drawSpectrogram(sound)
	audio_row.append(band_energy_spectrum)

def drawSpectrogram(sound, dynamic_range=70):

	spectrogram = sound.to_spectrogram(window_length=0.05)
	X, Y = spectrogram.x_grid(), spectrogram.y_grid()
	sg_db = 10 * np.log10(spectrogram.values.T)
	plt.pcolormesh(X, Y, sg_db, vmin=sg_db.max() - dynamic_range, cmap='afmhot')
	plt.ylim([spectrogram.ymin, spectrogram.ymax])
	plt.xlabel("time [s]")
	plt.ylabel("frequency [Hz]")
	
	plt.xlim([sound.xmin, sound.xmax])

def audio_file_analysis(audio_file):
    print("Starting Audio analysis")
    global audio_row 
    audio_row = []
    data = []
    try:
        sound = pm.Sound(audio_file)
        print(f"Analyzing audio file: {audio_file}")
        #audio_row.append(audio_file)
        end_time = sound.get_total_duration()
        audio_row.append(end_time)
        amplitude(sound)
        spectrum(sound)
        intensity(sound)
        pitch(sound)
        formant(sound)
        audio_row = [0 if pd.isna(value) else value for value in audio_row]
        data.append(audio_row)
        print(audio_row)
        return audio_row
    except Exception as e:
        print(f"Error analyzing audio file: {audio_file}")
        print(e)

def loadVideoModels():
    # Dictionary to store loaded SVR models
    models = {}

    # List of target variable names
    target_variables = ['Focused', 'EngagingTone', 'Excited', 'SpeakingRate', 'Calm', 'StructuredAnswers', 'Paused', 'NoFillers', 'Friendly']

    # Load the saved SVR models
    for column in target_variables:
        model = load(f"./model/{column}_model.joblib")
        models[column] = model
        
    return models

# Assuming 'models' contains the trained SVR models for each target variable

def predictVideaTraits(audio_file_path):
    
    scaler = StandardScaler()
    new_input = audio_file_analysis(audio_file_path)
    new_input_scaled = scaler.transform([new_input])
# Make sure 'new_input' is scaled using the same scaler used for training the models
    new_input_scaled = scaler.transform([new_input])  # Assuming 'new_input' is a list of features

    # Dictionary to store predicted values for each target variable
    predicted_values = {}
    
    # Iterate over each target variable and predict its value using the corresponding SVR model
    for column, model in models.items():
        # Predict the value for the current target variable
        predicted_value = model.predict(new_input_scaled)
        # Scale the predicted value
        scaled_value = scale_prediction(predicted_value)
        predicted_values[column] = scaled_value

    # Print the predicted values
    for column, value in predicted_values.items():
        print(f"Predicted {column}: {value}")

# Define the scaling function
def scale_prediction(prediction):
    # Scale from 1-7 to 1-5
    return np.round(((prediction - 1) * (5 - 1) / (7 - 1)) + 1, 2)

def VideoTimer():
    pass
                

schedule.every(1).minutes.do(sendFormEmails)
while True:
    CVtimer()
    Formtimer()
    sendFormEmails()
    sendCompanyEmails() #KOMAL ADDED
    process_emails() #Nisa added
    VideoTimer()
    #schedule.run_pending()
    time.sleep(45)  
    
# if __name__ == '__main__':
#     #app.run(debug=True) 
#     process_emails() #Nisa added
    
    


