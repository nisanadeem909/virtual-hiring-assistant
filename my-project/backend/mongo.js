const { Double, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://nisanadeem90:mbxoMyyW674AtFy6@cluster0.43kxzvt.mongodb.net/";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to database");
}
).catch((err) => {
    console.log(err);
});

const Schema = mongoose.Schema;


const recruiterSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
  ,
  name: {
    type: String,
    required: true,
    minlength: 6
  }
  ,
  designation: {
    type: String,
    required: true,
    minlength: 6
  }
  ,
  profilePic: {
    type: String
  }
  ,

}, {
  timestamps: true,
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);



const jobApplicationSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  }
  ,
  name: {
    type: String,
    required: true,
    minlength: 6
  }
  ,
  status: {
    type: Number,
    required: true,
    default: 1
  }
  ,
  selectionStatus: {
    type: Boolean
  }
  ,
  CVPath: {
    type: String,
    required: true
  }
  ,
  CVMatchScore: {
    type: Decimal128,
    required: true
  }
  ,
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  ,


}, {
  timestamps: true,
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);



const jobSchema = new Schema({
  jobTitle: {
    type: String,
    required: true
  }
  ,
  jobDescription: {
    type: String,
    required: true
  }
  ,
  CVDeadline: {
    type: Date,
    required: true
  }
  ,
  AccCVScore: {
    type: Decimal128,
    required: true
  }
  ,
  status: {
    type: Number,
    required: true,
    default: 1
  }
  ,
  postedby: {
    type: String,
    required: true
  },
  CVFormLink: {
    type: String
  },
  P2FormLink: {
    type: String
  },

}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

const formSchema = new Schema({
  jobTitle: {
    type: String,
    required: true
  }
  ,
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
  ,
  formDeadline: {
    type: Date
  }
  ,
  questions:[{
    answer: Number,
    options: [String],
    question: String
  }],

}, {
  timestamps: true,
});

const Form = mongoose.model('Form', formSchema);





const notificationSchema = new Schema({
  jobTitle: {
    type: String
  }
  ,
  notifText: {
    type: String,
    required: true
  }
  ,
  recruiterUsername: {
    type: String,
    required: true
  }
  ,
  jobStatus: {
    type: Number
  }
  ,
  jobID: {
    type: mongoose.Schema.Types.ObjectId
  }
  ,

}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports ={
  Recruiter,
  JobApplication,
  Job,
  Form
};