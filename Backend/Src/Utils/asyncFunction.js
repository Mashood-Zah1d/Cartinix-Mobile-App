const asyncFuction =  (fuctionHandler) => {
   return  (req,res,next) => {
        Promise.resolve (fuctionHandler(req,res,next))
        .catch(err=>next(err))
    }
}

export {asyncFuction}