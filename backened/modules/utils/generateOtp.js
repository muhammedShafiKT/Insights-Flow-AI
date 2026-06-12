const generateOtp = ()=>{
     return Math.floor(
        100000 + Math.random()*90000
     ).toString()
    }

    export default generateOtp