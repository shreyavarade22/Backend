//API
const usermodal =require('./modal')

const adduser = async (req, res) => {
const { SrNo, FullName, Email, Mobile,Gender } = req.body

try { 
      const data =new usermodal({ 
       SrNo, FullName, Email, Mobile,Gender
    })
     await data.save()
     res.send({ message: 'User added successfully' })
    }
catch (error) {

res.status(400).send({ error: error.message })
   }
}

const getuser = async (req,res) => {
  try{
    const data = await usermodal.find()
    res.status(200).send({data})
  }
  catch (error){
    res.status(400).send({error:error.message})
  }
}

const updateuser = async(req,res) => {
  const{name,email,password}= req.body
  try{
    const data = await usermodal.updateOne(
      {_id:req.params._id},
      {$set :{name,email,password}}
    );
    if(data.modifiedCount>0){
      res.status(200).send({message:"user update successfully"})
    }
    else{
      res.status(400).send({message:"user not found"})
    }
  }
  catch(error){
   console.log(error);
  res.status(400).send({error:error.message})

  }
  }



const deleteuser = async (req,res) =>{
  try{
    
    const data = await usermodal.deleteOne({_id:req.params._id})
     
    if (data.deletedcount>0)
     {
      res.status(200).send({message : "user deleted successfully"})
     }
     else
     {
      res.status(404).send({message : "user not found and not deleted successfully"})
     }
  }

  catch(error)
  {
    console.error(error);
    res.status(400).send({error:error.message})
  }
}


module.exports= {adduser,getuser,deleteuser,updateuser}