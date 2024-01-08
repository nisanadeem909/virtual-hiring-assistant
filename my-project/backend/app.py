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

app = Flask(__name__)

mongo_uri = 'mongodb+srv://nisanadeem90:mbxoMyyW674AtFy6@cluster0.43kxzvt.mongodb.net/'

client = MongoClient(mongo_uri)
db = client.test  
notification_collection = db['notifications']
jobapp_collection = db['jobapplications']  
job_collection = db['jobs']  

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
                    newsimilarity = (np.dot(np.array(cv_item), np.array(element))) / (norm(np.array(cv_item)) * norm(np.array(element)))
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
    
    if job.get('noShortlisted'):
        if job['noShortlisted'] == True:
            return
    
    model = loadModel()
    jd_phrases = extractJDPhrases(job['jobDescription'])
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
        resume = extractCV(resumepath)
        if not resume:
            similarity = 0
        else:
            cv_phrases = extractCVPhrases(resume)
            similarity = matchCVJD(model,cv_phrases,jd_phrases)
            
        if similarity >= acceptableScore:
            shortlistCount = shortlistCount +1
            
        filter_criteria = {'_id': app['_id']}
        update_statement = {
            '$set': {
                'CVMatchScore': similarity,
                'status': 2 if similarity >= acceptableScore else 0
            }
        }
        jobapp_collection.update_one(filter_criteria, update_statement)
        
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
            "notifText": "No applications could be shortlisted! Please edit deadline/required percentage to continue..",
            "recruiterUsername": job['postedby'],
            "notifType": 1,
            "createdAt": datetime.now().astimezone(pytz.utc)
        }
        notification_collection.insert_one(notification_data)
        return
    
    #print("no")
    
    filter_criteria = {'_id': job['_id']}
    update_statement = {
        '$set': {
            'status': 2,
            'noShortlisted': False
        }
    }
    job_collection.update_one(filter_criteria, update_statement)
    
    notification_data = {
        "jobTitle": job['jobTitle'],
        "jobID": job['_id'],
        "notifText": "CVs have been shortlisted!",
        "recruiterUsername": job['postedby'],
        "notifType": 1,
        "createdAt": datetime.now().astimezone(pytz.utc)
    }
    notification_collection.insert_one(notification_data)
    sendCVRejectionEmails()
    
#########################################
def sendFormEmails():
    # Find shortlisted applications (status 2 and formlinkstatus 0)
    print("heree")
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


def check_and_send_form_email(applicant):
    job_id = applicant.get('jobID', '')

    if job_id:
        # Fetch form email body and subject based on job ID
        form_email_response = requests.get(f'http://localhost:8000/nisa/getFormEmail/{job_id}')
        form_email_data = form_email_response.json()

        form_email_body = form_email_data.get('formEmailBody', '')
        form_email_subject = form_email_data.get('formEmailSub', '')

        if form_email_body and form_email_subject:
            send_form_email(applicant, form_email_subject, form_email_body)
            print(f"Form email sent to {applicant['email']} for job ID {job_id}")
        else:
            print(f"Form link not available yet for {applicant['email']}")

 #######################3        

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

            print(rejectionStatus)
            if rejectionStatus == 0:
                jobId = applicant.get('jobID', '')
                rejection_email_body_response = requests.get(f'http://localhost:8000/nisa/getRejectionEmailBody/{jobId}')
                rejection_email_body = rejection_email_body_response.json().get('rejectionEmailBody', '')

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
        
        notification_data = {
            "jobTitle": job['jobTitle'],
            "jobID": job['_id'],
            "notifText": "Phase 2 Forms have been shortlisted!",
            "recruiterUsername": job['postedby'],
            "notifType": 2,
            "createdAt": datetime.now().astimezone(pytz.utc)
        }
        notification_collection.insert_one(notification_data)
        sendFormRejectionEmails()

def CVtimer():
    # response = requests.post('http://localhost:8000/komal/getnotifications')
    # print(response.json())
    #print("hi")
    current_datetime = datetime.now()
    all_jobs = list(job_collection.find({}))
    for job in all_jobs:
        if job['status'] == 1 and current_datetime >= job['CVDeadline']:
            CVScreening(job)
            
def Formtimer():
    print("hi")
    current_datetime = datetime.now()
    all_jobs = list(job_collection.find({}))
    for job in all_jobs:
        if job.get('P2FormDeadline'):
            if job['status'] == 2 and current_datetime >= job['P2FormDeadline']:
                FormScreening(job)
        

#schedule.every(1).minutes.do(sendFormEmails)
while True:
    CVtimer()
    Formtimer()
    sendFormEmails()
    #schedule.run_pending()
    time.sleep(45)  
    
if __name__ == '__main__':
    app.run(debug=True) 
    


