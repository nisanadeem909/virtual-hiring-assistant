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
    model = loadModel()
    jd_phrases = extractJDPhrases(job['jobDescription'])
    acceptableScore = job['AccCVScore'].to_decimal()
    all_apps = list(jobapp_collection.find({'jobID': job['_id']}))
    
    if not all_apps:
        # notification_data = {
        #     "jobTitle": job['jobTitle'],
        #     "jobID": job['_id'],
        #     "notifText": "CV deadline has passed but no applications!",
        #     "recruiterUsername": job['postedby'],
        #     "notifType": 1,
        #     "createdAt": datetime.now().astimezone(pytz.utc)
        # }
        # notification_collection.insert_one(notification_data)
        return
    
    for app in all_apps:
        filename = app['CVPath']
        resumepath = './routes/resumes/' + filename
        resume = extractCV(resumepath)
        if not resume:
            similarity = 0
        else:
            cv_phrases = extractCVPhrases(resume)
            similarity = matchCVJD(model,cv_phrases,jd_phrases)
            
        filter_criteria = {'_id': app['_id']}
        update_statement = {
            '$set': {
                'CVMatchScore': similarity,
                'status': 2 if similarity >= acceptableScore else 0
            }
        }
        jobapp_collection.update_one(filter_criteria, update_statement)
    
    filter_criteria = {'_id': job['_id']}
    update_statement = {
        '$set': {
            'status': 2
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

def FormScreening(job):
    print(job['jobTitle'])
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
        #print(job)
        if job.get('P2FormDeadline'):
            if job['status'] == 2 and current_datetime >= job['P2FormDeadline']:
                FormScreening(job)
        

while True:
    CVtimer()
    Formtimer()
    time.sleep(300)  
    
if __name__ == '__main__':
    app.run(debug=True) 


