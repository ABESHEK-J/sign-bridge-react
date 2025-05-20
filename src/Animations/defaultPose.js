// src/Animations/defaultPose.js

export const defaultPose = (ref) => {
  // Safety check to make sure ref is properly initialized
  if (!ref || !ref.animations) {
      console.warn("defaultPose: Missing required ref properties");
      return;
  }
  
  if (Array.isArray(ref.characters)) {
      ref.characters.push(' ');
  }
  
  let animations = [];
  
  animations.push(["mixamorigNeck", "rotation", "x", Math.PI/12, "+"]);
  animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/3, "-"]);
  animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/1.5, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/1.5, "+"]);
  
  ref.animations.push(animations);

  // Don't call ref.animate directly anymore
  if (ref.pending === false) {
      ref.pending = true;
      // The animation will be handled by the animation loop in the component
  }
};
