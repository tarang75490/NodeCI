const Page = require('./helpers/page')


let page;

beforeEach(async ()=>{

    page = await Page.build()
    await page.goto('http://localhost:3000')
})

afterEach(async ()=>{
    await page.close()
})



// test('When logged in we see the blog creation form  ',async ()=>{
//     await page.login()
//     await page.click('a.btn-floating')

//     const label = await page.getContentsOf('form label')
//     expect(label).toEqual("Blog Title")
// })

// jest.setTimeout(1030000);


describe("When Logged in",async ()=>{
    beforeEach(async()=>{
        await page.login()
        await page.click('a.btn-floating')
    })
    test('Can see the blog creation form  ',async ()=>{

        const label = await page.getContentsOf('form label')
        expect(label).toEqual("Blog Title")
    })

    describe("And using invalid inputs",async ()=>{
        beforeEach(async()=>{
            await page.click('Button.teal')
        });

        test('the form show an error message',async ()=>{
           const titleError = await page.getContentsOf('.title .red-text')
           const contentError = await page.getContentsOf('.content .red-text')
           expect(titleError).toEqual('You must provide a value')
           expect(contentError).toEqual('You must provide a value')
        })
    })
    describe("And using valid inputs",async ()=>{
        beforeEach(async()=>{
            await page.type(".title input","My Title")
            await page.type(".content input","This is my content")
            await page.click('button.teal')
        });

        test('Submitting takes user to review screen',async ()=>{
            const text = await page.getContentsOf("h5")
            expect(text).toEqual('Please confirm your entries')
        })
        test("Submitting then saving  adds blog to index page", async()=>{
            await page.click('button.green')
            await page.waitFor('.card')
            const cardTitle = await page.getContentsOf('.card-title')
            const content = await page.getContentsOf('p')
            expect(cardTitle).toEqual('My Title')
            expect(content).toEqual('This is my content')
        })
    })

})

// describe('When User is not logged in',async ()=>{
//     test('User cant create the blog post',async ()=>{
//     const result =await page.evaluate(() => {
//             return fetch('/api/blogs',{
//                 method:'POST',
//                 credentials:'same-origin',
//                 headers:{
//                     'Content-Type':"application/json"
//                 },
//                 body: JSON.stringify({title:'My Title' ,content:"My Content"})
//             }).then(res => res.json());
//             });
//         // console.log(result)
//         expect(result).toEqual({ error: 'You must log in!' })
//     });
//     test("User can't get the list of blogs",async ()=>{
//         const result =await page.evaluate(() => {
//             return fetch('/blogs',{
//                 method:'GET',
//                 credentials:'same-origin',
//                 headers:{
//                     'Content-Type':"application/json"
//                 },
//             }).then(res => res.json());
//         });
//             // console.log(result)
//             expect(result).toEqual({ error: 'You must log in!' })
//     })
// })


// jest.setTimeout(300000)