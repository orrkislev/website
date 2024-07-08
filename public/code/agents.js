//SETTINGS
{"title":true, 
"libraries":["p5"]}
//SETTINGSEND

//EXPLANATION

this sketch creates a number of agents that move around the canvas.
if two agents get too close to each other, they will push each other away.
the agents also bounce off the walls of the canvas.

this behavior makes the agents to move around the canvas and eventually spread evenly across it.

try changing the total_agents variable to see how the number of agents affects the behavior.

//EXPLANATIONEND

//FILE main.js

//COMMENTS

// an agent has a position (pos, a vector), a direction (dir, a vector), and a color
// the agents are stored in an array called agents

// additional_behavior(agent) is called for each agent in the draw function
// use this function to add any additional behavior to the agent

//CODE

total_agents = 250
avoid_distance = 30
border = 25

function additional_behavior(agent){
}


//FILE sketch.js

//COMMENTS

// the function createAgent() creates a new agent and adds it to the agents array
// the function updateAgent(agent) updates the agent's position based on its direction
// the function drawAgent(agent) draws the agent as a circle
// the function avoid(a1,a2) pushes a1 away from a2 if they are too close

// in the setup function, create a canvas and create total_agents agents
// in the draw function, clear the background, call additional_behavior for each agent, update each agent, and draw each agent

//CODE

function setup() {
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES)
  
  for (i=0;i<total_agents;i++) createAgent()
}


function draw() {
  background('beige');
  
  agents.forEach(additional_behavior)
  agents.forEach(updateAgent)
  
  for (let i=0;i<agents.length-1;i++){
    for (let j=i+1;j<agents.length;j++){
      avoid(agents[i],agents[j]) 
    }
  }
  
  agents.forEach(drawAgent)
}


//FILE agents.js

//CODE
agents = []
function createAgent(){
  x = width * random(.4,.6)
  y = height * random(.4,.6)
  a = random(360)
  agent = {
    pos:createVector(x,y),
    dir:p5.Vector.fromAngle(a).mult(2),
    color:random(['gray','orange'])
  }
  agents.push(agent)
}

function avoid(a1,a2){
  // if the distance between a1 and a2 is less than avoid_distance,
  // push a1 away from a2, and push a2 away from a1
  d = a1.pos.dist(a2.pos)
  if (d < avoid_distance){
    force = p5.Vector.sub(a2.pos,a1.pos).normalize()
    forceStrength = map(d,0,30,1,0)
    force.mult(forceStrength)
    a1.dir.sub(force)
    a2.dir.add(force)
    stroke(a1.color)
    line(a1.pos.x,a1.pos.y,a2.pos.x,a2.pos.y)
  }
}

function updateAgent(agent){
  // slow down over time, like friction
  agent.dir.mult(0.97)
  // move
  agent.pos.add(agent.dir)

  // bounce off walls
  if (agent.pos.x > width-border || agent.pos.x < border) {
    agent.dir.mult(-1,1)
    agent.pos.x = constrain(agent.pos.x, border+1, width-border-1)
  }
  if (agent.pos.y > height-border || agent.pos.y < border) {
    agent.dir.mult(1,-1)
    agent.pos.y = constrain(agent.pos.y, border+1, height-border-1)
  }
}


function drawAgent(agent){
  // draw a circle in the agent's color, no outline
  fill(agent.color)
  noStroke()
  circle(agent.pos.x,agent.pos.y, 10)
}