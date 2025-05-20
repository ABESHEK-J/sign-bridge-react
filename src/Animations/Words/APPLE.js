export const APPLE = (ref) => {
    // Always add the sign name to characters array
    ref.characters.push('APPLE');

    let animations = []

    // First animation sequence - setup
    animations.push(["mixamorigLeftHandThumb1", "rotation", "x", -1.1961310838059913, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "x", 0.014303456076791066, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -0.29969367286679116, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -0.5841898303337081, "-"]);

    animations.push(["mixamorigRightHandThumb1", "rotation", "x", -1.1636457443350425, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0.14285736355771494, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0.4162761511546843, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -0.6199524452778767, "-"]);

    ref.animations.push(animations);

    // Second animation sequence - main action
    animations = []
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -0.9951372927254354, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", 1.2842539273281326, "-"]);

    // Add some variation based on the sign name
    animations.push(["mixamorigHead", "rotation", "x", 0.052662862330508, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0.30200961195692283, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", -0.1411829845247755, "-"]);

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
