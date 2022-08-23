const jwt =require('jsonwebtoken')

const db = require('./db')


// accounts = {
//     1000:{accno:1000,accname:"Max",accpwrd:1000,accbal:5000,transaction:[]},
//     1001:{accno:1001,accname:"Maxwell",accpwrd:1001,accbal:6000,transaction:[]},
//     1002:{accno:1002,accname:"Alan",accpwrd:1002,accbal:4000,transaction:[]}
    
//   }

//Register
const register = (accno,accname,accpwrd)=>{

    //asynchronous
    return db.Account.findOne({accno}).then(account =>{
      if(account){
        return {
          statusCode:401,
          status:false,
          message:"User Already Exist Please log in"
        }
      }else{
          const newAcc =new db.Account({
            accno,
            accname,
            accpwrd,
            accbal:2000,
            transaction:[]
          })
          newAcc.save()
          return {
            statusCode:200,
            status:true,
            message:"Registered Successfully"
          }
        }
      }
    )}


  const login = (accno, accpwrd)=> {

  return db.Account.findOne({accno,accpwrd}).then(account=>{
    if (account) {
      var currentUserName = account['accname']
      var currentUserID = accno
      //token generation
      const token = jwt.sign({
        currentUserID: accno
      }, "nuravnavedusav")
      return {
        statusCode: 200,
        status: true,
        message: "Login Successfull",
        token,
        currentUserName,
        currentUserID
      }
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Incorrect UserID or Password"
      }
    }
  })
}


  const deposit = (accnum,accamt)=>{
    return db.Account.findOne({accno:accnum}).then(account=>{
      if(account){
        account['accbal']+=Number(accamt)
        account['transaction'].push({
          type:"Credit",
          amount:accamt
        })
        account.save()
        return {
          statusCode:200,
          status:true,
          message:`${accamt} Deposited successfully balance ${account['accbal']}`
      }
      }else{
        return {
          statusCode: 401,
          status: false,
          message: "Incorrect UserID or Password"
        }
      }
    })
  }


  const widraw = (accnum,accamt)=>{
    return db.Account.findOne({accno:accnum}).then(account=>{
      if(account){
        if(account['accbal']>accamt){
          account['accbal']-=Number(accamt)
          account['transaction'].push({
            type:"Debit",
            amount:accamt
          })
          account.save()
          return {
            statusCode:200,
            status:true,
            message: `${accamt} Widrawed successfully`+` new balance ${account['accbal']}`
          }
        }else{
          return {
            statusCode:401,
            status:false,
            message:"Insufficient Balance"
          }
        }
      }else{
        return {
          statusCode: 401,
          status: false,
          message: "Incorrect UserID or Password"
        }
      }
    })
  }

  const getTrans = (accnum)=>{
    return db.Account.findOne({accno:accnum}).then(account=>{
      if(account){
        return {
          statusCode:200,
          status:true,
          transaction:account['transaction']
        }
      }else{
        return {
          statusCode:401,
          status:false,
          message:"Account Not Found"
        }
      }
    })
    
  }

  const onDelete = (accno)=>{
    return db.Account.deleteOne({accno})
    .then(result=>{
      if(result){
        return {
          statusCode:200,
          status:true,
          message:"Delete Successfully"
        }
      }else{
        return {
          statusCode:401,
          status:false,
          message:"Account Not Found"
        }
      }
    })
  }
  //export
  module.exports={
    register,
    login,
    deposit,
    widraw,
    getTrans,
    onDelete
  }
