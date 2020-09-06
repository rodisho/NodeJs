const fs = require('fs');
const http = require('http');
const url = require('url');


////////////////////////////////////////////
////////// FILES ////////////////////////
// Blocking Synchronous
// const { CLIENT_RENEG_WINDOW } = require('tls');
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn)
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}.`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("File has been written!")

// NON_Blocking Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8' , (err, data1)=> {
//     if(err) return console.log("ERROR")
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8' , (err, data2)=> {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8' , (err, data3)=> {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err=> {
//                     console.log("File has been written")
//             })
//         })
//     })
// })


////////////////////////////////////////////
////////// SERVER  /////////////////////////
    const replaceTemplate = (temp, product) => {
        let output = temp.replace(/{%PRODUCTNAME%}/g, product.productNamde);
        output = output.replace(/{%IMAGE%}/g, product.image)
        output = output.replace(/{%PRICE%}/g, product.price)
        output = output.replace(/{%FROM%}/g, product.from)
        output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
        output = output.replace(/{%QUANTITY%}/g, product.quantity)
        output = output.replace(/{%DESCRIPTION%}/g, product.description)
        output = output.replace(/{%ID%}/g, product.id)

        if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
        return output;
}

const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data) 



const server = http.createServer((req, res) => {
    const {query , pathname} = url.parse(req.url, true)

    // Overview page
    if(pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {'Content-type': 'text/html'})
        const cardsHtml = dataObject.map(el => replaceTemplate(templateCard,el)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        // console.log("CARDSHTML ", cardsHtml)
        // res.end(templateOverview)

        res.end(output)

    // Product page
    } else if( pathname === "/product"){
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObject[query.id];
        const output = replaceTemplate(templateProduct, product)

        res.end(output)

    // API
    } else if(pathname === "/api") {

        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    }

    // NOT FOUND 
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end("<h1>This page not found!</h1>")
    }
})

server.listen(8000, '127.0.0.1', ()=> {
    console.log("Listening to request on port 8000")
})




