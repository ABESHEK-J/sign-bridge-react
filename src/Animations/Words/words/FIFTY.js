export const FIFTY = (ref) => {
    // Always add the sign name to characters array
    ref.characters.push('FIFTY');
    
    let animations = []

    // First animation sequence - setup
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", -0.847758787147506, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0.1072132307822501, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -0.47119485896126323, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -0.6227699647799405, "-"]);

    animations.push(["mixamorigRightHandThumb1", "rotation", "x", -1.242165309190884, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", -0.005079669273334447, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0.4930886962222558, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -0.41545127893433026, "-"]);

    ref.animations.push(animations);

    // Second animation sequence - main action
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -0.9774480962517303, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", 1.3660344629821175, "-"]);
    
    // Add some variation based on the sign name
    animations.push(["mixamorigHead", "rotation", "x", 0.07826976608203179, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0.05662579970755799, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", -0.3298337256247713, "-"]);

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