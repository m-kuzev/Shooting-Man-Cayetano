//TODO: Red lased on the sniper!
//TODO: Sprites!!!
//TODO: Pivot point for mouse event!

// Create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('c');

// Testing the SPRITE functionality!!!
fabric.Object.prototype.originX = 'center';
fabric.Object.prototype.originY = 'center';
fabric.Object.prototype.transparentCorners = false;

// Define the sniper image and movement
fabric.Image.fromURL('imgs/sniper-main.png', function (oImg) {
    var deg;
    var distance;
    var initialSniperLeft = 600;
    var initialSniperTop = 300;
    var sniperDistanceMultiplier = 5;
    var rocketDistanceMultiplier = 1.5;

    canvas.add(oImg);
    oImg.set('left', initialSniperLeft);
    oImg.set('top', initialSniperTop);
    canvas.renderAll();

    // Define angle of the sniper
    canvas.on('mouse:move', function (options) {
        var deltaX = oImg.left - options.e.clientX;
        var deltaY = oImg.top - options.e.clientY;
        distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        deg = Math.atan2(deltaX, deltaY) * (180 / Math.PI);

        oImg.setAngle(180 - deg);

        canvas.renderAll();
    });

    // Define movement-endpoint of the sniper
    $('canvas').bind('contextmenu', function (options) {
        // Define mouse coordinates
        var left = options.clientX;
        var top = options.clientY;

        // Animations - image
        oImg.animate({ left: left, top: top }, {
            onChange: canvas.renderAll.bind(canvas),
            duration: distance * sniperDistanceMultiplier
        });
    });

    // Define the rocket image and movement
    canvas.on('mouse:down', function (options) {
        fabric.Image.fromURL('imgs/rocket-main.png', function (rocket) {

            canvas.add(rocket);
            rocket.set('left', oImg.left);
            rocket.set('top', oImg.top);
            rocket.set('angle', 180 - deg);
            canvas.renderAll();

            // Define mouse coordinates
            var left = options.e.clientX;
            var top = options.e.clientY;

            // Animations - image
            rocket.animate({ left: left, top: top }, {
                onChange: canvas.renderAll.bind(canvas),
                duration: distance * rocketDistanceMultiplier,
                onComplete: function () {
                    canvas.remove(rocket);
                    fabric.Image.fromURL('imgs/explosion-main.png', function (explosion) {
                        canvas.add(explosion);
                        explosion.set('left', left);
                        explosion.set('top', top);
                        canvas.renderAll();

                        setTimeout(function () {
                            canvas.remove(explosion);
                        }, 500);
                    });
                }
            });
        });
    });
});

// Define right mouse-click action
// Disable context menu
$('canvas').bind('contextmenu', function (e) {
    // Define mouse coordinates
    var left = e.clientX;
    var top = e.clientY;

    //    Create and add the direction circle
    var circleRadius = 5;
    var circle = new fabric.Circle({
        radius: circleRadius,
        stroke: '#ff0000',
        fill: '#252729',
        strokeWidth: 1,
        left: left - circleRadius,
        top: top - circleRadius
    });

    canvas.add(circle);

    // Animations - circle
    var circleRadiusDifference = 20;
    circle.animate({
            strokeWidth: 3,
            radius: circleRadius + circleRadiusDifference,
            opacity: 0
        },
        {
            onChange: canvas.renderAll.bind(canvas),
            duration: 400,
            onComplete: function () {
                canvas.remove(circle);
            }
        });

    e.preventDefault();
});