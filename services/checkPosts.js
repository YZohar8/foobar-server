import connectToBloomFilterServerFun from "../connectToBloomFilterServer.js";

const checkPostText = async (postText) => {
    const urls = await urlsFromText(postText);
    let result = await connectToBloomFilterServerFun.checkUrlsToBloomFilter(urls);
    return result;
    
}

const urlsFromText = async (text) => {
    const urlPattern = /\b(?:https?:\/\/|www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?\b/g;
    const urls = text.match(urlPattern); 
    
    return urls || [];
};

const checkPost = {
    checkPostText
}

export default checkPost;