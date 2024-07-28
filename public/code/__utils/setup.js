//SNIPPET initP5
function initP5(show = false, webgl = false, ratio) {
    if (ratio) {
        if (windowWidth < windowHeight * ratio) {
            p5Canvas = createCanvas(windowWidth, windowWidth / ratio, webgl ? WEBGL : null)
        } else {
            p5Canvas = createCanvas(windowHeight * ratio, windowHeight, webgl ? WEBGL : null)
        }
    } else {
        p5Canvas = createCanvas(windowWidth, windowHeight, webgl ? 'webgl' : 'p2d');
    }
    ctx = drawingContext
    PS = width / 500
    noiseSeed(round(random(1000)))
    angleMode(DEGREES)
    if (!show) p5Canvas.elt.style.display = 'none'
    V = createVector
}

//SNIPPET initPaper
function initPaper(show = false) {
    paperCanvas = document.createElement('canvas');
    paperCanvas.width = width || windowWidth;
    paperCanvas.height = height || windowHeight
    width = width || windowWidth
    height = height || windowHeight
    paper.setup(paperCanvas);
    document.querySelector('main').appendChild(paperCanvas);
    paperCanvas.style.display = 'block';
    if (!show) paperCanvas.style.display = 'none';
    window.Path = paper.Path,
        window.Circle = paper.Path.Circle,
        window.Rectangle = paper.Path.Rectangle,
        window.Point = paper.Point,
        window.Color = paper.Color,
        window.Group = paper.Group,
        window.CompoundPath = paper.CompoundPath,
        window.Segment = paper.Segment,
        window.Size = paper.Size

    p = (x, y) => new paper.Point(x, y)

    randomPoint = (s=1) => new Point(random(-1, 1), random(-1, 1)).normalize(s)
    pointFromAngle = (angle,s=1) => new Point(1, 0).rotate(angle).multiply(s)
    positiveAngle = (angle) => angle > 0 ? angle : angle + 360
    pointLerp = (p1, p2, t) => p(lerp(p1.x, p2.x, t), lerp(p1.y, p2.y, t))
}

//SNIPPET initMatter
function initMatter() {
    window.Engine = Matter.Engine,
        window.Render = Matter.Render,
        window.Runner = Matter.Runner,
        window.Bodies = Matter.Bodies,
        window.Body = Matter.Body,
        window.Composite = Matter.Composite,
        window.Constraint = Matter.Constraint,
        window.Query = Matter.Query
    window.Events = Matter.Events

    engine = Engine.create();
    engine.gravity.y = 0
    world = engine.world
    engineRunner = window.Runner.run(engine);
}