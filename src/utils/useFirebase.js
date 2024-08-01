export function useFirebase() {
    const getFile = async (projectName, fileName) => {
        const url = `https://storage.googleapis.com/creative-coding-site.appspot.com/${projectName}/${fileName}`
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
        console.log('hash:', hash)
        return hash
    }

    return { getFile, storeFile }
}