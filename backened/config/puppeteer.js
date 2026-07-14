import puppeteer, { defaultArgs } from "puppeteer"

let browserInstance = null



export const getBrowser = async () => {
    if (browserInstance && browserInstance.connected) {
        return browserInstance
    }
    browserInstance = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // avoids /dev/shm running out of space in containers
            "--disable-gpu",
        ]
    })

    browserInstance.on("disconnected",()=>{
        browserInstance = null
    })
    return browserInstance
}



export const closeBrowser = async () => { 
    if(browserInstance){
        await browserInstance.close();
        browserInstance = null
    }
}