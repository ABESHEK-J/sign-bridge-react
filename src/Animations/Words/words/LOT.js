export const LOT = (ref) => {
    // Always add the sign name to characters array
    ref.characters.push('LOT');
    
    let animations = []

    // First animation sequence - setup
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", -0.968898421176607, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0.12722187353951142, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -0.5568728858267886, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -0.5878644100208448, "-"]);

    animations.push(["mixamorigRightHandThumb1", "rotation", "x", -0.8603034297287528, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0.06109783125181131, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0.2989085484337516, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -0.4951493488397374, "-"]);

    ref.animations.push(animations);

    // Second animation sequence - main action
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -0.9852736678028815, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", 1.0770902911674514, "-"]);
    
    // Add some variation based on the sign name
    animations.push(["mixamorigHead", "rotation", "x", 0.0667290819320801, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0.32965355616042125, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", -0.15199030478523848, "-"]);

    ref.animations.push(animations);
    
    // Third animation sequence - return to neutral
    animations = []
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);

    animations.push(["mixamorigRightHandThumb1", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);

    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/1.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/1.5, "+"]);
    
    animations.push(["mixamorigHead", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);

    ref.animations.push(animations);

    if(ref.pending === false){
        ref.pending = true;
        ref.animate();
    }
}