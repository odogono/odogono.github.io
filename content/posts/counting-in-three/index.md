+++
title = 'Counting in Three'
date = 2024-10-07T18:40:31+01:00
draft = false
weather = '14°C Partly Cloudy'
location = '50.79°N, 3.65°W'
tags = ['threejs', 'react', 'typescript', 'shaders']
+++

## Introduction

{{< image-cropped src="img/final.jpg" 
  alt="Strips of digits, all in a row" 
  process="crop" 
  width="640" 
  height="400"
  allowOpen=false
>}}

[This tutorial](https://www.youtube.com/watch?v=Rv91NdVtnsw) on creating an animated counter in react native is neat. I would very much like to have that for my score display in the little game I’m currently side-project’ing.

Because you can use html on top of react-three-fiber just fine, the temptation is to go the easy route and use the DOM, but what would be the fun in that.

So instead, I chose to bring this into the land of [Three](https://threejs.org).


## First attempt

{{< image-cropped src="img/digitstrips.png" alt="Strips of digits, all in a row" process="fill" width="640" height="200" >}}

First stab at the implementation was pretty simple. A bunch of plane geometries, each with their own UVs, grouped together into a strip, textured, and clipped (more on that later).

Animation of the digits came courtesy of [react-spring](https://www.react-spring.dev/), which made it embarrassingly easy to move the digit strips once the value changed.


```typescript
export const DigitStrip: React.FC<DigitStripProps> = ({ position, value }) => {
  const groupRef = useRef<Group>(null);
  const digits = Array.from({ length: 10 }, (_, i) => i);

  const digitPositions = useMemo(() => digits.map((index) => new Vector3(0, -index * 1, 0)), [digits])

  // Create a spring animation for the y position
  const { y } = useSpring({
    y: value,
    config: { mass: 1, tension: 180, friction: 12 }
  });

  return (
    <animated.group
      ref={groupRef}
      position-x={position.x}
      position-y={y}
      position-z={position.z}
    >
      {digits.map((digit, index) => (
        <Digit key={index} value={digit} position={digitPositions[index]} />
      ))}
    </animated.group>
  )
}
```

But I can do better. And by better I mean simpler. And by simpler I mean a little more difficult.

## Enter instances and shaders.

The principle behind instances is that instead of rendering lots of planes, each no doubt with its own geometry, we give the GPU a chance to flex by telling it to render lots of copies of the same thing.

There is a catch of course - individual UVs are not assignable to Instances.

This is where the shader comes in. In essence we give this single shader material to all the instances along with an index to the number we want to render, and it does the work of altering the UVs as it goes.

The trick is being able to pass values into the shader, using an InstancedAttribute.


```typescript
<DigitInstances limit={count}>
    <InstancedAttribute name="aIndex" defaultValue={0} />
    ...

    vertexShader: `
      attribute float aIndex;
    ...

<Digit key={i} position={[0, -i * 1, 0]} aIndex={i} />
```

Once it has an idea of where to go (index) within the number strip (count), it was fairly trivial.

I must admit, the shader uv assignment doesn’t quite sit right in my head. The previous code is what I am more familiar with - each plane has 4 uvs, and the coord calculation is straight forward:


```typescript
const uvs = geometry.attributes.uv as BufferAttribute
      
const totalSegments = 10;
const segmentIndex = value;
const segmentHeight = 1 / totalSegments;
const vTop = 1 - (segmentIndex * segmentHeight);
const vBottom = vTop - segmentHeight;
const newUvs = new Float32Array([
  0, vTop,    // top-left
  1, vTop,    // top-right
  0, vBottom, // bottom-left
  1, vBottom  // bottom-right
]);

uvs.set(newUvs)
uvs.needsUpdate = true;
```

But with the shader, it’s a single assignment. And given the vertex shader is visiting every vertex, it feels like something should be missing.


```typescript
void main() {
  #include <begin_vertex>

  vUv = uv;
  vUv.y = (vUv.y + uCount - aIndex - 1.0) / uCount;
  
  #include <project_vertex>
}
```

An additional thing to get used to was I wasn’t getting the nice image transparency for free anymore. My first (claude suggested) attempt simply discarded pixels if their alpha was below a certain amount, resulting in haaaaarsh lines.
Of course there was an answer, and that answer was to use an inbuilt function called smoothstep.



## Clipping Planes - the horror

Clipping planes are like an invisible curtain which you can draw over certain parts of your geometry to hide them. In HTML it’s something like using the overflow property.

In Three, there is a concept of local and global clipping planes. Global planes affect all entities in the scene, whereas local planes only affect the entity they are attached to.

In the first iteration when I was just using regular planes to render, clipping planes worked fine. Although at this point I hadn't started moving or scaling the counter.

But shaders don’t naturally have an idea of what a clipping plane is, so we have to add some includes so they are handled correctly.


{{< highlight go "linenos=table,hl_lines=6 15" >}}
vertexShader: `
  uniform float uCount;
  attribute float aIndex;
  varying vec2 vUv;

  #include <clipping_planes_pars_vertex>

  void main() {
    #include <begin_vertex>

    vUv = uv;
    vUv.y = (vUv.y + uCount - aIndex - 1.0) / uCount;
    
    #include <project_vertex>
    #include <clipping_planes_vertex>
  }
{{< / highlight >}}



The next issue came when trying to move or scale the counter within the world - the clipping planes get left behind!

The reason for this is that they are a concept tied to the shader material, so they have to be manually moved when the parent geometry is moved.

What I ended up doing was reading the world position of the Counter group, and then passing the Y value into each of the DigitStrips so they could update their clipping planes accordingly.


The code lives [here](https://github.com/odogono/r3f-counter) if that is of interest.


<iframe src="https://codesandbox.io/embed/zp7x95?view=preview&module=%2Fsrc%2Findex.tsx&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="r3f-counter-test"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts">
</iframe>


## Thoughts and directions

Overall the result is perfectly charming. Although it would be nicer if the movement from 9 to 0 was [a movement upward](https://www.youtube.com/watch?v=vyejpfe72rA) instead of whizzing back down to 0. This could be achieved by having another digit strip above.

Now in practice, my hack at updating the clipping plane is fine, because I intend the counter to live pretty much statically on the screen. However, I would like to have the counter grow in size when the score increments. A reasonable tactic is to use the onChange event in react-spring to update the clip planes.

There is a sense that I could probably go further with the shader, and have it render everything. After all, [literal worlds](https://www.shadertoy.com) are possible with just a quad and some insane math.

I also have the feeling I should be using SDF’s rather than a texture image.

This probably counts as my first serious foray into shaders. Again, without AI assistance, I might have stumbled.  Even with, and sometimes especially because of, AI assistance I did hit a few walls. But good old educated guesses and throwing random characters at the screen triumphed again.