import { initializeApp } from "firebase/app"
import { getStorage, ref, getDownloadURL } from "firebase/storage"

export function useFileManager() {
    const getFile = async (projectName, fileName) => {
        let url = `https://cdn.jsdelivr.net/gh/orrkislev/stuff-I-made-for-you/${projectName}/${fileName}`
        if (projectName.length == 0) url = `https://cdn.jsdelivr.net/gh/orrkislev/stuff-I-made-for-you/${fileName}`
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
    const app = initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: "creative-coding-site.firebaseapp.com",
        projectId: "creative-coding-site",
        storageBucket: "creative-coding-site.appspot.com",
        messagingSenderId: "1065803835010",
        appId: "1:1065803835010:web:a59e01e8846767766b769b",
        measurementId: "G-4TBZDMD106"
    })
    const storage = getStorage(app)

    const docRef = ref(storage, `${projectName}/${fileName}`)
    const url = await getDownloadURL(docRef)
    return fetch(url).then(res => res.text())
}

export function getGithubUrl(projectName, fileName) {
    return `https://cdn.jsdelivr.net/gh/orrkislev/stuff-I-made-for-you/${projectName}/${fileName}`
}