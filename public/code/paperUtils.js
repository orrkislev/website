//SNIPPET rebuildByMaxSegmentLength
function rebuildByMaxSegmentLength(path, maxSegmentLength = 10) {
    const newSegments = []
    for (let i = 0; i < path.segments.length; i++) {
        newSegments.push(path.segments[i].point)

        const offset1 = path.segments[i].location.offset
        const offset2 = path.segments[(i + 1) % path.segments.length].location.offset
        const diff = abs(offset2-offset1)
        const numSegmentsToAdd = Math.floor(diff.length / maxSegmentLength) + 1
        for (let j = 1; j < numSegmentsToAdd; j++) {
            const newOffset = lerp(offset1, offset2, j / numSegmentsToAdd)
            const newPoint = path.getPointAt(newOffset % path.length)
            newSegments.push(newPoint)
        }
    }
    path.removeSegments()
    path.addSegments(newSegments)
    path.smooth()
    return path
}

//SNIPPET drawPath
function drawPath(path, fillColor = false, strokeColor = false) {
    if (fillColor) fill(fillColor)
    if (strokeColor) stroke(strokeColor)
    beginShape()
    for (let i = 0; i < path.length; i++) {
        const pos = path.getPointAt(i)
        vertex(pos.x, pos.y)
    }
    if (path.closed) endShape(CLOSE)
    else endShape()
}