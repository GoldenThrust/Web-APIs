self.addEventListener((e)=>{
    if (e.tag === "message") {
        e.waitUntil(sendMessages())
    }
})