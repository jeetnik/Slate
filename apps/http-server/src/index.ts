import express from "express";
import db from "@repo/db/client"
import {CreateRoomSchema, JWT_CODE, SignSchema, UserSchema} from "@repo/common/types"
import jwt from "jsonwebtoken";
import cors from "cors";
import auth from "./middleware"
import bcrypt from "bcrypt"
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(cors({

}));
app.use(express.json());


//user signUp code 
app.post('/signup',async(req,res)=>{

    const parseData=UserSchema.safeParse(req.body);

    if(!parseData.success){
res.status(401).json({
    msg:"Invalid Credentials"
})
return
    }

    const {name,password,email,photo} =parseData.data;

    try{
const hashedPassword= await bcrypt.hash(password,10);

await db.user.create({
    data:{
        email,
        password:hashedPassword,
        name,
        photo
    }
})
res.status(200).json({
    msg:"User create succefully"
})

    }catch(e){

        res.status(500).json({
            msg:"User already exist"
        })

    }
})


app.post('/sigin',async (req,res)=>{
const parseData=SignSchema.safeParse(req.body);
if(!parseData.success){
    res.status(401).json({
        msg:"Invalid Credentials"

    })
    return
}
const email=parseData.data.email;
const password=parseData.data.password;

try{
    const user= await db.user.findFirst({where:{email}});
    
    if(!user){
        res.status(501).json({
            msg:"Incorrect Credentials"
        })
        return
    }
    const ispasswordvalid=await bcrypt.compare(password,user.password);
    if(!ispasswordvalid){
        res.status(401).json({
            "msg":"Incorrect Password"})
            return;
   
    }
const token=jwt.sign({id:user.id},JWT_CODE,{expiresIn:"1d"});

res.status(200).json({
    token
})

}catch(e){
    console.log(e);
        res.status(500).json({
            message:"server error"
        })

}})
app.use(auth)
app.post('/create-room',async (req,res)=>{

    const parseData=CreateRoomSchema.safeParse(req.body);
    if(!parseData.success){
        res.status(401).json({
            msg:"Invalid Credentials "
            
        })
        return
    }
    const userId=req.userId;
    if(!userId){
        res.status(401).json({
         msg: "Unauthorized"
        })
        return
    }
const Slugname=parseData.data.name

try{
    const room = await db.room.create({
        data:{
        
            slug: Slugname,
            adminId: userId,
            users: {
                create: [{ userId }]  
            }
        }
    })
    res.status(200).json({
        message:"room created successfully",
        roomId:room.id

    })

}catch(e){
    res.status(401).json({
        message: "room creation failed"
    });
    return;


}
})




app.get('/room/:roomId',async (req,res)=>{
    const roomId=(req.params.roomId);
    if(!roomId||roomId==""){
        res.status(401).json({
msg:"Room Doesnt exists"})
return    }


try{
    const room =await db.room.findFirst({
        where:{id:roomId}
    })
    if(!room){
        res.status(404).json({message:"Room doesnt exist"});
        return;
    }
    res.status(200).json({message:"RoomExist"});
}catch(e){
console.log(e)
}



})



app.listen(3000,()=>{
    console.log("server is running on Port 3000");
})