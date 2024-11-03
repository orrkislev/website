export function useFileManager() {
    const getFile = async (projectName, fileName) => {
        const baseUrl = 'https://raw.githubusercontent.com/orrkislev/stuff-I-made-for-you/main/'
        let url = baseUrl + `${projectName}/${fileName}`
        if (projectName.length == 0) url = baseUrl + `${fileName}`
        if (projectName.includes('-test') && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'))
            url = `http://127.0.0.1:5500/${projectName.replace('-test', '')}/${fileName}`
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

export async function getFromFirebase(projectName, fileName) {
    const url = `https://storage.googleapis.com/creative-coding-site.appspot.com/${projectName}/${fileName}`
    return fetch(url).then(res => res.text())
}

export function getGithubUrl(projectName, fileName) {
    return `https://cdn.jsdelivr.net/gh/orrkislev/stuff-I-made-for-you/${projectName}/${fileName}`
}