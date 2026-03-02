const mongoose= require("mongoose");
const bcrypt= require("bcryptjs")
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating account"],
        unique:[true],
        trim:true,
        lowercase:true,
         match: [
      /^\S+@\S+\.\S+$/, // The email regex pattern
      'Please enter a valid email address.' // Custom error message if the pattern fails
    ]
},
name:{
    type:String,
    required:[true,"name is required for creating an account "]
},

password:{
    type:String,
    required:[true,"paswword is required for creating account"],
    minlength:[6,"password must be more than 6 characters"],
    select:false  //db me koi querry user pr run krenge to saath me password nhi aaega b tk hm explicitely na bole password ko 
},
systemUser:{
    type:Boolean,

    default:false, 
    immutable:true,
    select:false
}
  },  {
        timestamps:true
    },)

    userSchema.pre("save", async function(next){
        if(!this.isModified("password")){
            return 
        }
        else{
            const hash= await bcrypt.hash(this.password, 10)
            this.password = hash; 
              return 
        }


    })


    userSchema.methods.comparePassword=  async function(password){
        return await bcrypt.compare(password, this.password)
    }


    const userModel= mongoose.model('user', userSchema);



    module.exports=userModel;