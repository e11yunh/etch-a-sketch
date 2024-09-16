const gridContainer = document.querySelector("#grid-container");
let new_size;
let drawing_mode = false;
let erase_mode = true;
let rgb_mode = false;


function generate_grid(x_num = 16, y_num = 16) {
    let gridH = x_num;
    let gridV = y_num;
    for (let i = 0; i < gridV; i++) {
        const gridRow = document.createElement("div");
        gridRow.classList.add("grid-row");

        for (let j = 0; j < gridH; j++) {
            const grid = document.createElement("div");
            grid.classList.add("grid-element");

            gridRow.appendChild(grid);
        }

        gridContainer.appendChild(gridRow);
    };
};

function reset_grid () {
    gridContainer.replaceChildren();
    generate_grid(new_size, new_size);
}

function draw(event) {
    event.currentTarget.classList.add("active");
    event.currentTarget.style.backgroundColor = "black";
}

function erase(event) {
    event.currentTarget.classList.remove("active");
    event.currentTarget.style.backgroundColor = "white";
};

function generate_rgb (opacity=0.6) {
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
    let r = randomBetween(0, 255);
    let g = randomBetween(0, 255);
    let b = randomBetween(0, 255);

    return `rgb(${r},${g},${b},${opacity})`;
}

function draw_rainbow (event, opacity) {

    event.currentTarget.style.backgroundColor = generate_rgb(opacity);
}

function darken_square(event) {
    const target = event.currentTarget;

    // This line retrieves the opacity data attribute from the target
    let currentOpacity = parseFloat(target.dataset.opacity);

    if(isNaN(currentOpacity)) {
        currentOpacity = 0;
    };

    currentOpacity = Math.min(currentOpacity + 0.1, 1.0);

    // This line is needed in order to save/remember the new opacity value for each target
    target.dataset.opacity = currentOpacity;

    // This line applies the visual changes onto each grid 
    target.style.opacity = currentOpacity;
}

// Event handler for buttons
const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
    button.addEventListener("mouseenter", (event) => {
        event.currentTarget.classList.toggle("active");
    });
    button.addEventListener("mouseleave", (event) => {
        event.currentTarget.classList.toggle("active");
    });
    button.addEventListener('click', (e) => {
        let btn_clicked = e.currentTarget;
        let btn_id = btn_clicked.id
        switch (btn_id) {
            case "reset-btn":
                reset_grid();
                e.stopImmediatePropagation();
                break;
            case "resize-btn":
                let valid_input = false;
                while (!valid_input) {
                    new_size = prompt("Please choose the number of squares for each side [1 - 100]:");
                    if (new_size === null) {
                        break
                    };

                    new_size = Number(new_size);

                    if (Number.isInteger(new_size) && (new_size >= 1 && new_size <= 100)) {
                        valid_input = true;
                        break;
                    };

                };
                reset_grid();
                e.stopPropagation();
                break;
            case "draw-btn":
                drawing_mode = !drawing_mode;
                erase_mode = false;
                rgb_mode = false;



                const gridElem = document.querySelectorAll(".grid-element");
                if (drawing_mode && (!erase_mode &&!rgb_mode)) {
                    btn_clicked.classList.toggle("btn-active");
                    gridElem.forEach((grid) => {
                        grid.addEventListener("mouseenter", draw);
                        grid.addEventListener("mouseenter", darken_square)
                    });
                } else {
                    btn_clicked.classList.toggle("btn-active");
                    gridElem.forEach((grid) => {
                        grid.removeEventListener("mouseenter", draw);
                        grid.removeEventListener("mouseenter", darken_square)
                    });
                };
                break;
            case "erase-btn":
                drawing_mode = false;
                rgb_mode = false; 
                erase_mode = !erase_mode;

                const gridElemToErase = document.querySelectorAll(".grid-element");
                
                if ((!drawing_mode &&!rgb_mode) && erase_mode) {
                    btn_clicked.classList.toggle("btn-active");
                    gridElemToErase.forEach((grid) => {
                        grid.addEventListener("mouseenter", erase);
                    });
                } else {
                    btn_clicked.classList.toggle("btn-active");
                    gridElemToErase.forEach((grid) => {
                        grid.removeEventListener("mouseenter", erase);
                    });
                };
                break;
            case "rgb-btn":
                rgb_mode = !rgb_mode;
                erase_mode = false;
                drawing_mode = false;

                const gridElemRGB = document.querySelectorAll(".grid-element");

                if (rgb_mode) {
                    btn_clicked.classList.toggle("btn-rgb-active");
                    gridElemRGB.forEach((grid) => {
                        let a = 0.25;
                        grid.addEventListener("mouseenter", draw_rainbow);
                        grid.addEventListener("mouseenter", darken_square)
                    });
                } else {
                    gridElemRGB.forEach((grid) => {
                        btn_clicked.classList.toggle("btn-rgb-active");
                        grid.removeEventListener("mouseenter", draw_rainbow);
                        grid.addEventListener("mouseenter", darken_square);
                    });
                };
        };
    });
});

// Event handler for main grid 

document.addEventListener('DOMContentLoaded', () => {
    generate_grid();
})