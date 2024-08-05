export function useFileManager() {
    const getFile = async (projectName, fileName) => {
        let url = `https://cdn.jsdelivr.net/gh/orrkislev/stuff-I-made-for-you/${projectName}/${fileName}`
        // let url = `https://storage.googleapis.com/creative-coding-site.appspot.com/${projectName}/${fileName}`
        // if (projectName == 'test' && !process.env.NODE_ENV || process.env.NODE_ENV === 'development')
            // url = `./code/test/${fileName}`
        const res = await fetch(url)
        if (fileName.endsWith('.json')) return await res.json()
        else return await res.text()
    }

    const storeFile = async (projectName, content) => {
        const url = `https://us-central1-creative-coding-site.cloudfunctions.net/storeCode`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ directory: projectName, code: content })
        })
        const hash = await res.text()
        return hash
    }

    return { getFile, storeFile }
}