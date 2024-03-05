import * as THREE from 'three';
import React, {useState, useEffect, useRef} from 'react';
import { useDropzone } from 'react-dropzone';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export default function Upload({printJob, updateFile}) {
    const [uploaded, setUploaded] = useState((printJob.file !== null));
    
    const onDrop = (files) => {
      updateFile(files[0])
      setUploaded(true)
    };

    const onCancel = () => {
      updateFile(null)
      setUploaded(false)
    }
    
    /* 
     * Setup ThreeJS Scene
     */
    const containerRef = useRef(null);
    const [sceneState, setScene] = useState(null);

    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    // Create lighting
    // Grey ambient
    // Grey spotlight with large intensity to cover even large objects
    const light = new THREE.AmbientLight(0xf0f0f0, 0.2);
    const spotlight = new THREE.SpotLight(0xf0f0f0);
    spotlight.position.set(40, 40, 40);
    spotlight.intensity = 3000;
    scene.add(light);
    scene.add(spotlight);

    // Create standard perspective camera
    const camera = new THREE.PerspectiveCamera(
      75,
      1.0,
      0.1,
      1000
    );
    camera.position.z = -10;

    // Create render and set background to a very light grey
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xdddddd, 1.0);
    
    // "Arcball" style controls with smoothed movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Now the STL loading logic
    const loader = new STLLoader();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x888888,
    });

    /* Create ThreeJS container 
    * Build the logic for rendering chosen STL
    */
    useEffect(() => {
      if (sceneState === null) {
        if (printJob.file !== null) {
          addFileToScene(printJob.file);
        }
        return;
      }

      if (containerRef.current !== null && sceneState.children.length > 3) {
        // Init the renderer object
        // Add the dom object the the containerRef so we can add it via react
        renderer.setSize(800, 600);
        camera.aspect = 800 / 600;
        camera.updateProjectionMatrix();

        window.addEventListener('resize', onWindowResize, false);
        resize3DViewer();

        containerRef.current.appendChild(renderer.domElement);
        draw();
        return () => {
          window.removeEventListener('resize', onWindowResize, false);
          if (containerRef.current !== null && containerRef.current.hasChildNodes()) {
            containerRef.current.removeChild(renderer.domElement);
            updateFile(null);
          }
        }
      }
    }, [sceneState]);
    
    function draw() {
      controls.update();  
      renderer.render(sceneState, camera);

      window.requestAnimationFrame(draw);
    }

    function removeSTL() {
      while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
      }
      setScene(scene);
    }

    function resize3DViewer() {
      let canvasdiv = document.getElementById("canvas-rect").getBoundingClientRect();
      renderer.setSize(canvasdiv.width, canvasdiv.height);
      camera.aspect = canvasdiv.width / canvasdiv.height;
      camera.updateProjectionMatrix();
    }

    function onWindowResize() {
      if (printJob.file !== null) {
        resize3DViewer();
      }
    }

    function addFileToScene(file) {
      loader.load(
        URL.createObjectURL(file),
        function (geometry) {
          scene.add(new THREE.Mesh(geometry, material));
          setScene(scene);
        },
        (xhr) => { /* do nothing */ },
        (error) => {console.log(error);}
      );
    }

    /* 
     * Setup DropZone
     */
    const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
      accept: {
        'model/stl': ['.stl'],
      },
      noClick: true,
      noKeyboard: true,
      maxFiles: 1,
      onDrop: acceptedFiles => {
        updateFile(acceptedFiles[0]);
        addFileToScene(acceptedFiles[0]);
      }
    });

    return (
        <>
          {
             printJob.file === null ?
              <div className="flex flex-col h-full">
                <p className="text-4xl font-bold mt-3">Upload an STL file</p>
                <div className="flex flex-col mt-4 grow">
                  <div {...getRootProps()} className="h-full border-dashed border-2 border-gray-400 p-4 flex text-center justify-center items-center rounded" style={{backgroundColor: "#f7f7f7"}}>
                    <input {...getInputProps()} />
                    <div className="text-3xl">
                      <p>Drag and drop<br/>or</p>
                      <span onClick={open} className="text-3xl text-blue-500 cursor-pointer underline">Browse files</span>
                    </div>
                  </div>
                </div>
              </div>
            :
              <div className="flex flex-col h-full">
                <div className="flex w-full items-center mt-3 justify-between">
                    <p className="text-4xl font-bold">Selected: {printJob.file.name}</p>
                    <p onClick={() => removeSTL()} className="text-4xl text-blue-500 cursor-pointer underline">Change File</p>
                </div>
                <div className="flex flex-col items-center justify-center full-without-title mt-4 grow" id="canvas-rect">
                  <div className="rounded" ref={containerRef}></div>
                </div>
              </div>
          }
        </>
    );
}