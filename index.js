const cube = document.getElementById("cube");

const clickOnSide = (side) => {
    const activeSide = cube.dataset.side;
    if (activeSide !== side) {
        cube.classList.replace(`show-${activeSide}`, `show-${side}`);
        cube.setAttribute("data-side", side);
    }
};

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const sideToTurn = e.target.dataset.side;
        if (sideToTurn) {
            clickOnSide(sideToTurn);
        }
    });
});