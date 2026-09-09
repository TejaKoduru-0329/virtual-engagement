/* =========================================
   VIRTUAL ENGAGEMENT
   SOWMYA ❤️ KRUPAKAR REDDY
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
    "https://dezxtsolyhgbhlxmselp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_o0RGALiaHxdeoGP5vqke6Q_vLAZt-PK";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================
   DOM
========================================= */

const app =
    document.getElementById("app");

const enterButton =
    document.getElementById("enterButton");

const ceremonyMusic =
    document.getElementById("ceremonyMusic");

const continueButton =
    document.getElementById("continueButton");

const worldsScene =
    document.getElementById("worlds");

const ringScene =
    document.getElementById("ringScene");

const waitingState =
    document.getElementById("waitingState");

const connectedState =
    document.getElementById("connectedControls");

const openingScene =
    document.getElementById("opening");

const fallingHearts =
    document.getElementById("fallingHearts");


/* =========================================
   ROLE / ROOM
========================================= */

const params =
    new URLSearchParams(window.location.search);

const role =
    params.get("role");

const hasSelectedRole =
    role === "bride" || role === "groom";

if (!hasSelectedRole) {
    document.body.classList.add("role-not-selected");
}

/* =========================================
   ROLE SELECTION
========================================= */

const roleGate =
    document.getElementById("roleGate");

const roleOptions =
    document.querySelectorAll(".role-option");

if (roleGate) {

    // If role already exists in URL,
    // the user has already selected their role.
    if (role === "bride" || role === "groom") {

        roleGate.classList.add("hidden");

    } else {

        roleOptions.forEach((button) => {

            button.addEventListener("click", () => {

                const selectedRole =
                    button.dataset.role;

                if (
                    selectedRole !== "bride" &&
                    selectedRole !== "groom"
                ) {
                    return;
                }

                // Keep the same public link.
                // Internally remember the selected role.
                const newUrl =
                    `${window.location.pathname}?role=${selectedRole}`;

                window.location.replace(newUrl);

            });

        });

    }
}

const room =
    params.get("room") || "sowmya-krupakar";

console.log("ROLE:", role);
console.log("ROOM:", room);


/* =========================================
   SCENE STATE
========================================= */

/*
   opening = Scene 01
   worlds  = Scene 02
   ring    = Scene 03
*/

let myScene = "opening";

let remoteScene = null;

let ceremonyUnlocked = false;

let ceremonyChannel = null;


/* =========================================
   CEREMONY STATE
========================================= */

let currentTurn = "bride";

let ringBoxOpened = false;

let dragging = false;

let ringPlaced = false;

let remoteActionActive = false;

let offsetX = 0;

let offsetY = 0;

let finaleShown = false;

const placedRoles =
    new Set();


/* =========================================
   SCENE NAVIGATION
========================================= */

function goToScene(scene) {

    if (!scene || !app)
        return;

    app.scrollTo({
        top: scene.offsetTop,
        behavior: "smooth"
    });
}


/* =========================================
   LOCK USER SCROLLING
========================================= */

if (app) {

    app.addEventListener(
        "wheel",
        event => {
            event.preventDefault();
        },
        { passive: false }
    );

    app.addEventListener(
        "touchmove",
        event => {
            event.preventDefault();
        },
        { passive: false }
    );
}


/* =========================================
   FALLING HEARTS
========================================= */

function createFallingHearts() {

    if (!fallingHearts)
        return;

    const count =
        window.innerWidth < 700
            ? 12
            : 20;

    for (let i = 0; i < count; i++) {

        const heart =
            document.createElement("span");

        heart.className =
            "falling-heart";

        heart.innerHTML =
            Math.random() > 0.35
                ? "♡"
                : "♥";

        heart.style.left =
            `${Math.random() * 100}%`;

        heart.style.setProperty(
            "--heart-size",
            `${8 + Math.random() * 12}px`
        );

        heart.style.setProperty(
            "--heart-duration",
            `${7 + Math.random() * 8}s`
        );

        heart.style.setProperty(
            "--heart-delay",
            `${Math.random() * -12}s`
        );

        heart.style.setProperty(
            "--heart-drift",
            `${-40 + Math.random() * 80}px`
        );

        fallingHearts.appendChild(
            heart
        );
    }
}

createFallingHearts();


/* =========================================
   OPENING WAITING STATE
========================================= */

function showWaitingState() {

    if (!waitingState)
        return;

    waitingState.classList.remove(
        "hidden"
    );

    if (openingScene) {

        openingScene.classList.remove(
            "connected"
        );

        openingScene.classList.remove(
            "connected-atmosphere"
        );
    }
}


function showConnectedState() {

    if (!waitingState)
        return;

    waitingState.classList.add(
        "hidden"
    );

    if (openingScene) {

        openingScene.classList.add(
            "connected"
        );

        openingScene.classList.add(
            "connected-atmosphere"
        );
    }
}


/* =========================================
   ENTER CELEBRATION
========================================= */

if (enterButton) {

    enterButton.addEventListener(
        "click",
        () => {

            if (!worldsScene)
                return;


            myScene = "worlds";

            updatePresenceScene();


            if (ceremonyMusic) {

                ceremonyMusic.currentTime = 0;

                ceremonyMusic
                    .play()
                    .catch(() => {});
            }


            goToScene(
                worldsScene
            );


            worldsScene.classList.add(
                "active"
            );


            setTimeout(
                () => {

                    startHeartArrow();

                },
                200
            );
        }
    );
}


/* =========================================
   SCENE 03 ELEMENTS
========================================= */

const ring =
    document.getElementById(
        "draggableRing"
    );

const targetHand =
    document.getElementById(
        "targetHand"
    );

const targetFinger =
    document.getElementById(
        "targetFinger"
    );

const ringBox =
    document.getElementById(
        "ringBox"
    );

const ringInstruction =
    document.getElementById(
        "ringInstruction"
    );

const ringStatus =
    document.getElementById(
        "ringStatus"
    );

const remoteActivity =
    document.getElementById(
        "remoteActivity"
    );

const remoteActivityText =
    document.getElementById(
        "remoteActivityText"
    );

const ringChant =
    document.getElementById(
        "ringChant"
    );

const engagementFinale =
    document.getElementById(
        "engagementFinale"
    );


/* =========================================
   SCENE 03 WAITING SCREEN
========================================= */

function createRingWaitingScreen() {

    if (!ringScene)
        return null;


    let screen =
        document.getElementById(
            "ringWaitingScreen"
        );


    if (screen)
        return screen;


    screen =
        document.createElement(
            "div"
        );


    screen.id =
        "ringWaitingScreen";


    screen.innerHTML = `
        <div class="ring-waiting-inner">

            <div class="waiting-ornament">
                <span></span>
                <i>♡</i>
                <span></span>
            </div>

            <p class="waiting-eyebrow">
                THE MOMENT AWAITS
            </p>

            <h2>
                Waiting for<br>
                <em>the other half.</em>
            </h2>

            <p class="waiting-copy">
                The ring ceremony will begin
                when both hearts arrive.
            </p>

            <div class="waiting-pulse">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    `;


    ringScene.appendChild(
        screen
    );


    return screen;
}


const ringWaitingScreen =
    createRingWaitingScreen();


/* =========================================
   SHOW RING WAITING
========================================= */

function showRingWaiting() {

    if (!ringWaitingScreen)
        return;


    if (ceremonyUnlocked)
        return;


    ringWaitingScreen.classList.remove(
        "hidden"
    );

    ringWaitingScreen.classList.remove(
        "unlocking"
    );
}


/* =========================================
   UNLOCK RING CEREMONY
========================================= */

function unlockRingCeremony() {

    if (
        ceremonyUnlocked ||
        !ringWaitingScreen
    ) {
        return;
    }


    console.log(
        "💍 BOTH ARE IN SCENE 03"
    );


    ceremonyUnlocked = true;


    ringWaitingScreen.classList.add(
        "unlocking"
    );


    setTimeout(
        () => {

            ringWaitingScreen.classList.add(
                "hidden"
            );


            setupRingCeremony();


        },
        1000
    );
}


/* =========================================
   AUDIO PRIME
========================================= */

function primeRingAudio() {

    if (!ringChant)
        return;


    try {

        ringChant.volume = 1;


        const promise =
            ringChant.play();


        if (promise) {

            promise
                .then(() => {

                    ringChant.pause();

                    ringChant.currentTime = 0;

                })
                .catch(() => {});
        }


    } catch (error) {

        console.log(
            "Audio prime failed:",
            error
        );
    }
}


/* =========================================
   UPDATE PRESENCE
========================================= */

async function updatePresenceScene() {

    if (!ceremonyChannel)
        return;


    try {

        await ceremonyChannel.track({

            role: role,

            name:
                role === "bride"
                    ? "Sowmya"
                    : "Krupakar Reddy",

            location:
                role === "bride"
                    ? "USA"
                    : "India",

            scene: myScene,

            onlineAt:
                new Date().toISOString()

        });


        console.log(
            "📍 MY SCENE:",
            myScene
        );


    } catch (error) {

        console.error(
            "Presence update failed:",
            error
        );
    }
}


/* =========================================
   CONTINUE → SCENE 03
========================================= */

if (continueButton) {

    continueButton.addEventListener(
        "click",
        async () => {

            if (!ringScene)
                return;


            /*
               Stop Scene 02 music.
            */

            if (ceremonyMusic) {

                ceremonyMusic.pause();

                ceremonyMusic.currentTime = 0;
            }


            /*
               We are actually entering
               Scene 03 now.
            */

            myScene = "ring";

            ceremonyUnlocked = false;


            /*
               Prime audio during user gesture.
            */

            primeRingAudio();


            /*
               ALWAYS show waiting first.
            */

            showRingWaiting();


            /*
               Tell Supabase we are now
               physically in Scene 03.
            */

            await updatePresenceScene();


            /*
               Move to Scene 03.
            */

            goToScene(
                ringScene
            );


            /*
               If the other person is
               already in Scene 03,
               unlock immediately.
            */

            checkSceneReady();
        }
    );
}


/* =========================================
   CHECK SCENE 03 READINESS
========================================= */

function checkSceneReady() {

    if (
        myScene === "ring" &&
        remoteScene === "ring"
    ) {

        unlockRingCeremony();

    } else {

        showRingWaiting();
    }
}


/* =========================================
   PERSON NAME
========================================= */

function personName(
    personRole
) {

    return personRole === "bride"
        ? "Sowmya"
        : "Krupakar Reddy";
}


/* =========================================
   REMOTE ACTIVITY
========================================= */

function showRemoteActivity(
    message
) {

    if (
        !remoteActivity ||
        !remoteActivityText
    ) {
        return;
    }


    remoteActivityText.textContent =
        message;


    remoteActivity.classList.add(
        "show"
    );
}


/* =========================================
   CHANT
========================================= */

function startChant() {

    if (!ringChant)
        return;


    ringChant.volume = 1;


    ringChant
        .play()
        .catch(error => {

            console.log(
                "Chant playback:",
                error
            );
        });
}


function stopChant() {

    if (!ringChant)
        return;


    ringChant.pause();

    ringChant.currentTime = 0;
}


/* =========================================
   BROADCAST
========================================= */

function broadcastRingEvent(
    payload
) {

    if (!ceremonyChannel)
        return;


    ceremonyChannel
        .send({

            type: "broadcast",

            event: "ring-ceremony",

            payload

        })
        .catch(error => {

            console.error(
                "Broadcast error:",
                error
            );
        });
}


/* =========================================
   PUT RING INSIDE BOX
========================================= */

function positionRingInBox() {

    if (
        !ring ||
        !ringBox ||
        !ringScene
    ) {
        return;
    }


    const stage =
        ringScene.querySelector(
            ".ring-stage"
        );


    if (!stage)
        return;


    const stageRect =
        stage.getBoundingClientRect();

    const boxRect =
        ringBox.getBoundingClientRect();


    const ringWidth =
        ring.offsetWidth || 40;

    const ringHeight =
        ring.offsetHeight || 40;


    const x =
        boxRect.left +
        boxRect.width / 2 -
        stageRect.left -
        ringWidth / 2;


    const y =
        boxRect.top +
        boxRect.height * .38 -
        stageRect.top -
        ringHeight / 2;


    ring.style.left =
        `${x}px`;

    ring.style.top =
        `${y}px`;

    ring.style.transform =
        "scale(.68)";
}


/* =========================================
   SETUP CEREMONY
========================================= */

function setupRingCeremony() {

    if (!ceremonyUnlocked)
        return;


    /*
       Bride sees groom's hand.
       Groom sees bride's hand.
    */

    if (targetHand) {

        targetHand.classList.remove(
            "hand-bride",
            "hand-groom"
        );


        if (role === "bride") {

            targetHand.classList.add(
                "hand-groom"
            );

        } else {

            targetHand.classList.add(
                "hand-bride"
            );
        }
    }


    /*
       Remove old Your / Their Moment.
    */

    const ceremonyRole =
        document.getElementById(
            "ceremonyRole"
        );


    if (ceremonyRole) {

        ceremonyRole.style.display =
            "none";
    }


    resetLocalRing();

    updateTurnUI();
}


/* =========================================
   RESET LOCAL RING
========================================= */

function resetLocalRing() {

    ringBoxOpened = false;

    dragging = false;

    ringPlaced = false;

    remoteActionActive = false;


    if (ringBox) {

        ringBox.classList.remove(
            "open",
            "picked-up",
            "remote-picked-up"
        );

        ringBox.setAttribute(
            "aria-expanded",
            "false"
        );

        ringBox.disabled =
            role !== currentTurn;
    }


    if (ring) {

        ring.classList.remove(
            "placed",
            "dragging",
            "revealed"
        );

        ring.style.opacity =
            "0";

        ring.style.visibility =
            "hidden";
    }


    if (ringStatus) {

        ringStatus.classList.remove(
            "success"
        );

        ringStatus.innerHTML =
            `<span>✦</span> OPEN THE RING BOX <span>✦</span>`;
    }
}


/* =========================================
   TURN UI
========================================= */

function updateTurnUI() {

    if (!ceremonyUnlocked)
        return;


    const myTurn =
        role === currentTurn;


    if (ringBox) {

        ringBox.disabled =
            !myTurn ||
            remoteActionActive;


        ringBox.classList.toggle(
            "locked",
            !myTurn ||
            remoteActionActive
        );
    }


    if (
        ringInstruction &&
        !ringBoxOpened &&
        !ringPlaced
    ) {

        if (myTurn) {

            ringInstruction.textContent =
                "Open the ring box.";

        } else {

            ringInstruction.textContent =
                `${personName(currentTurn)} is preparing the moment...`;
        }
    }
}


/* =========================================
   OPEN RING BOX
========================================= */

function openRingBox() {

    if (
        !ceremonyUnlocked ||
        ringBoxOpened ||
        ringPlaced ||
        remoteActionActive
    ) {
        return;
    }


    /*
       Only current turn can open.
    */

    if (
        role !== currentTurn
    ) {

        showRemoteActivity(
            "Your moment is coming..."
        );

        return;
    }


    ringBoxOpened = true;


    if (ringBox) {

        ringBox.classList.add(
            "open"
        );

        ringBox.setAttribute(
            "aria-expanded",
            "true"
        );
    }


    /*
       Ring becomes visible
       inside the box.
    */

    if (ring) {

        ring.style.opacity =
            "1";

        ring.style.visibility =
            "visible";

        ring.classList.add(
            "revealed"
        );

        positionRingInBox();
    }


    if (ringInstruction) {

        ringInstruction.textContent =
            "Take the ring from the box.";
    }


    if (ringStatus) {

        ringStatus.innerHTML =
            `<span>✦</span> TAKE THE RING <span>✦</span>`;
    }


    broadcastRingEvent({

        type: "box-opened",

        role: role

    });
}


if (ringBox) {

    ringBox.addEventListener(
        "click",
        openRingBox
    );
}


/* =========================================
   START RING DRAG
========================================= */

if (ring) {

    ring.addEventListener(
        "pointerdown",
        event => {

            if (
                !ceremonyUnlocked ||
                ringPlaced ||
                dragging ||
                !ringBoxOpened ||
                remoteActionActive ||
                role !== currentTurn
            ) {
                return;
            }


            dragging = true;


            try {

                ring.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}


            const rect =
                ring.getBoundingClientRect();


            offsetX =
                event.clientX -
                rect.left -
                rect.width / 2;


            offsetY =
                event.clientY -
                rect.top -
                rect.height / 2;


            ring.classList.add(
                "dragging"
            );


            ring.style.transition =
                "none";


            /*
               Box disappears when
               ring is picked up.
            */

            if (ringBox) {

                ringBox.classList.add(
                    "picked-up"
                );
            }


            /*
               BOTH USERS PLAY CHANT.
            */

            startChant();


            /*
               Tell remote user.
            */

            broadcastRingEvent({

                type: "ring-started",

                role: role

            });


            if (ringInstruction) {

                ringInstruction.textContent =
                    "Place the ring on the finger.";
            }
        }
    );


    /* =====================================
       DRAG MOVE
    ===================================== */

    ring.addEventListener(
        "pointermove",
        event => {

            if (
                !dragging ||
                ringPlaced
            ) {
                return;
            }


            const stage =
                ringScene?.querySelector(
                    ".ring-stage"
                );


            if (
                !stage ||
                !targetFinger
            ) {
                return;
            }


            const stageRect =
                stage.getBoundingClientRect();


            const x =
                event.clientX -
                stageRect.left -
                ring.offsetWidth / 2 -
                offsetX;


            const y =
                event.clientY -
                stageRect.top -
                ring.offsetHeight / 2 -
                offsetY;


            ring.style.left =
                `${x}px`;

            ring.style.top =
                `${y}px`;


            const ringRect =
                ring.getBoundingClientRect();

            const fingerRect =
                targetFinger.getBoundingClientRect();


            const ringX =
                ringRect.left +
                ringRect.width / 2;

            const ringY =
                ringRect.top +
                ringRect.height / 2;


            const fingerX =
                fingerRect.left +
                fingerRect.width / 2;

            const fingerY =
                fingerRect.top +
                fingerRect.height / 2;


            const distance =
                Math.hypot(
                    ringX - fingerX,
                    ringY - fingerY
                );


            targetFinger.classList.toggle(
                "target-active",
                distance < 85
            );
        }
    );


    /* =====================================
       DROP
    ===================================== */

    ring.addEventListener(
        "pointerup",
        () => {

            if (
                !dragging ||
                ringPlaced
            ) {
                return;
            }


            dragging = false;


            ring.classList.remove(
                "dragging"
            );


            targetFinger?.classList.remove(
                "target-active"
            );


            const ringRect =
                ring.getBoundingClientRect();

            const fingerRect =
                targetFinger.getBoundingClientRect();


            const ringX =
                ringRect.left +
                ringRect.width / 2;

            const ringY =
                ringRect.top +
                ringRect.height / 2;


            const fingerX =
                fingerRect.left +
                fingerRect.width / 2;

            const fingerY =
                fingerRect.top +
                fingerRect.height / 2;


            const distance =
                Math.hypot(
                    ringX - fingerX,
                    ringY - fingerY
                );


            if (
                distance < 85
            ) {

                placeRing();

            } else {

                /*
                   Return ring to box.
                */

                ring.style.transition =
                    "left .55s cubic-bezier(.2,1.4,.4,1), top .55s cubic-bezier(.2,1.4,.4,1), transform .35s ease";


                positionRingInBox();


                if (ringStatus) {

                    ringStatus.innerHTML =
                        `<span>✦</span> BRING IT CLOSER <span>✦</span>`;
                }
            }
        }
    );


    ring.addEventListener(
        "pointercancel",
        () => {

            dragging = false;

            ring.classList.remove(
                "dragging"
            );

            targetFinger?.classList.remove(
                "target-active"
            );
        }
    );
}


/* =========================================
   PLACE RING
========================================= */

function placeRing() {

    if (
        ringPlaced ||
        !ring ||
        !targetFinger ||
        !ringScene
    ) {
        return;
    }


    ringPlaced = true;


    placedRoles.add(
        role
    );


    const stage =
        ringScene.querySelector(
            ".ring-stage"
        );


    if (!stage)
        return;


    const stageRect =
        stage.getBoundingClientRect();

    const fingerRect =
        targetFinger.getBoundingClientRect();


    const finalX =
        fingerRect.left +
        fingerRect.width / 2 -
        stageRect.left -
        ring.offsetWidth / 2;


    const finalY =
        fingerRect.top +
        fingerRect.height / 2 -
        stageRect.top -
        ring.offsetHeight / 2;


    ring.style.transition =
        "left .7s cubic-bezier(.2,1.5,.4,1), top .7s cubic-bezier(.2,1.5,.4,1), transform .45s ease";


    ring.style.left =
        `${finalX}px`;

    ring.style.top =
        `${finalY}px`;

    ring.style.transform =
        "scale(.72)";


    ring.classList.add(
        "placed"
    );


    targetFinger.classList.add(
        "target-active"
    );


    if (ringStatus) {

        ringStatus.innerHTML =
            `<span>✦</span> RING PLACED <span>✦</span>`;

        ringStatus.classList.add(
            "success"
        );
    }


    /*
       Send next turn together with
       ring-placed event.
    */

    const nextTurn =
        role === "bride"
            ? "groom"
            : "bride";


    broadcastRingEvent({

        type: "ring-placed",

        role: role,

        nextTurn: nextTurn

    });


    /*
       FIRST RING
    */

    if (
        placedRoles.size < 2
    ) {

        currentTurn =
            nextTurn;


        if (ringInstruction) {

            ringInstruction.textContent =
                "The moment is now yours.";
        }


        return;
    }


    /*
       SECOND RING
    */

    ceremonyComplete();
}
/* =========================================
   REMOTE RING VISUAL MOVEMENT
========================================= */

function animateRemoteRingToFinger() {

    if (!ring || !targetFinger)
        return;

    const stage =
        document.querySelector(".ring-stage");

    if (!stage)
        return;

    const stageRect =
        stage.getBoundingClientRect();

    const boxRect =
        ringBox
            ? ringBox.getBoundingClientRect()
            : null;

    const fingerRect =
        targetFinger.getBoundingClientRect();

    if (!boxRect)
        return;

    const startX =
        boxRect.left +
        boxRect.width / 2 -
        stageRect.left -
        ring.offsetWidth / 2;

    const startY =
        boxRect.top +
        boxRect.height / 2 -
        stageRect.top -
        ring.offsetHeight / 2;

    const endX =
        fingerRect.left +
        fingerRect.width / 2 -
        stageRect.left -
        ring.offsetWidth / 2;

    const endY =
        fingerRect.top +
        fingerRect.height / 2 -
        stageRect.top -
        ring.offsetHeight / 2;

    const startTime =
        performance.now();

    const duration = 2200;

    ring.style.transition = "none";

    ring.style.left =
        `${startX}px`;

    ring.style.top =
        `${startY}px`;

    ring.style.transform =
        "translate(0, 0) scale(1)";

    ring.classList.add(
        "remote-moving"
    );

    ring.classList.add(
        "revealed"
    );

    function animate(now) {

        const progress =
            Math.min(
                (now - startTime) /
                duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const x =
            startX +
            (endX - startX) *
            eased;

        const y =
            startY +
            (endY - startY) *
            eased;

        ring.style.left =
            `${x}px`;

        ring.style.top =
            `${y}px`;

        /*
           Small elegant lift while moving
        */
        const lift =
            Math.sin(
                progress * Math.PI
            ) * -35;

        ring.style.transform =
            `translate(0, ${lift}px) scale(${1 - progress * 0.18})`;

        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            ring.style.left =
                `${endX}px`;

            ring.style.top =
                `${endY}px`;

            ring.style.transform =
                "translate(0, 0) scale(.82)";

            ring.classList.remove(
                "remote-moving"
            );

            targetFinger.classList.add(
                "target-active"
            );
        }
    }

    requestAnimationFrame(
        animate
    );
}

/* =========================================
   REMOTE RING EVENTS
========================================= */

function handleRemoteRingEvent(
    payload
) {

    if (!payload)
        return;


    /*
       Ignore our own events.
    */

    if (
        payload.role &&
        payload.role === role
    ) {
        return;
    }


    const remoteName =
        personName(
            payload.role
        );


    /* =====================================
       REMOTE BOX OPENED
    ===================================== */

    if (
        payload.type ===
        "box-opened"
    ) {

        showRemoteActivity(
            `${remoteName} has opened the ring box.`
        );

        return;
    }


    /* =====================================
       REMOTE RING STARTED
    ===================================== */

    if (
        payload.type ===
        "ring-started"
    ) {

        /*
        REMOTE PERSON HAS PICKED UP
        THE RING.
        */

        if (ringBox) {

            /*
            Keep the box visible for a moment
            so the ring appears to come from it.
            */

            ringBox.classList.add(
                "remote-picked-up"
            );
        }

        /*
        SHOW THE SAME RING ON THIS SCREEN
        AND ANIMATE IT TOWARD THE FINGER.
        */

        if (ring) {

            ring.classList.remove(
                "placed",
                "dragging"
            );

            ring.classList.add(
                "revealed"
            );
        }

        /*
        BOTH SIDES PLAY CHANT.
        */

        startChant();

        /*
        IMPORTANT MESSAGE
        */

        showRemoteActivity(
            `${remoteName} is placing the ring on your finger...`
        );

        if (ringInstruction) {

            ringInstruction.textContent =
                `${remoteName} is placing the ring on your finger...`;
        }

        /*
        LOCK THIS SIDE WHILE
        REMOTE RING IS MOVING.
        */

        if (ringBox) {

            ringBox.disabled = true;

            ringBox.classList.add(
                "locked"
            );
        }

        /*
        START THE VISUAL RING JOURNEY.
        */

        setTimeout(
            animateRemoteRingToFinger,
            120
        );

        return;
    }

    /* =====================================
       REMOTE RING PLACED
    ===================================== */

    if (
        payload.type ===
        "ring-placed"
    ) {

        placedRoles.add(
            payload.role
        );


        remoteActionActive = false;


        showRemoteActivity(
            `${remoteName} has placed the ring. ❤️`
        );


        if (ringStatus) {

            ringStatus.innerHTML =
                `<span>♡</span> ${remoteName.toUpperCase()} HAS PLACED THE RING <span>♡</span>`;
        }


        /*
           BOTH DONE
        */

        if (
            placedRoles.size >= 2
        ) {

            ceremonyComplete();

            return;
        }


        /*
           Next turn.
        */

        currentTurn =
            payload.nextTurn ||
            (
                payload.role === "bride"
                    ? "groom"
                    : "bride"
            );


        /*
           If it is MY turn,
           restore a fresh ring box.
        */

        if (
            role === currentTurn
        ) {

            ringBoxOpened = false;

            ringPlaced = false;

            remoteActionActive = false;


            if (ringBox) {

                ringBox.disabled =
                    false;

                ringBox.classList.remove(
                    "locked",
                    "open",
                    "picked-up",
                    "remote-picked-up"
                );

                ringBox.setAttribute(
                    "aria-expanded",
                    "false"
                );

                ringBox.style.opacity =
                    "1";

                ringBox.style.visibility =
                    "visible";

                ringBox.style.pointerEvents =
                    "auto";
            }


            if (ring) {

                ring.classList.remove(
                    "placed",
                    "dragging",
                    "revealed"
                );

                ring.style.opacity =
                    "0";

                ring.style.visibility =
                    "hidden";
            }


            if (ringInstruction) {

                ringInstruction.textContent =
                    "Your moment has arrived. Open the ring box.";
            }


            if (ringStatus) {

                ringStatus.classList.remove(
                    "success"
                );

                ringStatus.innerHTML =
                    `<span>✦</span> OPEN THE RING BOX <span>✦</span>`;
            }


            showRemoteActivity(
                "The moment is yours. ❤️"
            );

        } else {

            updateTurnUI();
        }


        return;
    }


    /* =====================================
       CEREMONY COMPLETE
    ===================================== */

    if (
        payload.type ===
        "ceremony-complete"
    ) {

        ceremonyComplete();

        return;
    }
}


/* =========================================
   CEREMONY COMPLETE
========================================= */

function ceremonyComplete() {

    if (finaleShown)
        return;


    finaleShown = true;


    placedRoles.add(
        "bride"
    );

    placedRoles.add(
        "groom"
    );


    /*
       STOP SONG ONLY NOW.
    */

    stopChant();


    if (ringStatus) {

        ringStatus.innerHTML =
            `<span>✦</span> TWO RINGS · ONE PROMISE <span>✦</span>`;

        ringStatus.classList.add(
            "success"
        );
    }


    showRemoteActivity(
        "Two promises. One beautiful beginning. ❤️"
    );


    if (ringInstruction) {

        ringInstruction.textContent =
            "Two promises. One beautiful beginning.";
    }


    broadcastRingEvent({

        type: "ceremony-complete"

    });


    setTimeout(
        showFinale,
        1800
    );
}

/* =========================================
   CINEMATIC FIREWORKS
========================================= */

let fireworksCanvas = null;
let fireworksCtx = null;
let fireworksAnimation = null;
let fireworksRunning = false;

const fireworks = [];
const fireworkParticles = [];


function createFireworksCanvas() {

    if (fireworksCanvas)
        return;

    fireworksCanvas =
        document.createElement("canvas");

    fireworksCanvas.className =
        "engagement-fireworks";

    fireworksCanvas.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.appendChild(
        fireworksCanvas
    );

    fireworksCtx =
        fireworksCanvas.getContext("2d");

    resizeFireworks();

    window.addEventListener(
        "resize",
        resizeFireworks
    );
}


function resizeFireworks() {

    if (!fireworksCanvas)
        return;

    fireworksCanvas.width =
        window.innerWidth;

    fireworksCanvas.height =
        window.innerHeight;
}


function launchFirework() {

    if (!fireworksCanvas)
        return;

    const x =
        Math.random() *
        fireworksCanvas.width;

    const targetY =
        fireworksCanvas.height *
        (
            .16 +
            Math.random() * .30
        );

    fireworks.push({

        x,

        y:
            fireworksCanvas.height + 10,

        targetY,

        speed:
            8 +
            Math.random() * 3,

        trail: []

    });
}


function explodeFirework(firework) {

    const count = 70 + Math.floor(
        Math.random() * 35
    );

    const goldenTones = [
        "255,220,150",
        "255,190,90",
        "255,235,190",
        "245,200,120"
    ];

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            1.5 +
            Math.random() * 5;

        fireworkParticles.push({

            x: firework.x,

            y: firework.y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                .012 +
                Math.random() * .012,

            size:
                1 +
                Math.random() * 2,

            color:
                goldenTones[
                    Math.floor(
                        Math.random() *
                        goldenTones.length
                    )
                ]

        });
    }
}


function animateFireworks() {

    if (
        !fireworksCanvas ||
        !fireworksCtx
    ) {
        return;
    }

    const ctx =
        fireworksCtx;

    ctx.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );


    /* ---------------------------------
       ROCKETS
    --------------------------------- */

    for (
        let i = fireworks.length - 1;
        i >= 0;
        i--
    ) {

        const firework =
            fireworks[i];

        firework.trail.push({
            x: firework.x,
            y: firework.y
        });

        if (
            firework.trail.length > 8
        ) {
            firework.trail.shift();
        }


        firework.y -=
            firework.speed;


        ctx.beginPath();

        ctx.moveTo(
            firework.x,
            firework.y
        );

        ctx.lineTo(
            firework.x,
            firework.y + 14
        );

        ctx.strokeStyle =
            "rgba(255,220,150,.8)";

        ctx.lineWidth = 1.5;

        ctx.stroke();


        if (
            firework.y <=
            firework.targetY
        ) {

            explodeFirework(
                firework
            );

            fireworks.splice(
                i,
                1
            );
        }
    }


    /* ---------------------------------
       PARTICLES
    --------------------------------- */

    for (
        let i =
            fireworkParticles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            fireworkParticles[i];


        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.vy +=
            .045;

        particle.vx *=
            .985;

        particle.vy *=
            .985;

        particle.life -=
            particle.decay;


        if (
            particle.life <= 0
        ) {

            fireworkParticles.splice(
                i,
                1
            );

            continue;
        }


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(${particle.color},${particle.life})`;

        ctx.shadowBlur =
            12;

        ctx.shadowColor =
            `rgba(${particle.color},${particle.life})`;

        ctx.fill();

        ctx.shadowBlur = 0;
    }


    if (fireworksRunning) {

        fireworksAnimation =
            requestAnimationFrame(
                animateFireworks
            );
    }
}


function startFireworks() {

    if (fireworksRunning)
        return;

    createFireworksCanvas();

    fireworksRunning = true;

    animateFireworks();


    /*
       Start immediately
    */

    launchFirework();


    /*
       CONTINUOUS FIREWORKS

       New fireworks keep launching randomly
       until the page is refreshed.
    */

    const launchLoop = () => {

        if (!fireworksRunning)
            return;

        launchFirework();

        setTimeout(
            launchLoop,
            700 + Math.random() * 1100
        );
    };


    setTimeout(
        launchLoop,
        500
    );
}

/* =========================================
   FINAL CARD
========================================= */

function showFinale() {

    if (ringScene) {

        ringScene.classList.add(
            "ceremony-finished"
        );
    }


    /*
       Celebration begins exactly
       when the final card appears.
    */

    startFireworks();


    if (engagementFinale) {

        engagementFinale.classList.add(
            "show"
        );
    }
}


/* =========================================
   SUPABASE REALTIME
========================================= */

if (
    role === "bride" ||
    role === "groom"
) {

    ceremonyChannel =
        supabaseClient.channel(
            `virtual-engagement:${room}`,
            {
                config: {

                    presence: {
                        key: role
                    },

                    broadcast: {
                        self: true
                    }

                }
            }
        );


    /* =====================================
       BROADCAST LISTENER
    ===================================== */

    ceremonyChannel.on(
        "broadcast",
        {
            event: "ring-ceremony"
        },
        ({ payload }) => {

            handleRemoteRingEvent(
                payload
            );
        }
    );


    /* =====================================
       PRESENCE SYNC
    ===================================== */

    ceremonyChannel.on(
        "presence",
        {
            event: "sync"
        },
        () => {

            const state =
                ceremonyChannel.presenceState();


            const bridePresence =
                state.bride?.[0];

            const groomPresence =
                state.groom?.[0];


            const brideOnline =
                !!bridePresence;

            const groomOnline =
                !!groomPresence;


            console.log(
                "❤️ PRESENCE:",
                state
            );


            /*
               Opening screen connection.
            */

            if (
                brideOnline &&
                groomOnline
            ) {

                showConnectedState();

            } else {

                showWaitingState();
            }


            /*
               Determine remote person's
               actual current scene.
            */

            const remoteRole =
                role === "bride"
                    ? "groom"
                    : "bride";


            const remotePresence =
                remoteRole === "bride"
                    ? bridePresence
                    : groomPresence;


            remoteScene =
                remotePresence?.scene ||
                null;


            console.log(
                "📍 MY SCENE:",
                myScene,
                "| REMOTE SCENE:",
                remoteScene
            );


            /*
               IMPORTANT:
               Online != Scene 03.

               Both must explicitly be
               inside Scene 03.
            */

            if (
                myScene === "ring"
            ) {

                if (
                    remoteScene === "ring"
                ) {

                    unlockRingCeremony();

                } else {

                    showRingWaiting();
                }
            }
        }
    );


    /* =====================================
       USER JOINED
    ===================================== */

    ceremonyChannel.on(
        "presence",
        {
            event: "join"
        },
        ({ key }) => {

            console.log(
                "❤️ USER JOINED:",
                key
            );
        }
    );


    /* =====================================
       USER LEFT
    ===================================== */

    ceremonyChannel.on(
        "presence",
        {
            event: "leave"
        },
        ({ key }) => {

            console.log(
                "USER LEFT:",
                key
            );


            /*
               If Scene 03 hasn't started,
               go back to waiting.
            */

            if (
                !ceremonyUnlocked &&
                myScene === "ring"
            ) {

                remoteScene = null;

                showRingWaiting();
            }
        }
    );


    /* =====================================
       CONNECT
    ===================================== */

    ceremonyChannel.subscribe(
        async status => {

            console.log(
                "Supabase:",
                status
            );


            if (
                status !==
                "SUBSCRIBED"
            ) {
                return;
            }


            console.log(
                "🔥 CONNECTED TO ROOM:",
                room
            );


            /*
               Initial presence.
            */

            await updatePresenceScene();
        }
    );
}


/* =========================================================
   SCENE 02 — HEART DRAWING
========================================================= */

const heartPath =
    document.querySelector(
        ".heart-path"
    );

const heartArrow =
    document.querySelector(
        ".heart-drawing-arrow"
    );


function startHeartArrow() {

    if (
        !heartPath ||
        !heartArrow
    ) {
        return;
    }


    const svg =
        heartPath.ownerSVGElement;


    const heartContainer =
        heartPath.closest(
            ".cinematic-heart"
        );


    if (
        !svg ||
        !heartContainer
    ) {
        return;
    }


    const pathLength =
        heartPath.getTotalLength();


    const duration =
        10000;


    const startTime =
        performance.now();


    heartPath.style.strokeDasharray =
        `${pathLength}`;


    heartPath.style.strokeDashoffset =
        `${pathLength}`;


    heartArrow.style.opacity =
        "1";


    function animateHeart(now) {

        const elapsed =
            now - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            progress < 0.5
                ? 2 * progress * progress
                : 1 -
                  Math.pow(
                      -2 * progress + 2,
                      2
                  ) / 2;


        const currentLength =
            pathLength * eased;


        heartPath.style.strokeDashoffset =
            `${pathLength - currentLength}`;


        const point =
            heartPath.getPointAtLength(
                currentLength
            );


        const nextDistance =
            Math.min(
                currentLength + 2,
                pathLength
            );


        const nextPoint =
            heartPath.getPointAtLength(
                nextDistance
            );


        const angle =
            Math.atan2(
                nextPoint.y - point.y,
                nextPoint.x - point.x
            ) *
            180 /
            Math.PI;


        const svgRect =
            svg.getBoundingClientRect();


        const containerRect =
            heartContainer.getBoundingClientRect();


        const viewBox =
            svg.viewBox.baseVal;


        const scaleX =
            svgRect.width /
            viewBox.width;


        const scaleY =
            svgRect.height /
            viewBox.height;


        const x =
            (
                svgRect.left -
                containerRect.left
            ) +
            (
                point.x *
                scaleX
            );


        const y =
            (
                svgRect.top -
                containerRect.top
            ) +
            (
                point.y *
                scaleY
            );


        heartArrow.style.left =
            `${x}px`;


        heartArrow.style.top =
            `${y}px`;


        heartArrow.style.transform =
            `
                translate(-50%, -50%)
                rotate(${angle}deg)
            `;


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animateHeart
            );

        } else {

            heartPath.style.strokeDashoffset =
                "0";


            heartArrow.style.opacity =
                "1";


            if (worldsScene) {

                worldsScene.classList.add(
                    "heart-complete"
                );
            }
        }
    }


    requestAnimationFrame(
        animateHeart
    );
}