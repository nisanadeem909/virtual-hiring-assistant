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

const adminSchema = new Schema({
  
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


}, {
  timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);



const recruiterSchema = new Schema({
  companyname:{
    type: String,
    required: true,
  },
  companyID:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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

const companySchema = new Schema({
  companyname:{
    type: String,
    required: true,
  },
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
  profilePic: {
    type: String
  }
  ,
  status: {
    type: Number,
   
  }
  ,

}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);


const companyRequestSchema = new Schema({
  companyname:{
    type: String,
    required: true,
  },
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
  },

}, {
  timestamps: true,
});

const CompanyRequest = mongoose.model('CompanyRequest', companyRequestSchema);

const jobApplicationSchema = new Schema({
  email: {
    type: String,
    required: true,
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
  formlinkstatus: {
    type: Number,
    required: true,
    default:0

  }
  ,
  rejectionstatus: {
    type: Number,
    required: true,
    default:0
  }
  ,

}, {
  timestamps: true,
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);



const jobSchema = new Schema({

  companyname:{
    type: String,
    required: true,
  },
  companyID:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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
  P2FormDeadline: {
    type: Date
  },
  rejectEmailSub: {
    type: String,
  }
  ,
  rejectEmailBody: {
    type: String,
  }
  ,
  formEmailSub: {
    type: String,
  }
  ,
  formEmailBody: {
    type: String,
  }
  ,
  noShortlisted:{
    type: Boolean,
    default: false,
  }

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
    required: true,
    unique: true
  }
  ,
  formDeadline: {
    type: Date
  }
  ,
  questions:[{
    _id: { //Added by Nabeeha
      type: mongoose.Schema.Types.ObjectId,
      
    },
    answer: Number,
    options: [String],
    question: String,
    
  }]

}, {
  timestamps: true,
});

const Form = mongoose.model('Form', formSchema);





const notificationSchema = new Schema({
  companyname:{
    type: String,
    required: true,
  },
  companyID:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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
  notifType: {
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

//Added by Nabeeha
const formResponses = new Schema({
  applicantEmail: {
    type: String,
  }
  ,
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  answers:[{
    // questionID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: mongoose.Types.ObjectId
    // },
    question: String,
    answerStatement: String
  }], 
  status:{ //NEWW! Added by Nabeeha
    type: String,
    default: 'In process'
  }
 
  

}, {
  timestamps: true,
});

const FormResponses = mongoose.model('FormResponses', formResponses);

module.exports ={
  Recruiter,
  JobApplication,
  Job,
  Form,
  Notification,
  FormResponses,
  Company,
  Admin,
  CompanyRequest
};