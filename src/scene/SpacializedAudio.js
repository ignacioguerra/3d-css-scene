/**
 * Spacialized audio
 * 
 * @param {Scene} scene - A Scene object
 * @return {Function} - A convenience function for initialisation
 */

export default scene => {
  /**
   * Initialisation function
   * Given a media element creates an audio context to handle updates from the
   * Camera object.
   * @param {Node} mediaElement - An "AUDIO" or "VIDEO" element
   * @return {Void} 
   */
  return mediaElement => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
  
    const audioCtx = new AudioContext();
    const listener = audioCtx.listener;
  
    let posX = scene.camera.position.x*scene.unitValue*0.5;
    let posY = scene.camera.position.y*scene.unitValue*0.5;
    let posZ = scene.camera.position.z*scene.unitValue*0.5;

    if(listener.positionX) {
      listener.positionX.value = posX;
      listener.positionY.value = posY;
      listener.positionZ.value = posZ-5;
    } else {
      listener.setPosition(posX, posY, posZ-5);
    }

    if(listener.forwardX) {
      listener.forwardX.value = Math.sin(scene.camera.position.x);
      listener.forwardY.value = Math.sin(scene.camera.position.y);
      listener.forwardZ.value = Math.sin(scene.camera.position.z);
      listener.upX.value = 0;
      listener.upY.value = 1;
      listener.upZ.value = 0;
    } else {
      listener.setOrientation(Math.sin(scene.camera.position.x), Math.sin(scene.camera.position.y), Math.sin(scene.camera.position.z), 0, 1, 0);
    }

    const pannerModel = 'HRTF';
    const innerCone = 60;
    const outerCone = 90;
    const outerGain = 0.3;

    const distanceModel = 'linear';
    const maxDistance = 10000;
    const refDistance = 1;
    const rollOff = 10;

    const positionX = 0;//box.position.x*scene.unitValue;
    const positionY = 0;//box.position.y*scene.unitValue;
    const positionZ = 0;//box.position.z*scene.unitValue;

    const orientationX = 0;//Math.sin(box.rotation.x);
    const orientationY = 0;//Math.sin(box.rotation.y);
    const orientationZ = -1;//Math.sin(box.rotation.z);

    const panner = new PannerNode(audioCtx, {
      panningModel: pannerModel,
      distanceModel: distanceModel,
      positionX: positionX,
      positionY: positionY,
      positionZ: positionZ,
      orientationX: orientationX,
      orientationY: orientationY,
      orientationZ: orientationZ,
      refDistance: refDistance,
      maxDistance: maxDistance,
      rolloffFactor: rollOff,
      coneInnerAngle: innerCone,
      coneOuterAngle: outerCone,
      coneOuterGain: outerGain
    })

    setInterval(() => {
      posX = scene.camera.position.x*scene.unitValue;
      posY = scene.camera.position.y*scene.unitValue;
      posZ = scene.camera.position.z*scene.unitValue;
    
      if(listener.positionX) {
        listener.positionX.value = posX;
        listener.positionY.value = posY;
        listener.positionZ.value = posZ-5;
      } else {
        listener.setPosition(posX, posY, posZ-5);
      }
      if(listener.forwardX) {
        listener.forwardX.value = Math.sin(scene.camera.position.x);
        listener.forwardY.value = Math.sin(scene.camera.position.y);
        listener.forwardZ.value = Math.sin(scene.camera.position.z);
        listener.upX.value = 0;
        listener.upY.value = 1;
        listener.upZ.value = 0;
      } else {
        listener.setOrientation(Math.sin(scene.camera.position.x), Math.sin(scene.camera.position.y), Math.sin(scene.camera.position.z), 0, 1, 0);
      }
    }, 100)

    const track = audioCtx.createMediaElementSource(mediaElement);
    // const pannerOptions = {pan: 0};
    // const stereoPanner = new StereoPannerNode(audioCtx, pannerOptions);
    track.connect(panner).connect(audioCtx.destination);
    console.info('[3d-css-scene] (info) ::: Audio context connected.')
  }
}
