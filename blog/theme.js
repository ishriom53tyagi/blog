const getDb = require('../utils/database').getDb

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.getBlog = async function ( req , res ) {

    try {

        const searchBlogValue = req.params.query ;

        const db = getDb()

        const isBlogExist = await db.collection('blog').find({ blog_description_key : searchBlogValue }).toArray();

        if(! ( isBlogExist?.length ) ) {

            return res.send('notFound');

        }

        const dom = new JSDOM(isBlogExist[0].content);

        let obj = {
            name : dom.window.document.documentElement.outerHTML
        }

        return res.render('index' , obj);

    }
    catch ( error ) {

        console.log(error );
        res.send({
            status : false ,
            error : error?.message || "Unable to proceed your request please try again later"
        })

    }
}



module.exports.setBlog = async function ( req , res ) {

    try {   

        const db = getDb()

        const blogDescriptionKey = req.body.descriptionKey;

        if(! blogDescriptionKey ) {
            throw new Error("No description key found!")
        }
        const isBlogDescriptionKeyAlreadyExist = await db.collection('blog').find({ blog_description_key : blogDescriptionKey }).toArray();

        if( isBlogDescriptionKeyAlreadyExist.length ) {

            return res.send({
                status : false ,
                message : "Key Already Exist"
            })

        }

        const data = {
            blog_description_key : blogDescriptionKey,
            description : req.body.description ,
            content : req.body.content,
            created : Date.now(),
            modified : Date.now()
        }

        const _ = await db.collection('blog').insertOne( data );

        return res.send({
            status : true ,
            message : "updated Successfully!"
        })

    }
    catch ( error ) {

        console.log(error);
        return res.send({
            status : false ,
            message : error?.message ? error.message : "Error while inserting Blog!"
        })

    }
}