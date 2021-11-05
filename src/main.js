const elem = document.getElementById('3d-graph');

const Graph = ForceGraph3D()(elem)
  .jsonUrl('./data.json')
  .nodeAutoColorBy("city")
  .linkWidth('width')
  .nodeThreeObject(node_label)
  // .onNodeClick(node_alert)
  .onNodeClick(node_focus)
  const linkForce = Graph
      .d3Force('link')
      .distance(link => '500');
    Graph.numDimensions(3); // Re-heat simulation
  console.log(Graph.distance)

  function node_label(node){
    const sprite = new SpriteText(node.user);
    sprite.material.depthWrite = false; // make sprite background transparent
    sprite.color = node.color;
    sprite.textHeight = 8;
    return sprite;
  }

  function node_focus(node){
    // Aim at node from outside it
    const distance = 200;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    Graph.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
    node_info(node)
  }

  function node_info(node){
        document.querySelector('#person_name').innerHTML = '<p><a href="http://vk.com/id'+node.id+'" target="_blank">\
    '+node.user+'</a></p> ';
    document.querySelector('#person_id').textContent = 'ID: '+node.id;
    document.querySelector('#person_photo').innerHTML = '<p><img src="'+node.photo+'" alt=""></p>';
    document.querySelector('#person_count').textContent = 'Количество друзей: '+node.count;
    document.querySelector('#person_city').textContent = node['city'].title;

  }
  var FizzyText = function() {
    this.message = '';
    this.explode = function() { 
      console.log(this.message)
     };
  };    
  let text = new FizzyText();
  let gui = new dat.GUI();
  var parameters = {
    message:"",
    spinVelocity: 0
  }
  const addPerson = gui.addFolder('Добавить человека')
  let controllerText = addPerson.add(text, 'message').name('ID: ');
  addPerson.add(text, 'explode').name('Добавить');
  function moveRect(e)
  {
    console.log(e)
    if(e.code == 'KeyQ'){
      Graph.cooldownTime(Infinity)
      .d3AlphaDecay(0)
    // Add collision and bounding box forces
      .d3Force('collide', d3.forceCollide(Graph.nodeRelSize()))
    }
    if(e.code == 'KeyW'){
      Graph.cooldownTime(0) || 
      Graph.cooldownTime(Infinity)
      .d3AlphaDecay(0)
    // Add collision and bounding box forces
      .d3Force('collide', d3.forceCollide(Graph.nodeRelSize()))
    }
  }
  
  addEventListener("keydown", moveRect);

Graph.cooldownTime(Infinity)
  .d3AlphaDecay(0)
// Add collision and bounding box forces
  .d3Force('collide', d3.forceCollide(Graph.nodeRelSize()))

