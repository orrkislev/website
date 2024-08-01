//SNIPPET makeSVG
svgElement = null
function makeSVG(paths) {
    if (!svgElement) {
        svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svgElement.setAttribute("width", width)
        svgElement.setAttribute("height", height)
        svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`)
        document.body.appendChild(svgElement)   
    }
    while (svgElement.lastChild) svgElement.removeChild(svgElement.lastChild)

    let objs = []
    if (paper && paths[0] instanceof paper.Path) {
        objs = paths.map(path => {
            const poses = []
            for (let i = 0; i < poses.length; i++) poses.push(path.getPointAt(i))
            return poses
        })
    }
    else if (paths[0].points) objs = paths.map(path => path.points)
    else if (paths[0] instanceof Array) objs = paths
    else objs = [paths]

    objs.forEach(points => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute("fill", "none")
        path.setAttribute("stroke", "black")
        path.setAttribute("d", `M${points.map(p => `${p.x},${p.y}`).join("L")}Z`)
        svgElement.appendChild(path)
    })

}
//SNIPPET saveSVG
svgElement = null
function saveSVG() {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = 'coolcool.svg'
    a.href = 'data:image/svg+xml,' + svgElement.outerHTML
    a.click()
    document.body.removeChild(a)
}