if(process.env.NODE_ENV==="production"){
    module.exports = require('./prod')
}
else{
    module.exports = require('./dev')
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI2MjQ3OTZhM2FiODhmMDY2MTk2MWIiLCJpYXQiOjE2NTYxOTAwNDF9.OKE9uZfiWpfnG6j8CU5yPNeXeD9AbFVFJ4DrUyw_nC8